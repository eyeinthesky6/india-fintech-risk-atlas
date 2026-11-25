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
  assert.match(index.contents[0].text, /UPI-008[^\n]+Stage: draft[^\n]+Source blocker:/);
});

test('corrections use the fixed triage destination with redirects disabled', async (t) => {
  const snapshot = structuredClone(bundle);
  snapshot.metadata.triageWorkerUrl = 'https://example.invalid';
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ ok: true, queued: true }));
  const server = createAtlasMcpServer(snapshot);
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
    arguments: { record_id: 'UPI-008', note: 'Regression test' },
  });
  assert.equal(JSON.parse(response.content[0].text).submitted_to_triage_worker, true);
  assert.equal(fetch.mock.callCount(), 1);
  const [url, options] = fetch.mock.calls[0].arguments;
  assert.equal(url, 'https://atlas-report-triage.6edroid.workers.dev');
  assert.equal(options.redirect, 'error');
  assert.match(JSON.parse(options.body).pagePath, /\/upi\/untrusted-app-access\/$/);

  fetch.mock.mockImplementation(async () => Response.json({ ok: true, queued: false }));
  const rejected = await client.callTool({
    name: 'submit_correction',
    arguments: { record_id: 'UPI-008', note: 'Regression test' },
  });
  const receipt = JSON.parse(rejected.content[0].text);
  assert.equal(receipt.submitted_to_triage_worker, false);
  assert.match(receipt.private_report_page_url, /\/upi\/untrusted-app-access\/$/);
});
