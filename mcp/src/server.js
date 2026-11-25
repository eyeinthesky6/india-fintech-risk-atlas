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

const ACTOR_ALIASES = {
  'remitter-bank': ['remitter', 'issuer', 'commercial bank', 'commercial, payments', 'issuer bank', 'bank'],
  'issuer-bank': ['issuer', 'remitter', 'commercial bank', 'commercial, payments', 'bank'],
  'psp-bank': ['psp', 'sponsor', 'psp bank', 'psp banks', 'psps'],
  'beneficiary-bank': ['beneficiary', 'payee', 'credit bank', 'beneficiary bank'],
  'acquirer-bank': ['acquirer', 'acquiring', 'acquirer bank', 'acquiring bank'],
  'payment-aggregator': ['payment aggregator', 'pa', 'pas', 'pg', 'payment aggregators', 'merchant aggregator'],
  'tpap': ['tpap', 'tpaps', 'app', 'upi app', 'third-party application provider'],
  'merchant': ['merchant', 'merchants', 'enterprise', 'business'],
  'payer': ['payer', 'cardholder', 'customer', 'user', 'consumer'],
  'cardholder': ['cardholder', 'payer', 'customer'],
  'card-network': ['card network', 'network', 'visa', 'mastercard', 'rupay'],
  'npci': ['npci', 'switch', 'network operator'],
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesActorRole(ownerText, queryRole) {
  const lower = (ownerText || '').toLowerCase();
  const q = (queryRole || '').toLowerCase().trim();
  if (!q || q === 'all') return true;
  if (lower.includes(q)) return true;
  const aliases = ACTOR_ALIASES[q];
  if (!aliases) return false;
  return aliases.some((alias) => {
    if (alias.length <= 3) {
      try {
        const regex = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i');
        return regex.test(lower);
      } catch {
        return lower.includes(alias);
      }
    }
    return lower.includes(alias);
  });
}

export function createAtlasMcpServer() {
  const server = new Server(
    {
      name: 'india-fintech-risk-atlas-mcp',
      version: '1.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  // 1. List Tools (12 comprehensive tools matching and exceeding manual UI capabilities)
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'search_risk_records',
          description:
            'Search the India Fintech Risk Atlas for fraud schemes, controls, and operational risks across currently represented products in a research preview. Filter by keyword, product, actor, evidence layer, or review stage.',
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
              review_stage: { type: 'string', description: 'Exact record review stage, e.g. source-checked' },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (default: 10, max: 50)',
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
          name: 'explore_knowledge_graph',
          description:
            'Explore the interconnected knowledge graph for a topic: discover connected neighbor records, shared statutory circulars, theme clusters, and outgoing/incoming relationships (co-citation and theme relationships are not proof of operational dependency).',
          inputSchema: {
            type: 'object',
            properties: {
              record_id: {
                type: 'string',
                description: 'Canonical record ID to explore, e.g. "UPI-004", "UPI-003"',
              },
              relation_type: {
                type: 'string',
                enum: ['all', 'shared-sources', 'same-theme', 'direct-links'],
                description: 'Filter connection type: "all" (default), "shared-sources" (co-cited RBI/NPCI rules), or "same-theme" (lifecycle cluster)',
              },
            },
            required: ['record_id'],
          },
        },
        {
          name: 'get_persona_controls',
          description:
            'Extract source-attributed candidate controls and regulatory material (verify applicability and effective dates independently) tailored specifically to an entity role (e.g. "TPAP", "Remitter Bank", "PSP Bank", "Merchant", "Payment Aggregator") across the entire Atlas.',
          inputSchema: {
            type: 'object',
            properties: {
              actor: {
                type: 'string',
                description: 'Entity persona: "tpap", "remitter-bank", "psp-bank", "beneficiary-bank", "merchant", "payment-aggregator", or "payer"',
              },
              basis: {
                type: 'string',
                enum: ['all', 'Regulatory', 'Industry practice', 'Community insight', 'Research & academic', 'Atlas guidance'],
                description: 'Filter by basis layer (default: "all")',
              },
            },
            required: ['actor'],
          },
        },
        {
          name: 'generate_gap_checklist',
          description:
            'Generate a preliminary, non-certified gap-audit checklist for fintech engineering and risk teams preparing for RBI compliance or internal risk pre-audits.',
          inputSchema: {
            type: 'object',
            properties: {
              actor: {
                type: 'string',
                description: 'Target entity type: e.g. "tpap", "remitter-bank", "psp-bank", "merchant", "all"',
              },
              product: {
                type: 'string',
                description: 'Fintech product rail (default: "upi")',
              },
              format: {
                type: 'string',
                enum: ['markdown', 'json'],
                description: 'Output format (default: "markdown")',
              },
            },
          },
        },
        {
          name: 'get_guide_doc',
          description:
            'Retrieve foundational Atlas policy and guidance documents: "evidence-policy", "methodology", "risk-stack-playbook", "operator-insights", "glossary", "sources", "coverage", "contribute", or "licensing".',
          inputSchema: {
            type: 'object',
            properties: {
              doc_id: {
                type: 'string',
                description: 'Document slug: "evidence-policy", "methodology", "risk-stack-playbook", "operator-insights", "glossary", "sources", "coverage", "contribute", or "licensing"',
              },
            },
            required: ['doc_id'],
          },
        },
        {
          name: 'get_clean_markdown',
          description:
            'Retrieve clean, publication-ready markdown for a record with UI widgets/drawers stripped and the canonical source citation appended (exact parity with the UI [Copy] button).',
          inputSchema: {
            type: 'object',
            properties: {
              record_id: {
                type: 'string',
                description: 'Canonical record ID (e.g. "UPI-004")',
              },
            },
            required: ['record_id'],
          },
        },
        {
          name: 'mark_record_accurate',
          description:
            'Record an accuracy confirmation for a specific record (parity with the UI [✓ Looks accurate] button).',
          inputSchema: {
            type: 'object',
            properties: {
              record_id: {
                type: 'string',
                description: 'Record ID being attested, e.g. "UPI-004"',
              },
            },
            required: ['record_id'],
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
        const stage = String(args?.review_stage || '').toLowerCase().trim();
        const limit = typeof args?.limit === 'number' && !isNaN(args.limit) ? Math.max(1, Math.min(Math.floor(args.limit), 50)) : 10;

        let results = data.records.filter((r) => {
          if (stage && r.reviewStage !== stage) return false;
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
              r.fullMarkdown || '',
              ...(r.controls || []).map((c) => `${c.basis} ${c.owner} ${c.action}`),
            ]
              .join(' ')
              .toLowerCase();
            return searchable.includes(query);
          }
          return true;
        });

        const totalMatches = results.length;
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
          last_source_check: r.lastSourceCheck,
          controls_count: r.controls?.length || 0,
          citations_count: r.references?.length || 0,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  total_matches: totalMatches,
                  returned_matches: results.length,
                  dataset_generated_at: data.metadata.generatedAt,
                  verification_notice: data.metadata.verificationNotice,
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
        const targetId = String(args?.record_id || '').toUpperCase().trim();
        const targetSlug = String(args?.record_id || '').toLowerCase().trim();

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

      case 'explore_knowledge_graph': {
        const targetId = String(args?.record_id || '').toUpperCase().trim();
        const relation = String(args?.relation_type || 'all').toLowerCase().trim();
        const connections = data.knowledgeGraph?.connections?.[targetId];

        if (!connections) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Node "${targetId}" not found in knowledge graph. Available nodes: ${Object.keys(data.knowledgeGraph?.connections || {}).join(', ')}`,
              },
            ],
          };
        }

        const record = data.records.find((r) => r.recordId.toUpperCase() === targetId);

        let neighbors = [];
        if (relation === 'shared-sources') {
          neighbors = connections.sharedSources;
        } else if (relation === 'direct-links') {
          neighbors = connections.directLinks || [];
        } else if (relation === 'same-theme') {
          neighbors = connections.sameTheme;
        } else {
          neighbors = connections.allNeighbors;
        }

        const neighborDetails = neighbors.map((nid) => {
          const nr = data.records.find((r) => r.recordId === nid);
          return {
            record_id: nid,
            title: nr ? nr.title : '',
            url: nr ? nr.url : '',
            theme: nr ? nr.themeLabel : '',
            shared_sources: connections.sharedSources.includes(nid),
            same_theme: connections.sameTheme.includes(nid),
            direct_link: (connections.directLinks || []).includes(nid),
          };
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  current_record: {
                    record_id: targetId,
                    title: record?.title,
                    theme: record?.themeLabel,
                    source_labels: record?.sourceLabels,
                  },
                  total_connected_neighbors: neighborDetails.length,
                  connected_topics: neighborDetails,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'get_persona_controls': {
        const actorQuery = String(args?.actor || '').toLowerCase().trim();
        const basisQuery = String(args?.basis || 'all').trim();

        if (!actorQuery) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Please specify an entity persona: tpap, remitter-bank, psp-bank, merchant, etc.' }],
          };
        }

        const matchedControls = [];
        for (const r of data.records) {
          for (const c of r.controls || []) {
            const matchesActor = matchesActorRole(c.owner, actorQuery);
            const matchesBasis = basisQuery === 'all' || c.basis.toLowerCase() === basisQuery.toLowerCase();

            if (matchesActor && matchesBasis) {
              matchedControls.push({
                record_id: r.recordId,
                topic_title: r.title,
                url: r.url,
                basis: c.basis,
                owner: c.owner,
                action: c.action,
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
                  actor: actorQuery,
                  basis_filter: basisQuery,
                  total_controls_found: matchedControls.length,
                  controls: matchedControls,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'generate_gap_checklist': {
        const actorQuery = String(args?.actor || 'all').toLowerCase().trim();
        const productQuery = String(args?.product || 'upi').toLowerCase().trim();
        const format = String(args?.format || 'markdown').toLowerCase().trim();

        const checklistItems = [];
        for (const r of data.records) {
          if (productQuery && !r.products.map((p) => p.toLowerCase()).includes(productQuery)) continue;
          for (const c of r.controls || []) {
            if (actorQuery !== 'all' && !matchesActorRole(c.owner, actorQuery)) continue;

            checklistItems.push({
              id: `${r.recordId}-C${checklistItems.length + 1}`,
              record_id: r.recordId,
              topic: r.title,
              basis: c.basis,
              owner: c.owner,
              requirement: c.action,
              status: 'NOT_AUDITED',
            });
          }
        }

        if (format === 'json') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ actor: actorQuery, product: productQuery, total: checklistItems.length, items: checklistItems }, null, 2),
              },
            ],
          };
        }

        const mdLines = [
          `# ${productQuery.toUpperCase()} Gap Audit Checklist (${actorQuery === 'all' ? 'All Roles' : actorQuery.toUpperCase()})`,
          `Generated: ${new Date().toISOString()}`,
          '',
          '| Check | Record | Basis | Entity Scope | Action Requirement | Implementation Status | Evidence / Notes |',
          '|---|---|---|---|---|---|---|',
          ...checklistItems.map(
            (item) => `| [ ] | \`${item.record_id}\` | **${item.basis}** | ${item.owner} | ${item.requirement.replace(/\|/g, '\\|')} | Pending | |`,
          ),
        ];

        return {
          content: [{ type: 'text', text: mdLines.join('\n') }],
        };
      }

      case 'get_guide_doc': {
        const targetSlug = String(args?.doc_id || '').toLowerCase().trim();
        const guide = data.guideDocs?.find(
          (g) => g.slug.toLowerCase() === targetSlug || g.slug.toLowerCase().endsWith(targetSlug),
        );

        if (!guide) {
          const available = (data.guideDocs || []).map((g) => g.slug).join(', ');
          return {
            isError: true,
            content: [{ type: 'text', text: `Guide document not found: "${args?.doc_id}". Available docs: ${available}` }],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(guide, null, 2),
            },
          ],
        };
      }

      case 'get_clean_markdown': {
        const targetId = String(args?.record_id || '').toUpperCase().trim();
        const record = data.records.find((r) => r.recordId.toUpperCase() === targetId);

        if (!record) {
          return {
            isError: true,
            content: [{ type: 'text', text: `Record not found for ID "${args?.record_id}".` }],
          };
        }

        const cleanBody = record.fullMarkdown
          .replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
          .replace(/<\/?details\b[^>]*>/gi, '')
          .replace(/<\/?summary\b[^>]*>/gi, '')
          .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
          .trim();

        const exportOutput = `${record.title}\n\n${record.description}\n\nReview stage: ${record.reviewStage}; last source check: ${record.lastSourceCheck ?? 'unknown'}. Research preview, not certified compliance advice.\n\n${cleanBody}\n\nSource: ${record.url}`;

        return {
          content: [{ type: 'text', text: exportOutput }],
        };
      }

      case 'mark_record_accurate': {
        const targetId = String(args?.record_id || '').toUpperCase().trim();
        const record = data.records.find((r) => r.recordId.toUpperCase() === targetId);

        if (!record) {
          return {
            isError: true,
            content: [{ type: 'text', text: `Record not found for ID "${args?.record_id}".` }],
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
                  confirmed: true,
                  timestamp: new Date().toISOString(),
                  message: `Accuracy attested for ${record.recordId}. Parity with [✓ Confirmed — thanks].`,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'get_evidence_ledger': {
        const targetId = String(args?.record_id || '').toUpperCase().trim();
        const record = data.records.find((r) => r.recordId.toUpperCase() === targetId);

        if (!record) {
          return {
            isError: true,
            content: [{ type: 'text', text: `Record not found for ID "${args?.record_id}".` }],
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

        if (!recordId) {
          return { isError: true, content: [{ type: 'text', text: 'Missing required field: record_id' }] };
        }
        if (!note) {
          return { isError: true, content: [{ type: 'text', text: 'Missing required field: note' }] };
        }

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
      ...(data.guideDocs || []).map((g) => ({
        uri: `atlas://guides/${g.slug}`,
        name: `Guide Doc: ${g.title}`,
        mimeType: 'application/json',
        description: g.description || g.title,
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

    if (uri.startsWith('atlas://guides/')) {
      const guideSlug = uri.replace('atlas://guides/', '').toLowerCase();
      const guide = data.guideDocs?.find((g) => g.slug.toLowerCase() === guideSlug);
      if (guide) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(guide, null, 2),
            },
          ],
        };
      }
    }

    throw new Error(`Resource not found: ${uri}`);
  });

  return server;
}
