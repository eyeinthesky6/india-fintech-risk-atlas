import { buildRelationships, sourceKeys } from './atlas-relationships.js';
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


export function normalizeDocSlug(entryId: string): string {
  const clean = entryId.replace(/^\/+|\/+$/g, '');
  if (clean === 'index' || clean === '') return '';
  return clean.replace(/\/index$/, '');
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
    const sourceLabels = isRecord ? sourceKeys(entry.body) : [];

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
    rawBodyBySlug.set(slug, entry.body);
  }

  // Deterministic ordering: canonical records first, hubs last
  nodes.sort((a, b) => {
    if (a.isHub !== b.isHub) return a.isHub ? 1 : -1;
    return a.recordId.localeCompare(b.recordId);
  });

  const relationships = buildRelationships(nodes.map(n => ({ ...n, body: rawBodyBySlug.get(n.slug) })), base);
  return { nodes, ...relationships } as AtlasGraphData;
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
