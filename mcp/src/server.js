import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, '..', 'data', 'atlas-records.json');

// Load or lazy-load data
let cachedData = null;

function loadAtlasData() {
  if (cachedData) return cachedData;
  if (fs.existsSync(DATA_PATH)) {
    try {
      cachedData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      return cachedData;
    } catch (e) {
      console.error('Failed to parse cached atlas-records.json:', e);
    }
  }

  // Fallback: load from public if available
  const publicPath = path.resolve(__dirname, '..', '..', 'public', 'atlas-records.json');
  if (fs.existsSync(publicPath)) {
    try {
      cachedData = JSON.parse(fs.readFileSync(publicPath, 'utf8'));
      return cachedData;
    } catch (e) {
      console.error('Failed to parse public atlas-records.json:', e);
    }
  }

  throw new Error('Atlas dataset not found. Run "node scripts/build-atlas-data.js" to build.');
}

export function createAtlasMcpServer() {
  const server = new Server(
    {
      name: 'india-fintech-risk-atlas-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  // 1. List Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'search_risk_records',
          description:
            'Search the India Fintech Risk Atlas for fraud schemes, controls, and operational risks across UPI, Cards, PA/PG, and Lending. Filter by keyword, product, actor, evidence layer, or review stage.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search keywords, e.g. "collect request", "mule account", "cooling period", "SIM swap", "chargeback TAT"',
              },
              product: {
                type: 'string',
                description: 'Filter by fintech product rail, e.g. "upi", "cards", "payment-aggregator", "digital-lending"',
              },
              actor: {
                type: 'string',
                description: 'Filter by entity type / actor, e.g. "tpap", "psp-bank", "remitter-bank", "beneficiary-bank", "merchant", "payer"',
              },
              evidence_layer: {
                type: 'string',
                enum: ['official', 'industry', 'practitioner', 'research', 'atlas'],
                description: 'Filter by evidence layer: "official" (Regulatory/RBI/NPCI), "industry" (Company docs), "practitioner" (Community insight), "research" (Academic/arXiv), "atlas" (Atlas guidance)',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (default: 10)',
              },
            },
          },
        },
        {
          name: 'get_record',
          description:
            'Retrieve the full Ready-Reckoner record for a specific risk topic by its ID (e.g. "UPI-004", "UPI-001", "UPI-OVERVIEW") or slug.',
          inputSchema: {
            type: 'object',
            properties: {
              record_id: {
                type: 'string',
                description: 'Canonical record ID (e.g. "UPI-004") or topic slug (e.g. "collect-request-deception")',
              },
            },
            required: ['record_id'],
          },
        },
        {
          name: 'get_evidence_ledger',
          description:
            'Retrieve the claim-level evidence ledger for a record, detailing each verified statutory circular, section locator, entity scope, effective date, and corroboration status across the 5 evidence layers.',
          inputSchema: {
            type: 'object',
            properties: {
              record_id: {
                type: 'string',
                description: 'Canonical record ID, e.g. "UPI-004", "UPI-003"',
              },
            },
            required: ['record_id'],
          },
        },
        {
          name: 'list_sources',
          description:
            'List verified primary regulatory sources, RBI master directions, NPCI circulars, operator disclosures, and academic papers cited across the Atlas.',
          inputSchema: {
            type: 'object',
            properties: {
              record_id: {
                type: 'string',
                description: 'Optional: Filter sources cited by a specific record ID, e.g. "UPI-004"',
              },
              product: {
                type: 'string',
                description: 'Optional: Filter sources for a specific product, e.g. "upi"',
              },
            },
          },
        },
        {
          name: 'list_taxonomy',
          description:
            'List the classification taxonomy used across the Atlas: 5 evidence layers, products, themes, actors, review stages, and lifecycle stages.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'submit_correction',
          description:
            'Submit a factual correction, outdated circular alert, or typo report to the Atlas maintainers triage queue. Reports are verified against primary RBI/NPCI sources before updating live documentation.',
          inputSchema: {
            type: 'object',
            properties: {
              record_id: {
                type: 'string',
                description: 'The affected record ID, e.g. "UPI-004"',
              },
              section: {
                type: 'string',
                description: 'The specific section, e.g. "What to do", "Impact", "References"',
              },
              reason: {
                type: 'string',
                enum: [
                  'Outdated circular',
                  'Wrong bank / entity scope',
                  'Broken or wrong source',
                  'Unclear / typo',
                  'Other',
                ],
                description: 'Category of correction',
              },
              quote: {
                type: 'string',
                description: 'The exact text or claim being reported as inaccurate',
              },
              note: {
                type: 'string',
                description: 'Detailed explanation of why the claim is inaccurate or what has changed',
              },
              source_url: {
                type: 'string',
                description: 'HTTPS URL to the primary RBI / NPCI / official source supporting the correction',
              },
            },
            required: ['record_id', 'reason', 'note'],
          },
        },
      ],
    };
  });

  // 2. Handle Tool Calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const data = loadAtlasData();

    switch (name) {
      case 'search_risk_records': {
        const query = (args?.query || '').toLowerCase().trim();
        const product = (args?.product || '').toLowerCase().trim();
        const actor = (args?.actor || '').toLowerCase().trim();
        const layer = (args?.evidence_layer || '').toLowerCase().trim();
        const limit = typeof args?.limit === 'number' ? Math.max(1, Math.min(args.limit, 50)) : 10;

        let results = data.records.filter((r) => {
          if (product && !r.products.map((p) => p.toLowerCase()).includes(product)) return false;
          if (actor && !r.actors.map((a) => a.toLowerCase()).includes(actor)) return false;
          if (layer && !r.evidenceLayers.map((l) => l.toLowerCase()).includes(layer)) return false;

          if (query) {
            const searchable = [
              r.recordId,
              r.title,
              r.description,
              r.sections?.what_it_is || '',
              r.sections?.impact || '',
              ...(r.controls || []).map((c) => `${c.basis} ${c.owner} ${c.action}`),
            ]
              .join(' ')
              .toLowerCase();
            return searchable.includes(query);
          }
          return true;
        });

        results = results.slice(0, limit);

        const formatted = results.map((r) => ({
          record_id: r.recordId,
          title: r.title,
          description: r.description,
          url: r.url,
          product: r.product,
          actors: r.actors,
          evidence_layers: r.evidenceLayers,
          review_stage: r.reviewStage,
          controls_count: r.controls?.length || 0,
          citations_count: r.references?.length || 0,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  total_matches: results.length,
                  results: formatted,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'get_record': {
        const targetId = String(args?.record_id || '')
          .toUpperCase()
          .trim();
        const targetSlug = String(args?.record_id || '')
          .toLowerCase()
          .trim();

        const record = data.records.find(
          (r) =>
            r.recordId.toUpperCase() === targetId ||
            r.slug.toLowerCase().endsWith(targetSlug) ||
            r.slug.toLowerCase() === targetSlug,
        );

        if (!record) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Record not found for identifier "${args?.record_id}". Available IDs: ${data.records.map((r) => r.recordId).join(', ')}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(record, null, 2),
            },
          ],
        };
      }

      case 'get_evidence_ledger': {
        const targetId = String(args?.record_id || '')
          .toUpperCase()
          .trim();
        const record = data.records.find((r) => r.recordId.toUpperCase() === targetId);

        if (!record) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Record not found for ID "${args?.record_id}".`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  record_id: record.recordId,
                  title: record.title,
                  review_stage: record.reviewStage,
                  last_source_check: record.lastSourceCheck,
                  evidence_layers_present: record.evidenceLayers,
                  claims: record.evidenceLedger,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'list_sources': {
        const targetId = args?.record_id ? String(args.record_id).toUpperCase().trim() : null;
        const targetProduct = args?.product ? String(args.product).toLowerCase().trim() : null;

        let records = data.records;
        if (targetId) {
          records = records.filter((r) => r.recordId.toUpperCase() === targetId);
        }
        if (targetProduct) {
          records = records.filter((r) => r.products.map((p) => p.toLowerCase()).includes(targetProduct));
        }

        const sources = [];
        const seenUrls = new Set();

        for (const r of records) {
          for (const ref of r.references || []) {
            if (ref.url && !seenUrls.has(ref.url)) {
              seenUrls.add(ref.url);
              sources.push({
                title: ref.title || ref.raw,
                url: ref.url,
                cited_in_record: r.recordId,
                raw_citation: ref.raw,
              });
            }
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  total_sources: sources.length,
                  sources,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'list_taxonomy': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data.metadata.taxonomy, null, 2),
            },
          ],
        };
      }

      case 'submit_correction': {
        const recordId = String(args?.record_id || '').trim();
        const section = String(args?.section || 'Whole page').trim();
        const reason = String(args?.reason || 'Other').trim();
        const quote = String(args?.quote || '').trim();
        const note = String(args?.note || '').trim();
        const sourceUrl = String(args?.source_url || '').trim();

        const triageEndpoint = data.metadata.triageWorkerUrl;
        let submitSuccess = false;
        let triageResponse = null;

        try {
          const payload = {
            recordId,
            pagePath: `/upi/${recordId.toLowerCase()}/`,
            pageTitle: recordId,
            section,
            reason,
            quote,
            note: `${note} [Submitted via Atlas MCP Server]`,
            sourceUrl,
            dwellMs: 5000,
          };

          const res = await fetch(triageEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Origin: 'https://eyeinthesky6.github.io',
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            submitSuccess = true;
            triageResponse = await res.json();
          } else {
            triageResponse = await res.text();
          }
        } catch (err) {
          triageResponse = String(err);
        }

        const fallbackIssueUrl = `https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=factual-correction.yml&title=${encodeURIComponent(`[Correction] ${recordId}: ${section}`)}`;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  submitted_to_triage_worker: submitSuccess,
                  record_id: recordId,
                  section,
                  reason,
                  status: submitSuccess
                    ? 'Report queued in private triage queue for maintainer review.'
                    : 'Worker submission did not complete; please file directly via GitHub Issue form.',
                  triage_details: triageResponse,
                  direct_github_issue_url: fallbackIssueUrl,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      default:
        return {
          isError: true,
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        };
    }
  });

  // 3. List Resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const data = loadAtlasData();
    const resources = [
      {
        uri: 'atlas://taxonomy',
        name: 'Fintech Risk Atlas Taxonomy',
        mimeType: 'application/json',
        description: 'Complete classification taxonomy for products, actors, evidence layers, and review stages.',
      },
      {
        uri: 'atlas://llms-txt',
        name: 'Atlas llms.txt Index',
        mimeType: 'text/plain',
        description: 'Plain-text documentation index optimized for LLMs.',
      },
      ...data.records.map((r) => ({
        uri: `atlas://records/${r.recordId}`,
        name: `Risk Record: ${r.recordId} — ${r.title}`,
        mimeType: 'application/json',
        description: r.description,
      })),
    ];

    return { resources };
  });

  // 4. Read Resource
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const data = loadAtlasData();

    if (uri === 'atlas://taxonomy') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(data.metadata.taxonomy, null, 2),
          },
        ],
      };
    }

    if (uri === 'atlas://llms-txt') {
      const publicLlms = path.resolve(__dirname, '..', '..', 'public', 'llms.txt');
      const text = fs.existsSync(publicLlms) ? fs.readFileSync(publicLlms, 'utf8') : 'llms.txt not generated.';
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text,
          },
        ],
      };
    }

    if (uri.startsWith('atlas://records/')) {
      const recordId = uri.replace('atlas://records/', '').toUpperCase();
      const record = data.records.find((r) => r.recordId.toUpperCase() === recordId);
      if (record) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(record, null, 2),
            },
          ],
        };
      }
    }

    throw new Error(`Resource not found: ${uri}`);
  });

  return server;
}
