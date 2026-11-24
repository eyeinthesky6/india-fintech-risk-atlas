import { getCollection, type CollectionEntry } from 'astro:content';
import { getBasePath, taxonomy, taxonomyLabel } from './upi-records';

export interface AtlasGraphNode {
  id: string;
  slug: string;
  recordId: string;
  title: string;
  href: string;
  recordType: string;
  recordTypeLabel: string;
  theme: string;
  themeLabel: string;
  reviewStage: string;
  actors: string[];
  actorLabels: string[];
  sourceLabels: string[];
  isHub: boolean;
}

export interface AtlasGraphEdge {
  source: string;
  target: string;
  kind: 'shared-source' | 'theme' | 'direct-link';
  labels: string[];
}

export interface AtlasGraphData {
  nodes: AtlasGraphNode[];
  sourceEdges: AtlasGraphEdge[];
  themeEdges: AtlasGraphEdge[];
  directEdges: AtlasGraphEdge[];
  backlinksBySlug: Record<string, string[]>;
  outlinksBySlug: Record<string, string[]>;
}

const HUB_SLUGS = new Set([
  'upi',
  'upi/risk-stack-playbook',
  'upi/sources',
  'upi/glossary',
  'upi/coverage',
  'upi/operator-insights',
]);

const SOURCE_MATCHERS: Array<[RegExp, string]> = [
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

export function normalizeDocSlug(entryId: string): string {
  const clean = entryId.replace(/^\/+|\/+$/g, '');
  if (clean === 'index' || clean === '') return '';
  return clean.replace(/\/index$/, '');
}

function extractReferencesSection(body: string | undefined): string {
  if (!body) return '';
  const normalized = body.replace(/\r\n/g, '\n');
  const startMatch = /^##\s+References\b[^\n]*\n/im.exec(normalized);
  if (!startMatch) return '';
  const rest = normalized.slice(startMatch.index + startMatch[0].length);
  const nextHeading = rest.search(/^##\s+/m);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function extractSourceLabels(body: string | undefined): string[] {
  const refs = extractReferencesSection(body);
  if (!refs) return [];
  const urls = refs.match(/https?:\/\/[^\s\)\]>"]+/g) ?? [];
  const labels = new Set<string>();
  for (const rawUrl of urls) {
    const cleanUrl = rawUrl.replace(/[.,;'"`]+$/, '');
    for (const [pattern, label] of SOURCE_MATCHERS) {
      if (pattern.test(cleanUrl)) {
        labels.add(label);
      }
    }
  }
  return Array.from(labels);
}

function extractInternalLinks(body: string | undefined, base: string): string[] {
  if (!body) return [];
  const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${escapedBase}/([a-z0-9/-]*)/?`, 'gi');
  const slugs = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    const candidate = normalizeDocSlug(match[1]);
    if (candidate) slugs.add(candidate);
  }
  return Array.from(slugs);
}

let cachedGraph: Promise<AtlasGraphData> | null = null;

export async function getAtlasGraphData(): Promise<AtlasGraphData> {
  if (!cachedGraph) {
    cachedGraph = buildAtlasGraphData();
  }
  return cachedGraph;
}

async function buildAtlasGraphData(): Promise<AtlasGraphData> {
  const base = getBasePath();
  const entries: CollectionEntry<'docs'>[] = await getCollection('docs');

  const nodes: AtlasGraphNode[] = [];
  const nodeBySlug = new Map<string, AtlasGraphNode>();
  const rawBodyBySlug = new Map<string, string | undefined>();

  for (const entry of entries) {
    const slug = normalizeDocSlug(entry.id);
    const isRecord = Boolean(entry.data.recordId);
    const isHub = !isRecord && HUB_SLUGS.has(slug);
    if (!isRecord && !isHub) continue;

    const recordType = isRecord ? (entry.data.recordType ?? 'explainer') : 'hub';
    const recordTypeLabel = isRecord
      ? taxonomyLabel(taxonomy.recordTypes, entry.data.recordType)
      : 'Hub & guide';
    const theme = entry.data.theme ?? 'hub';
    const themeLabel = isRecord
      ? taxonomyLabel(taxonomy.themes, entry.data.theme)
      : 'Guides & indexes';
    const actors = entry.data.actors ?? [];
    const actorLabels = actors.map((a) => taxonomyLabel(taxonomy.actors, a));
    const sourceLabels = isRecord ? extractSourceLabels(entry.body) : [];

    const href = slug === '' ? `${base}/` : `${base}/${slug}/`;
    const node: AtlasGraphNode = {
      id: entry.id,
      slug,
      recordId: entry.data.recordId ?? slug.split('/').pop()?.toUpperCase() ?? 'HUB',
      title: entry.data.title,
      href,
      recordType,
      recordTypeLabel,
      theme,
      themeLabel,
      reviewStage: entry.data.reviewStage ?? (isHub ? 'hub' : 'draft'),
      actors,
      actorLabels,
      sourceLabels,
      isHub,
    };
    nodes.push(node);
    nodeBySlug.set(slug, node);
    rawBodyBySlug.set(slug, entry.body);
  }

  // Deterministic ordering: canonical records first, hubs last
  nodes.sort((a, b) => {
    if (a.isHub !== b.isHub) return a.isHub ? 1 : -1;
    return a.recordId.localeCompare(b.recordId);
  });

  // 1. Direct internal links + backlinks map
  const outlinksBySlug: Record<string, string[]> = {};
  const backlinksBySlug: Record<string, string[]> = {};
  const directEdgeMap = new Map<string, AtlasGraphEdge>();

  for (const node of nodes) {
    const targets = extractInternalLinks(rawBodyBySlug.get(node.slug), base).filter(
      (targetSlug) => targetSlug !== node.slug && nodeBySlug.has(targetSlug),
    );
    outlinksBySlug[node.slug] = targets;
    for (const targetSlug of targets) {
      backlinksBySlug[targetSlug] ??= [];
      if (!backlinksBySlug[targetSlug].includes(node.slug)) {
        backlinksBySlug[targetSlug].push(node.slug);
      }
      const [a, b] = node.slug < targetSlug ? [node.slug, targetSlug] : [targetSlug, node.slug];
      const key = `${a}::${b}`;
      if (!directEdgeMap.has(key)) {
        directEdgeMap.set(key, {
          source: a,
          target: b,
          kind: 'direct-link',
          labels: ['Direct cross-link'],
        });
      }
    }
  }

  // 2. Shared primary-source edges between canonical records
  const canonicalNodes = nodes.filter((n) => !n.isHub);
  const sourceEdges: AtlasGraphEdge[] = [];
  for (let i = 0; i < canonicalNodes.length; i++) {
    for (let j = i + 1; j < canonicalNodes.length; j++) {
      const a = canonicalNodes[i];
      const b = canonicalNodes[j];
      const shared = a.sourceLabels.filter((s) => b.sourceLabels.includes(s));
      if (shared.length > 0) {
        sourceEdges.push({
          source: a.slug,
          target: b.slug,
          kind: 'shared-source',
          labels: shared,
        });
      }
    }
  }

  // 3. Same-theme edges (clique within each theme + connect theme anchors to `upi` hub if present)
  const themeEdges: AtlasGraphEdge[] = [];
  const byTheme = new Map<string, AtlasGraphNode[]>();
  for (const node of canonicalNodes) {
    byTheme.set(node.theme, [...(byTheme.get(node.theme) ?? []), node]);
  }
  for (const [themeId, group] of byTheme.entries()) {
    const label = taxonomyLabel(taxonomy.themes, themeId) || themeId;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        themeEdges.push({
          source: group[i].slug,
          target: group[j].slug,
          kind: 'theme',
          labels: [label],
        });
      }
    }
    if (nodeBySlug.has('upi') && group.length > 0) {
      themeEdges.push({
        source: 'upi',
        target: group[0].slug,
        kind: 'theme',
        labels: [label],
      });
    }
  }

  return {
    nodes,
    sourceEdges,
    themeEdges,
    directEdges: Array.from(directEdgeMap.values()),
    backlinksBySlug,
    outlinksBySlug,
  };
}

export interface NeighborSummary {
  node: AtlasGraphNode;
  reasons: string[];
  kind: 'direct-link' | 'shared-source' | 'theme';
}

export interface PageNeighbors {
  currentNode: AtlasGraphNode | null;
  directNeighbors: NeighborSummary[];
  sharedSourceNeighbors: NeighborSummary[];
  localNodes: AtlasGraphNode[];
  localEdges: AtlasGraphEdge[];
}

export function getPageNeighbors(graph: AtlasGraphData, entryId: string): PageNeighbors {
  const slug = normalizeDocSlug(entryId);
  const bySlug = new Map(graph.nodes.map((n) => [n.slug, n]));
  const currentNode = bySlug.get(slug) ?? null;

  if (!currentNode) {
    // Non-record top-level page (e.g., methodology / contribute): return overview cluster
    const upiHub = bySlug.get('upi');
    const previewNodes = graph.nodes.slice(0, 8);
    if (upiHub && !previewNodes.some((n) => n.slug === upiHub.slug)) {
      previewNodes.unshift(upiHub);
    }
    const previewSlugs = new Set(previewNodes.map((n) => n.slug));
    const previewEdges = graph.sourceEdges
      .filter((e) => previewSlugs.has(e.source) && previewSlugs.has(e.target))
      .slice(0, 12);
    return {
      currentNode: null,
      directNeighbors: [],
      sharedSourceNeighbors: [],
      localNodes: previewNodes,
      localEdges: previewEdges,
    };
  }

  const directSlugs = new Set<string>([
    ...(graph.outlinksBySlug[slug] ?? []),
    ...(graph.backlinksBySlug[slug] ?? []),
  ]);
  const directNeighbors: NeighborSummary[] = Array.from(directSlugs)
    .map((s) => bySlug.get(s))
    .filter((n): n is AtlasGraphNode => Boolean(n))
    .map((node) => ({
      node,
      reasons: [
        (graph.backlinksBySlug[slug] ?? []).includes(node.slug) &&
        (graph.outlinksBySlug[slug] ?? []).includes(node.slug)
          ? 'Linked both ways'
          : (graph.backlinksBySlug[slug] ?? []).includes(node.slug)
            ? 'Backlink'
            : 'Links to',
      ],
      kind: 'direct-link' as const,
    }));

  const sharedSourceNeighbors: NeighborSummary[] = graph.sourceEdges
    .filter((e) => e.source === slug || e.target === slug)
    .map((edge) => {
      const otherSlug = edge.source === slug ? edge.target : edge.source;
      const other = bySlug.get(otherSlug);
      return other ? { node: other, reasons: edge.labels, kind: 'shared-source' as const } : null;
    })
    .filter((item): item is NeighborSummary => Boolean(item))
    .sort((a, b) => b.reasons.length - a.reasons.length || a.node.recordId.localeCompare(b.node.recordId));

  // Build compact local graph slice (up to 9 closest neighbors) so sidebar SVG stays uncluttered
  const picked = new Map<string, AtlasGraphNode>();
  picked.set(currentNode.slug, currentNode);

  for (const item of directNeighbors) {
    if (picked.size >= 10) break;
    picked.set(item.node.slug, item.node);
  }
  for (const item of sharedSourceNeighbors) {
    if (picked.size >= 10) break;
    picked.set(item.node.slug, item.node);
  }
  if (picked.size < 8) {
    for (const edge of graph.themeEdges) {
      if (edge.source === slug || edge.target === slug) {
        const other = bySlug.get(edge.source === slug ? edge.target : edge.source);
        if (other && picked.size < 10) picked.set(other.slug, other);
      }
    }
  }

  const localSlugs = new Set(picked.keys());
  const localEdges: AtlasGraphEdge[] = [
    ...graph.directEdges.filter((e) => localSlugs.has(e.source) && localSlugs.has(e.target)),
    ...graph.sourceEdges.filter((e) => localSlugs.has(e.source) && localSlugs.has(e.target)),
  ];
  if (localEdges.length === 0) {
    localEdges.push(
      ...graph.themeEdges.filter((e) => localSlugs.has(e.source) && localSlugs.has(e.target)),
    );
  }

  return {
    currentNode,
    directNeighbors,
    sharedSourceNeighbors,
    localNodes: Array.from(picked.values()),
    localEdges,
  };
}
