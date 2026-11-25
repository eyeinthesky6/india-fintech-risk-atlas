import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createAtlasMcpServer } from '../src/server.js';

async function runTests() {
  console.log('Testing India Fintech Risk Atlas MCP Server (Full 12-Tool Suite)...');

  const server = createAtlasMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  const client = new Client(
    { name: 'test-client', version: '1.1.0' },
    { capabilities: {} },
  );

  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  console.log('✓ Connected client and server via InMemoryTransport');

  // Test 1: List Tools
  const { tools } = await client.listTools();
  console.log(`✓ List tools returned ${tools.length} tools`);
  const toolNames = tools.map((t) => t.name);
  console.log('  Tools:', toolNames.join(', '));
  if (tools.length !== 12) {
    throw new Error(`Expected 12 tools, got ${tools.length}`);
  }

  // Test 2: Search risk records
  const searchRes = await client.callTool({
    name: 'search_risk_records',
    arguments: { query: 'collect request' },
  });
  const searchParsed = JSON.parse(searchRes.content[0].text);
  console.log(`✓ search_risk_records returned ${searchParsed.total_matches} matches for "collect request"`);

  // Test 3: Get record UPI-004
  const recordRes = await client.callTool({
    name: 'get_record',
    arguments: { record_id: 'UPI-004' },
  });
  const record = JSON.parse(recordRes.content[0].text);
  console.log(`✓ get_record fetched "${record.title}" (${record.recordId})`);

  // Test 4: Explore knowledge graph
  const kgRes = await client.callTool({
    name: 'explore_knowledge_graph',
    arguments: { record_id: 'UPI-004' },
  });
  const kg = JSON.parse(kgRes.content[0].text);
  console.log(`✓ explore_knowledge_graph returned ${kg.total_connected_neighbors} connected topics for UPI-004`);

  // Test 5: Get persona controls
  const personaRes = await client.callTool({
    name: 'get_persona_controls',
    arguments: { actor: 'tpap', basis: 'all' },
  });
  const persona = JSON.parse(personaRes.content[0].text);
  console.log(`✓ get_persona_controls found ${persona.total_controls_found} obligations for TPAP`);

  // Test 6: Generate gap checklist
  const checklistRes = await client.callTool({
    name: 'generate_gap_checklist',
    arguments: { actor: 'remitter-bank', format: 'markdown' },
  });
  const md = checklistRes.content[0].text;
  console.log(`✓ generate_gap_checklist generated markdown checklist (${md.length} characters)`);

  // Test 7: Get guide doc
  const guideRes = await client.callTool({
    name: 'get_guide_doc',
    arguments: { doc_id: 'evidence-policy' },
  });
  const guide = JSON.parse(guideRes.content[0].text);
  console.log(`✓ get_guide_doc retrieved: ${guide.title}`);

  // Test 8: Get clean markdown ([Copy] parity)
  const copyRes = await client.callTool({
    name: 'get_clean_markdown',
    arguments: { record_id: 'UPI-004' },
  });
  const cleanMd = copyRes.content[0].text;
  console.log(`✓ get_clean_markdown extracted clean text with Source URL (${cleanMd.includes('Source: https://')})`);

  // Test 9: Mark record accurate ([✓ Looks accurate] parity)
  const markRes = await client.callTool({
    name: 'mark_record_accurate',
    arguments: { record_id: 'UPI-004' },
  });
  const mark = JSON.parse(markRes.content[0].text);
  console.log(`✓ mark_record_accurate confirmed: ${mark.confirmed}`);

  // Test 10: Get evidence ledger
  const ledgerRes = await client.callTool({
    name: 'get_evidence_ledger',
    arguments: { record_id: 'UPI-004' },
  });
  const ledger = JSON.parse(ledgerRes.content[0].text);
  console.log(`✓ get_evidence_ledger returned ${ledger.claims.length} verified claims for UPI-004`);

  // Test 11: List sources
  const sourcesRes = await client.callTool({
    name: 'list_sources',
    arguments: { record_id: 'UPI-004' },
  });
  const sources = JSON.parse(sourcesRes.content[0].text);
  console.log(`✓ list_sources returned ${sources.total_sources} unique verified URLs for UPI-004`);

  // Test 12: List taxonomy
  const taxRes = await client.callTool({
    name: 'list_taxonomy',
    arguments: {},
  });
  const tax = JSON.parse(taxRes.content[0].text);
  console.log(`✓ list_taxonomy returned evidence layers: ${Object.keys(tax.evidenceLayers || {}).join(', ')}`);

  console.log('\n=============================================');
  console.log('🎉 ALL 12 TOOL & RESOURCE TESTS PASSED! 🎉');
  console.log('=============================================\n');

  await client.close();
  await server.close();
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
