interface LayerMeta {
  tag: string;
  role: string;
}

const LAYER_META: Record<string, LayerMeta> = {
  '1': { tag: 'Regulatory', role: 'RBI / NPCI' },
  '2': { tag: 'Industry practice', role: 'Company docs' },
  '3': { tag: 'Community insight', role: 'Operator-observed' },
  '4': { tag: 'Research & academic', role: 'Empirical papers & studies' },
  '5': { tag: 'Atlas guidance', role: 'Candidate controls & validation' },
};

const H2_WRAPPER_RE = /<div class="sl-heading-wrapper level-h2"><h2\b[\s\S]*?<\/h2>(?:\s*<a\b[^>]*>[\s\S]*?<\/a>)?\s*<\/div>/g;

function wrapBareTables(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/g, (tableHtml, offset: number, full: string) => {
    const before = full.slice(Math.max(0, offset - 80), offset);
    if (/<div\b[^>]*class="[^"]*\batlas-table-wrap\b[^"]*"[^>]*>\s*$/i.test(before)) {
      return tableHtml;
    }
    return `<div class="atlas-table-wrap">${tableHtml}</div>`;
  });
}

function enhanceBasisCells(html: string): string {
  return html.replace(
    /<td>\s*(Regulatory|Industry practice|Community insight|Practitioner|Research\s*(?:&amp;|&)\s*academic|Research lead|Research|Atlas guidance|(?:Mandatory|Industry|Practitioner|Suggested)\s*(?:·|&middot;)\s*L[1-5])\s*<\/td>/gi,
    (_m, rawLabel: string) => {
      const normalized = rawLabel.replace(/\s*(?:·|&middot;)\s*L[1-5]/i, '').trim();
      let layerNum = '5';
      let display = normalized;

      if (/regulatory|mandatory/i.test(normalized)) {
        layerNum = '1';
        display = 'Regulatory';
      } else if (/industry/i.test(normalized)) {
        layerNum = '2';
        display = 'Industry practice';
      } else if (/community|practitioner/i.test(normalized)) {
        layerNum = '3';
        display = /practitioner/i.test(normalized) ? 'Community insight' : normalized;
      } else if (/research/i.test(normalized)) {
        layerNum = '4';
        display = 'Research & academic';
      } else if (/atlas|suggested/i.test(normalized)) {
        layerNum = '5';
        display = 'Atlas guidance';
      }

      return `<td><span class="atlas-basis atlas-basis--${layerNum}"><span class="atlas-basis__dot" aria-hidden="true"></span><span>${display}</span></span></td>`;
    },
  );
}

function addReferenceAnchors(refsHtml: string): { html: string; maxRef: number } {
  let maxRef = 0;
  const html = refsHtml.replace(/<ol\b([^>]*)>([\s\S]*?)<\/ol>/, (_m, olAttrs: string, inner: string) => {
    let idx = 0;
    const anchored = inner.replace(/<li\b([^>]*)>/g, (_liMatch, liAttrs: string) => {
      idx += 1;
      maxRef = idx;
      if (/\bid\s*=/.test(liAttrs)) {
        return `<li${liAttrs}>`;
      }
      return `<li id="ref-${idx}"${liAttrs}>`;
    });
    return `<ol${olAttrs}>${anchored}</ol>`;
  });
  return { html, maxRef };
}

function linkInlineCitations(html: string, maxRef: number): string {
  if (maxRef <= 0) return html;
  const tokenRe = /(<code\b[\s\S]*?<\/code>|<pre\b[\s\S]*?<\/pre>|<a\b[\s\S]*?<\/a>|<[^>]+>)/gi;
  return html
    .split(tokenRe)
    .map((part) => {
      if (!part || part.startsWith('<')) {
        return part;
      }
      return part.replace(/\[(\d{1,2})\]/g, (match, numStr: string) => {
        const n = Number(numStr);
        if (n >= 1 && n <= maxRef) {
          return `<a href="#ref-${n}" class="atlas-cite" aria-label="Reference ${n}">${n}</a>`;
        }
        return match;
      });
    })
    .join('');
}

function formatH2Chunk(wrapperHtml: string, bodyHtml: string): { html: string; isRefs: boolean; maxRef: number } {
  const h2Match = /<h2\b([^>]*)>([\s\S]*?)<\/h2>/.exec(wrapperHtml);
  if (!h2Match) {
    return { html: `${wrapperHtml}${bodyHtml}`, isRefs: false, maxRef: 0 };
  }

  const h2Attrs = h2Match[1];
  const rawHeadingText = h2Match[2];
  const plainTitle = rawHeadingText.replace(/<[^>]+>/g, '').trim();
  const idMatch = /\bid="([^"]+)"/.exec(h2Attrs);
  const headingId = idMatch ? idMatch[1] : '';

  const layerMatch = /^Layer\s+([1-5])\s*[—–-]\s*(.+)$/i.exec(plainTitle);
  if (layerMatch) {
    const layerNum = layerMatch[1];
    const meta = LAYER_META[layerNum] ?? LAYER_META['5'];
    const cleanTitle = layerMatch[2].trim();
    const cleanedWrapper = wrapperHtml.replace(
      /<h2\b([^>]*)>[\s\S]*?<\/h2>/,
      `<h2$1>${cleanTitle}</h2>`,
    );

    return {
      isRefs: false,
      maxRef: 0,
      html: [
        `<section class="atlas-layer-section atlas-layer-section--${layerNum}" data-atlas-layer="${layerNum}">`,
        `<div class="atlas-layer-eyebrow">`,
        `<span class="atlas-layer-code">${meta.tag}</span>`,
        `<span class="atlas-layer-role">${meta.role}</span>`,
        `</div>`,
        cleanedWrapper,
        bodyHtml,
        `</section>`,
      ].join(''),
    };
  }

  if (headingId.startsWith('references') || headingId === 'evidence-boundaries') {
    const anchored = addReferenceAnchors(bodyHtml);
    const countSuffix = anchored.maxRef > 0 ? ` (${anchored.maxRef})` : '';
    const summaryLabel =
      headingId === 'evidence-boundaries'
        ? 'Evidence boundaries & verification status'
        : `Sources, legal scope & review history${countSuffix}`;
    const anchorHeading = headingId
      ? `<h2 id="${headingId}" class="sr-only">${plainTitle}</h2>`
      : '';

    return {
      isRefs: true,
      maxRef: anchored.maxRef,
      html: [
        `<section class="atlas-refs-section">`,
        anchorHeading,
        `<details class="atlas-refs-details">`,
        `<summary class="atlas-refs-summary">${summaryLabel}</summary>`,
        `<div class="atlas-refs-body">${anchored.html}</div>`,
        `</details>`,
        `</section>`,
      ].join(''),
    };
  }

  return { html: `${wrapperHtml}${bodyHtml}`, isRefs: false, maxRef: 0 };
}

export function transformAtlasContentHtml(html: string): string {
  const withEnhancedHtml = enhanceBasisCells(wrapBareTables(html));
  const matches = [...withEnhancedHtml.matchAll(H2_WRAPPER_RE)];

  if (matches.length === 0) {
    return withEnhancedHtml;
  }

  const chunks: Array<{ html: string; isRefs: boolean }> = [
    { html: withEnhancedHtml.slice(0, matches[0].index), isRefs: false },
  ];
  let maxRef = 0;

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const start = (current.index ?? 0) + current[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : withEnhancedHtml.length;
    const bodyHtml = withEnhancedHtml.slice(start, end);
    const formatted = formatH2Chunk(current[0], bodyHtml);
    if (formatted.maxRef > maxRef) {
      maxRef = formatted.maxRef;
    }
    chunks.push({ html: formatted.html, isRefs: formatted.isRefs });
  }

  return chunks
    .map((chunk) => (chunk.isRefs ? chunk.html : linkInlineCitations(chunk.html, maxRef)))
    .join('');
}
