import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createAtlasMcpServer } from '../src/server.js';

async function runTests() {
  console.log('Testing India Fintech Risk Atlas MCP Server...');

  const server = createAtlasMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  const client = new Client(
    { name: 'test-client', version: '1.0.0' },
    { capabilities: {} },
  );

  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  console.log('✓ Connected client and server via InMemoryTransport');

  // Test 1: List Tools
  const { tools } = await client.listTools();
  console.log(`✓ List tools returned ${tools.length} tools`);
  const toolNames = tools.map((t) => t.name);
  console.log('  Tools:', toolNames.join(', '));
  if (!toolNames.includes('search_risk_records') || !toolNames.includes('get_record')) {
    throw new Error('Missing core tools in tool list');
  }

  // Test 2: Search risk records
  const searchRes = await client.callTool({
    name: 'search_risk_records',
    arguments: { query: 'collect request' },
  });
  const searchParsed = JSON.parse(searchRes.content[0].text);
  console.log(`✓ search_risk_records returned ${searchParsed.total_matches} matches for "collect request"`);
  if (searchParsed.total_matches === 0) {
    throw new Error('Expected matches for "collect request"');
  }

  // Test 3: Get record UPI-004
  const recordRes = await client.callTool({
    name: 'get_record',
    arguments: { record_id: 'UPI-004' },
  });
  const record = JSON.parse(recordRes.content[0].text);
  console.log(`✓ get_record fetched "${record.title}" (${record.recordId})`);
  console.log(`  Controls count: ${record.controls.length}`);
  console.log(`  References count: ${record.references.length}`);
  if (record.recordId !== 'UPI-004' || record.controls.length === 0) {
    throw new Error('Invalid record output for UPI-004');
  }

  // Test 4: Get evidence ledger
  const ledgerRes = await client.callTool({
    name: 'get_evidence_ledger',
    arguments: { record_id: 'UPI-004' },
  });
  const ledger = JSON.parse(ledgerRes.content[0].text);
  console.log(`✓ get_evidence_ledger returned ${ledger.claims.length} verified claims for UPI-004`);
  if (ledger.claims.length === 0) {
    throw new Error('Expected evidence ledger claims for UPI-004');
  }

  // Test 5: List sources
  const sourcesRes = await client.callTool({
    name: 'list_sources',
    arguments: { record_id: 'UPI-004' },
  });
  const sources = JSON.parse(sourcesRes.content[0].text);
  console.log(`✓ list_sources returned ${sources.total_sources} unique verified URLs for UPI-004`);

  // Test 6: List taxonomy
  const taxRes = await client.callTool({
    name: 'list_taxonomy',
    arguments: {},
  });
  const tax = JSON.parse(taxRes.content[0].text);
  console.log(`✓ list_taxonomy returned evidence layers: ${Object.keys(tax.evidenceLayers || {}).join(', ')}`);

  // Test 7: List resources
  const { resources } = await client.listResources();
  console.log(`✓ listResources returned ${resources.length} resources`);

  // Test 8: Read resource
  const resContent = await client.readResource({ uri: 'atlas://records/UPI-004' });
  const readRecord = JSON.parse(resContent.contents[0].text);
  console.log(`✓ readResource atlas://records/UPI-004 returned: ${readRecord.title}`);

  console.log('\n=======================================');
  console.log('🎉 ALL MCP SERVER UNIT TESTS PASSED! 🎉');
  console.log('=======================================\n');

  await client.close();
  await server.close();
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
