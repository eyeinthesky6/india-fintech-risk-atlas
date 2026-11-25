import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
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
import { renderLlmIndex } from './llms-index.js';

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
  psp: 'psp-bank',
  remitter: 'remitter-bank',
  beneficiary: 'beneficiary-bank',
  issuer: 'issuer-bank',
  acquirer: 'acquirer-bank',
  pa: 'payment-aggregator',
  'upi app': 'tpap',
  'third-party application provider': 'tpap',
  'non-bank pso': 'non-bank-pso',
};

function resolveActor(query, actors) {
  const key = query.toLowerCase().trim();
  if (key === 'all' || Object.hasOwn(actors, key)) return key;
  return Object.entries(actors).find(([, label]) => label.toLowerCase() === key)?.[0] ??
    (Object.hasOwn(ACTOR_ALIASES, key) ? ACTOR_ALIASES[key] : undefined);
}

function eligibleChecklistControl(record, control) {
  if (control.regulatoryStatus === 'proposal') return false;
  if (control.basis !== 'Regulatory' || !['draft', 'researching'].includes(record.reviewStage)) return true;

  const references = record.references.filter((ref) => control.referenceNumbers?.includes(ref.number));
  return references.length > 0 && references.every((ref) =>
    ref.evidence?.length > 0 && ref.evidence.every((claim) => /^supported\b/i.test(claim.result)),
  );
}

function toolError(text) {
  return { isError: true, content: [{ type: 'text', text }] };
}

function resolveSlug(entries, identifier) {
  const key = identifier?.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!key) return undefined;
  const exact = entries.find((entry) => entry.recordId?.toLowerCase() === key || entry.slug.toLowerCase() === key);
  if (exact) return exact;
  const matchingAliases = entries.filter((entry) => entry.slug.toLowerCase().split('/').at(-1) === key);
  return matchingAliases.length === 1 ? matchingAliases[0] : undefined;
}

function findGuide(data, identifier) {
  const guide = resolveSlug(data.guideDocs, identifier);
  if (guide) return guide;
  const record = resolveSlug(data.records, identifier);
  if (record?.recordId !== 'UPI-OVERVIEW') return undefined;
  const { slug, title, description, url, fullMarkdown } = record;
  return { slug, title, description, url, content: fullMarkdown.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim() };
}

export function createAtlasMcpServer(snapshot) {
  const getData = () => snapshot || loadAtlasData();
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

  const tools = [
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
                description: 'Filter by a product in list_taxonomy, such as "upi" or "cards"',
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
            'List cited references and their claim evidence, including document scope, locators, blocked results, and record review stage.',
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
            'Retrieve record Markdown with review status, references and the canonical page URL.',
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
            'Legacy compatibility tool. Read a record’s evidence status without recording a review.',
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
            'Prepare a correction draft and return the browser form for private reporting or the public issue link.',
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
            required: ['record_id', 'note'],
          },
        },
  ];
  const schemaValidator = new AjvJsonSchemaValidator();
  const validators = new Map(tools.map((tool) => [tool.name, schemaValidator.getValidator(tool.inputSchema)]));
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  // Handle Tool Calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    const validate = validators.get(name);
    if (validate) {
      const result = validate(args);
      if (!result.valid) return toolError(result.errorMessage || 'Invalid tool arguments.');
    }
    const data = getData();

    switch (name) {
      case 'search_risk_records': {
        const query = (args?.query || '').toLowerCase().trim();
        const product = (args?.product || '').toLowerCase().trim();
        const actor = args.actor ? resolveActor(args.actor, data.metadata.taxonomy.actors) : 'all';
        if (!actor) return toolError('Unknown actor. Use list_taxonomy for supported actors.');
        const layer = (args?.evidence_layer || '').toLowerCase().trim();
        const stage = String(args?.review_stage || '').toLowerCase().trim();
        const limit = typeof args?.limit === 'number' && !isNaN(args.limit) ? Math.max(1, Math.min(Math.floor(args.limit), 50)) : 10;

        let results = data.records.filter((r) => {
          if (stage && r.reviewStage !== stage) return false;
          if (product && !r.products.map((p) => p.toLowerCase()).includes(product)) return false;
          if (actor !== 'all' && !r.actors.includes(actor)) return false;
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
          human_checked: r.humanChecked ?? ['reviewed', 'published'].includes(r.reviewStage),
          source_blocker: r.blockerNote || undefined,
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
        const record = resolveSlug(data.records, args.record_id);

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
        const targetId = resolveSlug(data.records, args.record_id)?.recordId;
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

        const record = resolveSlug(data.records, targetId);

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
        const actorQuery = resolveActor(args.actor, data.metadata.taxonomy.actors);
        const basisQuery = String(args?.basis || 'all').trim();

        if (!actorQuery) {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Unknown actor. Use list_taxonomy for supported actors.' }],
          };
        }

        const matchedControls = [];
        for (const r of data.records) {
          for (const c of r.controls || []) {
            const matchesActor = actorQuery === 'all' || c.ownerIds?.includes(actorQuery);
            const matchesBasis = basisQuery === 'all' || c.basis.toLowerCase() === basisQuery.toLowerCase();

            if (matchesActor && matchesBasis) {
              matchedControls.push({
                record_id: r.recordId,
                control_id: c.id,
                topic_title: r.title,
                url: r.url,
                review_stage: r.reviewStage,
                source_blocker: r.blockerNote || undefined,
                basis: c.basis,
                basis_raw: c.basisRaw ?? c.basis,
                regulatory_status: c.regulatoryStatus ?? 'not-determined',
                owner: c.owner,
                owner_ids: c.ownerIds,
                reference_numbers: c.referenceNumbers,
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
        const actorQuery = resolveActor(args.actor || 'all', data.metadata.taxonomy.actors);
        if (!actorQuery) return toolError('Unknown actor. Use list_taxonomy for supported actors.');
        const productQuery = String(args?.product || 'upi').toLowerCase().trim();
        const format = String(args?.format || 'markdown').toLowerCase().trim();

        const checklistItems = [];
        for (const r of data.records) {
          if (productQuery && !r.products.map((p) => p.toLowerCase()).includes(productQuery)) continue;
          for (const c of r.controls || []) {
            if (actorQuery !== 'all' && !c.ownerIds?.includes(actorQuery)) continue;
            if (!eligibleChecklistControl(r, c)) continue;

            checklistItems.push({
              id: c.id,
              record_id: r.recordId,
              topic: r.title,
              review_stage: r.reviewStage,
              source_blocker: r.blockerNote || undefined,
              basis: c.basis,
              basis_raw: c.basisRaw ?? c.basis,
              regulatory_status: c.regulatoryStatus ?? 'not-determined',
              owner: c.owner,
              owner_ids: c.ownerIds,
              reference_numbers: c.referenceNumbers,
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
            (item) => `| [ ] | \`${item.record_id}\` (${item.review_stage}) | **${item.basis}** (${item.regulatory_status}) | ${item.owner} | ${item.requirement.replace(/\|/g, '\\|')} | Pending | ${item.source_blocker?.replace(/\|/g, '\\|') ?? ''} |`,
          ),
        ];

        return {
          content: [{ type: 'text', text: mdLines.join('\n') }],
        };
      }

      case 'get_guide_doc': {
        const guide = findGuide(data, args.doc_id);

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
        const record = resolveSlug(data.records, targetId);

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

        const blocker = record.blockerNote ? `\nSource blocker: ${record.blockerNote}` : '';
        const exportOutput = `${record.title}\n\n${record.description}\n\nReview stage: ${record.reviewStage}; last source check: ${record.lastSourceCheck ?? 'unknown'}. Research preview, not certified compliance advice.${blocker}\n\n${cleanBody}\n\nSource: ${record.url}`;

        return {
          content: [{ type: 'text', text: exportOutput }],
        };
      }

      case 'mark_record_accurate': {
        const targetId = String(args?.record_id || '').toUpperCase().trim();
        const record = resolveSlug(data.records, targetId);

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
                  confirmed: false,
                  review_stage: record.reviewStage,
                  human_checked: ['reviewed', 'published'].includes(record.reviewStage),
                  message: 'This tool returns the recorded evidence status. It does not record an attestation.',
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
        const record = resolveSlug(data.records, targetId);

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
                  source_blocker: record.blockerNote || undefined,
                  last_source_check: record.lastSourceCheck,
                  human_checked: record.humanChecked ?? ['reviewed', 'published'].includes(record.reviewStage),
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

        const byUrl = new Map();
        for (const record of records) {
          for (const ref of record.references) {
            if (!ref.url) continue;
            if (!byUrl.has(ref.url)) {
              byUrl.set(ref.url, {
                title: ref.title || ref.raw,
                url: ref.url,
                cited_in_record: record.recordId,
                raw_citation: ref.raw,
                cited_in_records: [],
              });
            }
            byUrl.get(ref.url).cited_in_records.push({
              record_id: record.recordId,
              reference_number: ref.number,
              review_stage: record.reviewStage,
              human_checked: record.humanChecked ?? ['reviewed', 'published'].includes(record.reviewStage),
              source_blocker: record.blockerNote || undefined,
              claims: ref.evidence ?? [],
            });
          }
        }
        const sources = [...byUrl.values()];

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
        const record = resolveSlug(data.records, args.record_id);
        if (!record) return toolError('Record not found.');
        const note = args.note.trim();
        if (!note) return toolError('Missing required field: note');

        const section = args.section?.trim() || 'Whole page';
        const reason = args.reason ?? 'Other';
        const issueTitle = encodeURIComponent(`[Correction] ${record.recordId}: ${section}`);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              submitted_to_triage_worker: false,
              record_id: record.recordId,
              section,
              reason,
              status: 'Open the record page and use Report an error to submit privately. GitHub issues are public.',
              private_report_page_url: `${record.url}#report-an-error`,
              direct_github_issue_url: `https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=factual-correction.yml&title=${issueTitle}`,
              draft: { note, quote: args.quote?.trim() ?? '', source_url: args.source_url?.trim() ?? '' },
            }, null, 2),
          }],
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
    const data = getData();
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
    const data = getData();

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
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: renderLlmIndex(data),
          },
        ],
      };
    }

    if (uri.startsWith('atlas://records/')) {
      const recordId = uri.replace('atlas://records/', '').toUpperCase();
      const record = resolveSlug(data.records, recordId);
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
      const guide = findGuide(data, guideSlug);
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
