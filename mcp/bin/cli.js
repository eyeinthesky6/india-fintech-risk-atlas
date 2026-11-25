#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAtlasMcpServer } from '../src/server.js';

async function main() {
  const server = createAtlasMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('India Fintech Risk Atlas MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error in Atlas MCP server:', err);
  process.exit(1);
});
