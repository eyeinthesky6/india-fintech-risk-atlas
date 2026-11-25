import assert from 'node:assert/strict';
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('dist/atlas-records.json', 'utf8'));
const exampleRecord = data.records.find((record) => record.recordId === 'UPI-009');
const html = fs.readFileSync(`dist/${exampleRecord.slug}/index.html`, 'utf8');
const payload = html.match(/<script\b[^>]*data-atlas-graph-payload[^>]*>([\s\S]*?)<\/script>/);
assert.ok(payload, 'Expected a website graph payload on the record page');
const website = JSON.parse(payload[1]);
const canonical = new Map(website.nodes.filter((node) => !node.isHub).map((node) => [node.slug, node.recordId]));
assert.deepEqual(new Set(canonical.values()), new Set(data.records.map((record) => record.recordId)));

function pair(a, b) {
  return [a, b].sort().join(':');
}

for (const [web, machine] of [['sourceEdges', 'sharedSources'], ['themeEdges', 'sameTheme'], ['directEdges', 'directLinks']]) {
  const rendered = new Set(website[web]
    .filter((edge) => canonical.has(edge.source) && canonical.has(edge.target))
    .map((edge) => pair(canonical.get(edge.source), canonical.get(edge.target))));
  const bundled = new Set(Object.entries(data.knowledgeGraph.connections)
    .flatMap(([id, connections]) => connections[machine].map((neighbor) => pair(id, neighbor))));
  assert.deepEqual(rendered, bundled, `${machine} must agree for canonical records`);
}
console.log('Website and machine graph edges agree across all canonical records.');
