#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { selectSnapshot } from '../src/snapshot.js';
import { createAtlasMcpServer } from '../src/server.js';

async function main() {
  const snapshot = await selectSnapshot({
    offline: process.argv.includes('--offline') || process.env.ATLAS_OFFLINE === '1',
    force: process.argv.includes('--refresh'),
  });
  const server = createAtlasMcpServer(snapshot);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('India Fintech Risk Atlas MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error in Atlas MCP server:', err);
  process.exit(1);
});
