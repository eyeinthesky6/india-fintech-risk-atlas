import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createAtlasMcpServer } from '../src/server.js';
import { selectSnapshot } from '../src/snapshot.js';

const bundle = JSON.parse(await fs.readFile(new URL('../data/atlas-records.json', import.meta.url), 'utf8'));

async function snapshotFiles(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'atlas-release-test-'));
  const bundledPath = path.join(dir, 'bundle.json');
  const cachePath = path.join(dir, 'cache.json');
  t.after(async () => {
    await fs.rm(bundledPath, { force: true });
    await fs.rm(cachePath, { force: true });
    await fs.rmdir(dir);
  });
  await fs.writeFile(bundledPath, JSON.stringify(bundle));
  return { bundledPath, cachePath };
}

test('the deployed feed can supersede a more recently built bundle', async (t) => {
  const files = await snapshotFiles(t);
  const published = structuredClone(bundle);
  published.metadata.generatedAt = new Date(Date.parse(bundle.metadata.generatedAt) - 60000).toISOString();
  published.records[0].title = 'Current published title';
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json(published));

  assert.deepEqual(await selectSnapshot({ ...files, force: true }), published);
  assert.deepEqual(JSON.parse(await fs.readFile(files.cachePath, 'utf8')), published);
  assert.deepEqual(await selectSnapshot(files), published);
  assert.deepEqual(await selectSnapshot({ ...files, offline: true, force: true }), bundle);
  assert.equal(fetch.mock.callCount(), 1);
});

test('refresh falls back when published data is unavailable or incompatible', async (t) => {
  const files = await snapshotFiles(t);
  const old = structuredClone(bundle);
  old.metadata.version = '1.0.0';
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json(old));
  assert.deepEqual(await selectSnapshot(files), bundle);
  await assert.rejects(fs.access(files.cachePath), { code: 'ENOENT' });

  const previouslyPublished = structuredClone(bundle);
  previouslyPublished.records[0].title = 'Last published title';
  await fs.writeFile(files.cachePath, JSON.stringify(previouslyPublished));
  fetch.mock.mockImplementation(async () => {
    throw new Error('Network unavailable');
  });
  assert.deepEqual(await selectSnapshot({ ...files, force: true }), previouslyPublished);
  assert.deepEqual(JSON.parse(await fs.readFile(files.cachePath, 'utf8')), previouslyPublished);
});

test('tools and LLM index use the selected snapshot and agree on evidence status', async (t) => {
  const published = structuredClone(bundle);
  published.records[0].title = 'Current snapshot title';
  const server = createAtlasMcpServer(published);
  const client = new Client({ name: 'atlas-release-test', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  t.after(async () => {
    await client.close();
    await server.close();
  });
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  const result = await client.callTool({ name: 'search_risk_records', arguments: { review_stage: 'draft' } });
  const record = JSON.parse(result.content[0].text).results.find((item) => item.record_id === 'UPI-008');
  assert.match(record.source_blocker, /IS\/003/);
  const evidence = await client.callTool({ name: 'get_evidence_ledger', arguments: { record_id: 'UPI-008' } });
  const ledger = JSON.parse(evidence.content[0].text);
  assert.equal(ledger.review_stage, 'draft');
  assert.match(ledger.claims.find((claim) => claim.claimId === 'UPI-008-C3').result, /^blocked/);
  const index = await client.readResource({ uri: 'atlas://llms-txt' });
  assert.match(index.contents[0].text, /Current snapshot title/);
  assert.match(index.contents[0].text, /UPI-008[^\n]+Stage: Draft[^\n]+Source blocker:/);
});

test('corrections return a private browser route without sending the draft', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Outbound request'); });
  const server = createAtlasMcpServer(bundle);
  const client = new Client({ name: 'atlas-correction-test', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  t.after(async () => {
    await client.close();
    await server.close();
  });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  const response = await client.callTool({
    name: 'submit_correction',
    arguments: { record_id: 'UPI-008', note: 'Private draft' },
  });
  const draft = JSON.parse(response.content[0].text);
  assert.equal(draft.submitted_to_triage_worker, false);
  assert.equal(fetch.mock.callCount(), 0);
  assert.match(draft.private_report_page_url, /\/upi\/untrusted-app-access\/#report-an-error$/);
  assert.equal(draft.draft.note, 'Private draft');
  assert.ok(!draft.direct_github_issue_url.includes('Private'));
});

test('scope, stable IDs, source metadata and tool validation agree with the research policy', async (t) => {
  const server = createAtlasMcpServer(bundle);
  const client = new Client({ name: 'atlas-data-contract-test', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  t.after(async () => {
    await client.close();
    await server.close();
  });
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  async function call(name, args) {
    const response = await client.callTool({ name, arguments: args });
    assert.ok(!response.isError, response.content[0].text);
    return JSON.parse(response.content[0].text);
  }

  const { controls } = await call('get_persona_controls', { actor: 'Remitter bank' });
  assert.ok(controls.length > 0);
  assert.ok(controls.every((control) => control.owner_ids.includes('remitter-bank')));
  assert.ok(controls.every((control) => control.record_id !== 'CARD-OVERVIEW'));
  assert.ok(controls.every((control) => control.owner !== 'Non-bank PSOs'));

  const all = await call('generate_gap_checklist', { actor: 'all', format: 'json' });
  const psp = await call('generate_gap_checklist', { actor: 'psp-bank', format: 'json' });
  const matching = psp.items.find((item) => item.record_id === 'UPI-009' && item.owner.startsWith('UPI apps'));
  assert.ok(matching);
  assert.match(matching.id, /^CTRL-UPI-009-/);
  assert.ok(all.items.find((item) => item.id === matching.id && item.requirement === matching.requirement));
  assert.ok(all.items.every((item) => item.regulatory_status !== 'proposal'));
  assert.ok(all.items.some((item) => item.record_id === 'UPI-008' && item.owner === 'Non-bank PSOs'));

  const { sources } = await call('list_sources', {});
  for (const name of ['about-upi', 'webhookVerification', 'complaint-register', 'circulars/upi']) {
    assert.ok(sources.some((source) => source.url.endsWith(name)), name);
  }
  const claim = sources.find((source) => source.url.endsWith('npcicircular.pdf')).cited_in_records
    .find((reference) => reference.record_id === 'UPI-008');
  assert.equal(claim.human_checked, false);
  assert.match(claim.claims[0].result, /^blocked/);

  const guide = await call('get_guide_doc', { doc_id: 'upi/coverage' });
  assert.match(guide.content, /\| Draft \| UPI-008 \|/);
  assert.ok(!guide.content.includes('<UpiCoverageSummary'));
  const legacy = await call('get_guide_doc', { doc_id: 'upi-ecosystem' });
  assert.match(legacy.url, /upi-ecosystem/);

  for (const [name, args] of [['get_guide_doc', {}], ['search_risk_records', { query: 42 }]]) {
    const response = await client.callTool({ name, arguments: args });
    assert.equal(response.isError, true);
  }

  const status = await call('mark_record_accurate', { record_id: 'UPI-008' });
  assert.equal(status.confirmed, false);
  assert.equal(status.human_checked, false);
});
