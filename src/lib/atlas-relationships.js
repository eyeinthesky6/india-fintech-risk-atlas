// Shared relationship primitives for website and machine exports. No Astro or Node dependencies.
export function sourceKeys(body) {
  // Use the section boundary explicitly; multiline $ otherwise matches end of each line.
  const text = (body || '').replace(/\r\n/g, '\n');
  const start = /^##\s+References\b[^\n]*\n/im.exec(text);
  if (!start) return [];
  const rest = text.slice(start.index + start[0].length);
  const end = rest.search(/^##\s+/m);
  const section = end < 0 ? rest : rest.slice(0, end);
  const keys = new Set();
  for (const raw of section.match(/https?:\/\/[^\s)\]>"`]+/g) || []) {
    try {
      const u = new URL(raw.replace(/[.,;'"]+$/, '').replace(/&amp;/g, '&'));
      u.hash = '';
      const host = u.hostname.toLowerCase().replace(/^www\./, '');
      const id = [...u.searchParams].find(([k]) => k.toLowerCase() === 'id');
      if (host === 'rbi.org.in' && id) {
        // Preserve historical-version identifiers, not just the parent direction.
        const history = [...u.searchParams].find(([k]) => k.toLowerCase() === 'histid');
        keys.add('rbi.org.in/document/' + id[1] + (history ? '/history/' + history[1] : ''));
      } else {
        u.searchParams.sort();
        keys.add(host + u.pathname.replace(/\/$/, '') + u.search);
      }
    } catch { /* malformed URL is not a graph relation */ }
  }
  return [...keys].sort();
}

export function directTargets(body, base, validSlugs, self) {
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(escaped + '/([a-z0-9/-]+)', 'gi');
  const targets = new Set();
  for (const match of (body || '').matchAll(pattern)) {
    const slug = match[1].replace(/\/+$/, '').replace(/\/index$/, '');
    if (slug !== self && validSlugs.has(slug)) targets.add(slug);
  }
  return [...targets].sort();
}

export function buildRelationships(nodes, base) {
  const valid = new Set(nodes.map(n => n.slug));
  const outlinksBySlug = {};
  const backlinksBySlug = {};
  const direct = new Map();
  const sourceEdges = [], themeEdges = [];
  const canonical = nodes.filter(n => !n.isHub);
  const sources = new Map(canonical.map(n => [n.slug, sourceKeys(n.body)]));
  for (const n of nodes) {
    const targets = directTargets(n.body, base, valid, n.slug);
    outlinksBySlug[n.slug] = targets;
    for (const t of targets) {
      (backlinksBySlug[t] ??= []).push(n.slug);
      const [a,b] = [n.slug,t].sort();
      direct.set(a+'::'+b, {source:a,target:b,kind:'direct-link',labels:['Direct cross-link']});
    }
  }
  for (let i=0;i<canonical.length;i++) for(let j=i+1;j<canonical.length;j++) {
    const a=canonical[i], b=canonical[j];
    const shared=sources.get(a.slug).filter(k=>sources.get(b.slug).includes(k));
    if(shared.length) sourceEdges.push({source:a.slug,target:b.slug,kind:'shared-source',labels:shared});
    if(a.theme && a.theme===b.theme) themeEdges.push({source:a.slug,target:b.slug,kind:'theme',labels:[a.themeLabel || a.theme]});
  }
  return {sourceEdges,themeEdges,directEdges:[...direct.values()],outlinksBySlug,backlinksBySlug};
}
