import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TAXONOMY_PATH = path.join(ROOT_DIR, 'src', 'taxonomy.json');
const DOCS_DIR = path.join(ROOT_DIR, 'src', 'content', 'docs');
const EVIDENCE_DIR = path.join(ROOT_DIR, 'research', 'evidence');
const ATTESTATIONS_DIR = path.join(ROOT_DIR, 'research', 'attestations');

const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));

const SOURCE_MATCHERS = [
  [/[?&]id=13642\b/i, 'RBI DPSC 2026'],
  [/[?&]id=13624\b/i, 'RBI PB DPSC 2026'],
  [/[?&]id=13633\b/i, 'RBI SFB DPSC 2026'],
  [/[?&]id=13751\b/i, 'RBI Non-bank PSO 2026'],
  [/[?&]id=13543\b/i, 'RBI RBC 2026'],
  [/[?&]id=12898\b/i, 'RBI Auth 2025'],
  [/[?&]id=12896\b/i, 'RBI PA MD 2025'],
  [/[?&]id=11946\b/i, 'RBI ODR 2020'],
  [/[?&]id=11693\b/i, 'RBI TAT 2019'],
  [/[?&]id=13641\b/i, 'RBI FRM 2026'],
  [/[?&]id=23810\b/i, 'RBI Fraud Discussion Paper'],
  [/[?&]id=13089\b/i, 'RBI PB RBC 2025'],
  [/[?&]id=11040\b/i, 'RBI Liability 2017'],
  [/PRID=2260277\b/i, 'PIB MuleHunter MoU'],
  [/npci\.org\.in\/fraud-awareness/i, 'NPCI Fraud Awareness'],
  [/npci\.org\.in\/faqs\/upi/i, 'NPCI UPI FAQs'],
  [/npci\.org\.in\/complaint-register/i, 'NPCI Complaint Register'],
  [/npci\.org\.in\/circulars\/upi/i, 'NPCI UPI Circulars'],
  [/npci\.org\.in\/product\/upi/i, 'NPCI UPI Overview & Roles'],
  [/UPI_Settlement_Process/i, 'NPCI Settlement Process'],
  [/UPI_OC_No_235/i, 'NPCI OC 235 (URCS TAT)'],
  [/UPI_OC_No_220/i, 'NPCI OC 220 (P2P Collect)'],
  [/UPI_OC_No_222/i, 'NPCI 222A (Settlement Cycles)'],
  [/rscb\.bank\.in\/Content\/pdf\/npcicircular\.pdf/i, 'NPCI/2025-26/IS/003 (mirror)'],
  [/razorpay\.com/i, 'Razorpay Docs'],
  [/cashfree\.com/i, 'Cashfree Docs'],
  [/stripe\.com/i, 'Stripe Radar Docs'],
  [/arxiv\.org/i, 'arXiv Research Lead'],
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: raw.trim() };
  const yamlBlock = match[1];
  const body = raw.slice(match[0].length).trim();
  const meta = {};

  let currentKey = null;
  let isArray = false;

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('- ') && currentKey && isArray) {
      meta[currentKey].push(trimmed.slice(2).trim().replace(/^['"]|['"]$/g, ''));
      return;
    }

    const kvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const val = kvMatch[2].trim();
      if (!val) {
        currentKey = key;
        isArray = true;
        meta[key] = [];
      } else {
        currentKey = key;
        isArray = false;
        meta[key] = val.replace(/^['"]|['"]$/g, '');
      }
    }
  });

  return { meta, body };
}

function parseTableRows(markdown) {
  const lines = markdown.split(/\r?\n/).filter((l) => l.trim().startsWith('|') && !l.includes('---'));
  if (lines.length < 2) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i]
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length >= 3) {
      rows.push({
        basis: cells[0],
        owner: cells[1],
        action: cells[2],
      });
    }
  }
  return rows;
}

function parseReferences(markdown) {
  const refs = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const text = match[2];
      const urlMatch = text.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
      refs.push({
        number: num,
        raw: text,
        title: urlMatch ? urlMatch[1] : '',
        url: urlMatch ? urlMatch[2] : '',
      });
    }
  }
  return refs;
}

function extractSourceLabels(refs) {
  const labels = new Set();
  for (const ref of refs) {
    const url = ref.url || ref.raw;
    for (const [pattern, label] of SOURCE_MATCHERS) {
      if (pattern.test(url)) {
        labels.add(label);
      }
    }
  }
  return Array.from(labels);
}

function parseEvidenceLedger(recordId) {
  const file = path.join(EVIDENCE_DIR, `${recordId}.md`);
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/).filter((l) => l.trim().startsWith('|') && !l.includes('---'));
  if (lines.length < 2) return [];

  const claims = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i]
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length >= 7) {
      const urlMatch = cells[3].match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
      claims.push({
        claimId: cells[0].replace(/`/g, ''),
        layer: cells[1],
        claim: cells[2],
        sourceName: urlMatch ? urlMatch[1] : cells[3],
        sourceUrl: urlMatch ? urlMatch[2] : '',
        locator: cells[4],
        scope: cells[5],
        result: cells[6],
      });
    }
  }
  return claims;
}

function buildRecord(fileRelPath) {
  const absPath = path.join(DOCS_DIR, fileRelPath);
  const raw = fs.readFileSync(absPath, 'utf8');
  const { meta, body } = parseFrontmatter(raw);

  const slug = fileRelPath.replace(/\\/g, '/').replace(/\.mdx?$/, '');
  const product = slug.split('/')[0] || 'upi';

  const sectionsRaw = body.split(/\n(?=## )/);
  const sections = {};
  let whatToDoControls = [];
  let references = [];

  for (const sec of sectionsRaw) {
    const match = sec.match(/^##\s+([^\r\n]+)/);
    if (!match) continue;
    const heading = match[1].trim();
    const headingLower = heading.toLowerCase();
    const secBody = sec.replace(/^##\s+[^\r\n]+/, '').trim();

    if (headingLower.includes('what to do')) {
      sections['what_to_do'] = secBody;
      whatToDoControls = parseTableRows(secBody);
    } else if (headingLower.startsWith('what it')) {
      sections['what_it_is'] = secBody;
    } else if (headingLower.startsWith('impact')) {
      sections['impact'] = secBody;
    } else if (
      headingLower.includes('pattern') ||
      headingLower.includes('failure mode') ||
      headingLower.includes('when it applies') ||
      headingLower.includes('where it applies')
    ) {
      sections['common_patterns'] = secBody;
    } else if (headingLower.includes('watch-out')) {
      sections['watch_outs'] = secBody;
    } else if (headingLower.includes('reference') || headingLower.includes('review history')) {
      sections['references'] = secBody;
      references = parseReferences(secBody);
    } else {
      sections[heading.toLowerCase().replace(/[^a-z0-9]+/g, '_')] = secBody;
    }
  }

  const recordId = meta.recordId || slug.toUpperCase().replace(/\//g, '-');
  const evidenceLedger = parseEvidenceLedger(recordId);
  const sourceLabels = extractSourceLabels(references);

  return {
    recordId,
    title: meta.title || '',
    description: meta.description || '',
    slug,
    url: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/${slug}/`,
    product: meta.products ? meta.products[0] : product,
    products: meta.products || [product],
    recordType: meta.recordType || 'topic',
    theme: meta.theme || '',
    themeLabel: taxonomy.themes[meta.theme] || meta.theme || '',
    lifecycle: meta.lifecycle || [],
    actors: meta.actors || [],
    evidenceLayers: meta.evidenceLayers || [],
    reviewStage: meta.reviewStage || 'draft',
    lastSourceCheck: meta.lastSourceCheck || '2026-11-23',
    sourceLabels,
    sections,
    controls: whatToDoControls,
    references,
    evidenceLedger,
    fullMarkdown: raw,
  };
}

function buildGuideDocs() {
  const guideFiles = [
    { slug: 'methodology', rel: 'methodology.md', title: 'Methodology' },
    { slug: 'evidence-policy', rel: 'evidence-policy.md', title: 'Evidence and attribution policy' },
    { slug: 'contribute', rel: 'contribute.md', title: 'Contribute' },
    { slug: 'licensing', rel: 'licensing.md', title: 'Licensing and reuse' },
    { slug: 'upi/risk-stack-playbook', rel: path.join('upi', 'risk-stack-playbook.md'), title: 'UPI Risk-Stack Playbook' },
    { slug: 'upi/operator-insights', rel: path.join('upi', 'operator-insights.md'), title: 'Operator Insights & Evidence' },
    { slug: 'upi/glossary', rel: path.join('upi', 'glossary.md'), title: 'UPI Risk Glossary' },
    { slug: 'upi/sources', rel: path.join('upi', 'sources.md'), title: 'Verified Primary Sources Register' },
    { slug: 'upi/coverage', rel: path.join('upi', 'coverage.mdx'), title: 'Coverage & Review Status' },
    { slug: 'upi/upi-ecosystem', rel: path.join('upi', 'upi-ecosystem.md'), title: 'UPI Ecosystem' },
  ];

  return guideFiles.map((g) => {
    const absPath = path.join(DOCS_DIR, g.rel);
    let body = '';
    let description = '';
    if (fs.existsSync(absPath)) {
      const raw = fs.readFileSync(absPath, 'utf8');
      const parsed = parseFrontmatter(raw);
      body = parsed.body;
      description = parsed.meta.description || '';
    }
    return {
      slug: g.slug,
      title: g.title,
      description,
      url: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/${g.slug}/`,
      content: body,
    };
  });
}

function buildKnowledgeGraph(records) {
  const nodes = records.map((r) => ({
    id: r.slug,
    recordId: r.recordId,
    title: r.title,
    theme: r.theme,
    themeLabel: r.themeLabel,
    actors: r.actors,
    sourceLabels: r.sourceLabels,
  }));

  const bySource = new Map();
  const byTheme = new Map();

  for (const r of records) {
    for (const src of r.sourceLabels) {
      if (!bySource.has(src)) bySource.set(src, []);
      bySource.get(src).push(r.recordId);
    }
    if (r.theme) {
      if (!byTheme.has(r.theme)) byTheme.set(r.theme, []);
      byTheme.get(r.theme).push(r.recordId);
    }
  }

  const connections = {};
  for (const r of records) {
    const sharedSources = new Set();
    const sameTheme = new Set();

    for (const src of r.sourceLabels) {
      for (const other of bySource.get(src) || []) {
        if (other !== r.recordId) sharedSources.add(other);
      }
    }
    if (r.theme) {
      for (const other of byTheme.get(r.theme) || []) {
        if (other !== r.recordId) sameTheme.add(other);
      }
    }

    connections[r.recordId] = {
      sharedSources: Array.from(sharedSources),
      sameTheme: Array.from(sameTheme),
      allNeighbors: Array.from(new Set([...sharedSources, ...sameTheme])),
    };
  }

  return { nodes, connections };
}

export function generateAllData() {
  const upiDir = path.join(DOCS_DIR, 'upi');
  const files = fs
    .readdirSync(upiDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join('upi', f));

  const records = files.map((f) => buildRecord(f));

  records.sort((a, b) => {
    if (a.recordId === 'UPI-OVERVIEW') return -1;
    if (b.recordId === 'UPI-OVERVIEW') return 1;
    return a.recordId.localeCompare(b.recordId);
  });

  const guideDocs = buildGuideDocs();
  const knowledgeGraph = buildKnowledgeGraph(records);

  const dataset = {
    metadata: {
      title: 'India Fintech Risk Atlas',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      baseUrl: 'https://eyeinthesky6.github.io/india-fintech-risk-atlas/',
      triageWorkerUrl: 'https://atlas-report-triage.6edroid.workers.dev',
      totalRecords: records.length,
      totalGuideDocs: guideDocs.length,
      evidenceLayers: [
        { id: 'official', label: 'Regulatory', authority: 'RBI / NPCI binding mandates & official directions' },
        { id: 'industry', label: 'Industry practice', authority: 'Company documentation & published engineering postmortems' },
        { id: 'practitioner', label: 'Community insight', authority: 'Operator firsthand observations & public case studies' },
        { id: 'research', label: 'Research & academic', authority: 'Empirical studies, academic papers, and benchmark leads' },
        { id: 'atlas', label: 'Atlas guidance', authority: 'Editorial synthesis, gap framing, and candidate validation controls' },
      ],
      taxonomy,
    },
    records,
    guideDocs,
    knowledgeGraph,
  };

  // 1. Write public/atlas-records.json
  const publicDir = path.join(ROOT_DIR, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'atlas-records.json'), JSON.stringify(dataset, null, 2), 'utf8');

  // 2. Write mcp/data/atlas-records.json
  const mcpDataDir = path.join(ROOT_DIR, 'mcp', 'data');
  if (!fs.existsSync(mcpDataDir)) fs.mkdirSync(mcpDataDir, { recursive: true });
  fs.writeFileSync(path.join(mcpDataDir, 'atlas-records.json'), JSON.stringify(dataset, null, 2), 'utf8');

  // 3. Write public/llms.txt
  const llmsTxt = [
    '# India Fintech Risk Atlas',
    '> An open, source-cited reference for Indian fintech (UPI, Cards, PA/PG, Lending) fraud patterns, controls, and operational risks.',
    '',
    '## About',
    '- Source: https://github.com/eyeinthesky6/india-fintech-risk-atlas',
    '- Live Documentation: https://eyeinthesky6.github.io/india-fintech-risk-atlas/',
    '- API / JSON Dataset: https://eyeinthesky6.github.io/india-fintech-risk-atlas/atlas-records.json',
    '- MCP Server: india-fintech-risk-atlas-mcp',
    '- Evidence Layers: Regulatory (RBI/NPCI), Industry practice, Community insight, Research & academic, Atlas guidance',
    '',
    '## Canonical Risk Records',
    ...records.map(
      (r) =>
        `- [${r.recordId}] ${r.title}: ${r.description} (${r.url}) - Layers: ${r.evidenceLayers.join(', ')} | Stage: ${r.reviewStage}`,
    ),
    '',
    '## Documentation & Policies',
    ...guideDocs.map((g) => `- [${g.title}](${g.url}): ${g.description || g.title}`),
  ].join('\n');

  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt, 'utf8');

  // 4. Write public/llms-full.txt
  const fullDocs = [
    '# India Fintech Risk Atlas — Consolidated Knowledge Pack',
    `Generated: ${new Date().toISOString()}`,
    '',
    '---',
    '',
    ...records.map((r) => [
      `# ${r.recordId}: ${r.title}`,
      `URL: ${r.url}`,
      `Description: ${r.description}`,
      `Product: ${r.product} | Type: ${r.recordType} | Review Stage: ${r.reviewStage} | Last Source Check: ${r.lastSourceCheck}`,
      `Actors: ${r.actors.join(', ')} | Evidence Layers: ${r.evidenceLayers.join(', ')}`,
      '',
      r.fullMarkdown.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim(),
      '',
      '---',
      '',
    ].join('\n')),
  ].join('\n');

  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullDocs, 'utf8');

  console.log(`Successfully generated Atlas data for ${records.length} records and ${guideDocs.length} guide documents.`);
}

generateAllData();
