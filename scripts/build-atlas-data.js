import { buildRelationships, sourceKeys } from '../src/lib/atlas-relationships.js';
import { renderLlmIndex } from '../mcp/src/llms-index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TAXONOMY_PATH = path.join(ROOT_DIR, 'src', 'taxonomy.json');
const DOCS_DIR = path.join(ROOT_DIR, 'src', 'content', 'docs');
const EVIDENCE_DIR = path.join(ROOT_DIR, 'research', 'evidence');

const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));


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

function normalizeBasis(raw) {
  const text = raw.replace(/<[^>]+>/g, '').replace(/\*/g, '').replace(/\[\d+\]/g, '').trim();
  const canonical = ['Regulatory', 'Industry practice', 'Community insight', 'Research & academic', 'Atlas guidance'];
  const exact = canonical.find(b => b.toLowerCase() === text.toLowerCase());
  if (exact) return exact;
  if (/^Regulatory\s*\(consultation\)$/i.test(text)) return 'Regulatory';
  // These are explicit regulator-labelled rows, not a finding of binding legal force.
  if (/^RBI\b/i.test(text)) return 'Regulatory';
  return text;
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
        basis: normalizeBasis(cells[0]),
        basisRaw: cells[0],
        regulatoryStatus: /consultation|proposal/i.test(cells[0]) ? 'proposal' : 'not-determined',
        owner: cells[1].replace(/\*/g, '').trim(),
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
  const raw = fs.readFileSync(absPath, 'utf8').replace(/\r\n/g, '\n');
  const { meta, body } = parseFrontmatter(raw);

  if (!meta.recordId) {
    return null; // Not a canonical risk record
  }

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

    if (
      headingLower.includes('what to do') ||
      headingLower.includes('key obligations and boundaries') ||
      headingLower.includes('key proposals and trade-offs')
    ) {
      sections['what_to_do'] = secBody;
      whatToDoControls = parseTableRows(secBody);
    } else if (headingLower.startsWith('what it') || headingLower.includes('what it covers')) {
      sections['what_it_is'] = secBody;
    } else if (
      headingLower.startsWith('impact') ||
      headingLower.includes('why it matters') ||
      headingLower.includes('participant roles at a glance')
    ) {
      sections['impact'] = secBody;
    } else if (
      headingLower.includes('pattern') ||
      headingLower.includes('failure mode') ||
      headingLower.includes('when it applies') ||
      headingLower.includes('where it applies')
    ) {
      sections['common_patterns'] = secBody;
    } else if (headingLower.includes('watch-out') || headingLower.startsWith('watch-outs')) {
      sections['watch_outs'] = secBody;
    } else if (headingLower.includes('reference') || headingLower.includes('review history')) {
      sections['references'] = secBody;
      references = parseReferences(secBody);
    } else {
      sections[heading.toLowerCase().replace(/[^a-z0-9]+/g, '_')] = secBody;
    }
  }

  const recordId = meta.recordId;
  const evidenceLedger = parseEvidenceLedger(recordId);
  const sourceLabels = sourceKeys(body);

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
    blockerNote: meta.blockerNote || '',
    lastSourceCheck: meta.lastSourceCheck || null,
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
      const raw = fs.readFileSync(absPath, 'utf8').replace(/\r\n/g, '\n');
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
  const nodes = records.map(r => ({id:r.slug, slug:r.slug, recordId:r.recordId,title:r.title,theme:r.theme,themeLabel:r.themeLabel,actors:r.actors,sourceLabels:r.sourceLabels}));
  const edges = buildRelationships(records.map(r => ({...r,body:r.fullMarkdown})), '/india-fintech-risk-atlas');
  const ids = new Map(nodes.map(n=>[n.slug,n.recordId]));
  const neighbors = (list, slug) => list.filter(e=>e.source===slug || e.target===slug).map(e=>ids.get(e.source===slug?e.target:e.source));
  const connections = Object.fromEntries(nodes.map(n=>{
    const sharedSources=neighbors(edges.sourceEdges,n.slug);
    const sameTheme=neighbors(edges.themeEdges,n.slug);
    const directLinks=neighbors(edges.directEdges,n.slug);
    return [n.recordId,{sharedSources,sameTheme,directLinks,allNeighbors:[...new Set([...sharedSources,...sameTheme,...directLinks])]}];
  }));
  return {nodes,connections,...edges};
}

function reuseGenerationDate(dataset, existingPath) {
  if (!fs.existsSync(existingPath)) return;
  let existing;
  try {
    existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) return;
    throw error;
  }
  const generatedAt = existing?.metadata?.generatedAt;
  if (!Number.isFinite(Date.parse(generatedAt))) return;

  // Rebuilding an unchanged corpus must preserve both its date and its bytes.
  if (JSON.stringify({ ...dataset, metadata: { ...dataset.metadata, generatedAt } }) === JSON.stringify(existing)) {
    dataset.metadata.generatedAt = generatedAt;
  }
}

export function generateAllData() {
  function discoverRecords(dir = DOCS_DIR) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) return discoverRecords(abs);
      return entry.isFile() && /\.mdx?$/.test(entry.name)
        ? [path.relative(DOCS_DIR, abs)] : [];
    });
  }
  const files = discoverRecords();

  const records = files.map((f) => buildRecord(f)).filter(Boolean);

  records.sort((a, b) => {
    if (a.recordId === 'UPI-OVERVIEW') return -1;
    if (b.recordId === 'UPI-OVERVIEW') return 1;
    return a.recordId.localeCompare(b.recordId);
  });

  const ids = new Set();
  for (const record of records) {
    if (ids.has(record.recordId)) throw new Error(`Duplicate record ID: ${record.recordId}`);
    ids.add(record.recordId);
  }
  const guideDocs = buildGuideDocs();
  const knowledgeGraph = buildKnowledgeGraph(records);

  const dataset = {
    metadata: {
      title: 'India Fintech Risk Atlas',
      version: '1.1.0',
      generatedAt: new Date().toISOString(),
      baseUrl: 'https://eyeinthesky6.github.io/india-fintech-risk-atlas/',
      totalRecords: records.length,
      coveredProducts: [...new Set(records.flatMap((r) => r.products))].sort(),
      publicationStatus: 'research-preview',
      verificationNotice: 'Source-checked records await independent review. Draft records may have blocked primary sources. Regulatory material can include proposals or future obligations. Verify the scope, effective date and primary text before relying on a claim.',
      totalGuideDocs: guideDocs.length,
      evidenceLayers: [
        { id: 'official', label: 'Regulatory', authority: 'RBI / NPCI official material, including mandates and non-binding proposals' },
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

  const publicDir = path.join(ROOT_DIR, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const publicSnapshot = path.join(publicDir, 'atlas-records.json');
  reuseGenerationDate(dataset, publicSnapshot);
  const snapshotJson = JSON.stringify(dataset, null, 2);
  fs.writeFileSync(publicSnapshot, snapshotJson, 'utf8');

  const mcpDataDir = path.join(ROOT_DIR, 'mcp', 'data');
  if (!fs.existsSync(mcpDataDir)) fs.mkdirSync(mcpDataDir, { recursive: true });
  fs.writeFileSync(path.join(mcpDataDir, 'atlas-records.json'), snapshotJson, 'utf8');

  fs.writeFileSync(path.join(publicDir, 'llms.txt'), renderLlmIndex(dataset), 'utf8');

  const fullDocs = [
    '# India Fintech Risk Atlas — Consolidated Knowledge Pack',
    `Generated: ${dataset.metadata.generatedAt}`,
    dataset.metadata.verificationNotice,
    '',
    '---',
    '',
    ...records.map((r) => [
      `# ${r.recordId}: ${r.title}`,
      `URL: ${r.url}`,
      `Description: ${r.description}`,
      `Product: ${r.product} | Type: ${r.recordType} | Review Stage: ${r.reviewStage} | Last Source Check: ${r.lastSourceCheck}`,
      ...(r.blockerNote ? [`Source blocker: ${r.blockerNote}`] : []),
      `Actors: ${r.actors.join(', ')} | Evidence Layers: ${r.evidenceLayers.join(', ')}`,
      '',
      r.fullMarkdown.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim(),
      '',
      '---',
      '',
    ].join('\n')),
  ].join('\n');

  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullDocs, 'utf8');

  console.log(`Successfully generated Atlas data for ${records.length} canonical records and ${guideDocs.length} guide documents.`);
}

generateAllData();
