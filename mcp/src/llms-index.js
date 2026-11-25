export function renderLlmIndex({ metadata, records, guideDocs }) {
  return [
    '# India Fintech Risk Atlas',
    '> An open research preview of Indian fintech fraud patterns, controls, and operational risks. Not legal advice or an independently certified compliance checklist.',
    '',
    '## About',
    '- Source: https://github.com/eyeinthesky6/india-fintech-risk-atlas',
    '- Live Documentation: https://eyeinthesky6.github.io/india-fintech-risk-atlas/',
    '- [Structured JSON dataset](https://eyeinthesky6.github.io/india-fintech-risk-atlas/atlas-records.json): records, claims, sources and graph.',
    '- [Full knowledge pack](https://eyeinthesky6.github.io/india-fintech-risk-atlas/llms-full.txt): consolidated record text.',
    '- [Local MCP setup](https://github.com/eyeinthesky6/india-fintech-risk-atlas/tree/main/mcp): local stdio only.',
    `- Products currently represented: ${metadata.coveredProducts.join(', ')}. Coverage is not exhaustive.`,
    `- ${metadata.verificationNotice}`,
    '- Evidence Layers: Regulatory (RBI/NPCI), Industry practice, Community insight, Research & academic, Atlas guidance',
    '',
    '## Canonical Risk Records',
    ...records.map((record) => {
      const blocker = record.blockerNote ? ` | Source blocker: ${record.blockerNote}` : '';
      return `- [${record.recordId}: ${record.title}](${record.url}): ${record.description} | Layers: ${record.evidenceLayers.join(', ')} | Stage: ${record.reviewStage} | Last source check: ${record.lastSourceCheck ?? 'unknown'}${blocker}`;
    }),
    '',
    '## Documentation & Policies',
    ...guideDocs.map((guide) => `- [${guide.title}](${guide.url}): ${guide.description || guide.title}`),
  ].join('\n');
}
