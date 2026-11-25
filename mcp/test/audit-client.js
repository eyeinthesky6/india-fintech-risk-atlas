import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createAtlasMcpServer } from '../src/server.js';

async function runMcpAudit() {
  console.log('=== RUNNING COMPREHENSIVE MCP CLIENT AUDIT ACROSS ALL ENTITIES ===');

  const server = createAtlasMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'audit-client', version: '1.1.0' }, { capabilities: {} });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  let defects = [];

  // 1. Audit Taxonomy
  const taxRes = await client.callTool({ name: 'list_taxonomy' });
  const taxonomy = JSON.parse(taxRes.content[0].text);
  if (!taxonomy.actors || !taxonomy.evidenceLayers) {
    defects.push('Taxonomy is missing actors or evidenceLayers');
  }

  // 2. Audit Every Canonical Record
  const records = [
    'UPI-OVERVIEW', 'UPI-001', 'UPI-002', 'UPI-003', 'UPI-004', 'UPI-005',
    'UPI-006', 'UPI-007', 'UPI-008', 'UPI-009', 'UPI-010', 'UPI-011',
    'UPI-012', 'UPI-013', 'UPI-014', 'UPI-015', 'UPI-016'
  ];

  for (const id of records) {
    const res = await client.callTool({ name: 'get_record', arguments: { record_id: id } });
    if (res.isError) {
      defects.push(`Record lookup failed for ${id}`);
      continue;
    }
    const record = JSON.parse(res.content[0].text);
    if (!record.title) defects.push(`Record ${id} has no title`);
    if (!record.sections || Object.keys(record.sections).length === 0) defects.push(`Record ${id} has empty sections`);
    if (!record.evidenceLayers || record.evidenceLayers.length === 0) defects.push(`Record ${id} has empty evidenceLayers`);

    // Check clean markdown copy
    const copyRes = await client.callTool({ name: 'get_clean_markdown', arguments: { record_id: id } });
    const cleanMd = copyRes.content[0].text;
    if (!cleanMd.includes(id) && !cleanMd.includes(record.title)) defects.push(`Clean markdown missing title/id for ${id}`);
    if (cleanMd.includes('<details>') || cleanMd.includes('</details>')) defects.push(`Clean markdown contains raw HTML details tag for ${id}`);

    // Check evidence ledger
    const ledgerRes = await client.callTool({ name: 'get_evidence_ledger', arguments: { record_id: id } });
    const ledger = JSON.parse(ledgerRes.content[0].text);
    if (!Array.isArray(ledger.claims) || ledger.claims.length === 0) {
      defects.push(`Evidence ledger has no claims for ${id}`);
    }

    // Check knowledge graph
    const kgRes = await client.callTool({ name: 'explore_knowledge_graph', arguments: { record_id: id } });
    const kg = JSON.parse(kgRes.content[0].text);
    if (kg.isError) defects.push(`Knowledge graph failed for ${id}`);
  }

  // 3. Audit Guide Docs
  const guideDocs = [
    'methodology', 'evidence-policy', 'contribute', 'licensing',
    'risk-stack-playbook', 'operator-insights', 'glossary', 'sources', 'coverage', 'upi-ecosystem'
  ];

  for (const doc of guideDocs) {
    const res = await client.callTool({ name: 'get_guide_doc', arguments: { doc_id: doc } });
    if (res.isError) {
      defects.push(`Guide doc lookup failed for ${doc}`);
    } else {
      const g = JSON.parse(res.content[0].text);
      if (!g.title || !g.content) defects.push(`Guide doc ${doc} missing title or content`);
    }
  }

  // 4. Audit Persona Controls across standard actor roles
  const actorsToTest = ['remitter-bank', 'psp-bank', 'beneficiary-bank', 'payment-aggregator', 'tpap', 'merchant'];
  for (const actor of actorsToTest) {
    const res = await client.callTool({ name: 'get_persona_controls', arguments: { actor } });
    const parsed = JSON.parse(res.content[0].text);
    if (!Array.isArray(parsed.controls) || parsed.controls.length === 0) {
      defects.push(`Persona controls returned 0 controls for actor: ${actor}`);
    } else {
      console.log(`✓ Persona controls for "${actor}": found ${parsed.controls.length} obligations`);
    }

    // Also test gap checklist for actor
    const chkRes = await client.callTool({ name: 'generate_gap_checklist', arguments: { actor, format: 'json' } });
    const chkParsed = JSON.parse(chkRes.content[0].text);
    if (!Array.isArray(chkParsed.items) || chkParsed.items.length === 0) {
      defects.push(`Gap checklist returned 0 items for actor: ${actor}`);
    }
  }

  if (defects.length > 0) {
    console.error('\n❌ DEFECTS FOUND IN MCP AUDIT:');
    defects.forEach((d, i) => console.error(`  ${i + 1}. ${d}`));
    process.exit(1);
  } else {
    console.log('\n✅ COMPREHENSIVE MCP AUDIT COMPLETE: 0 DEFECTS DETECTED ACROSS ALL RECORDS, GUIDES, AND PERSONAS!');
    process.exit(0);
  }
}

runMcpAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
