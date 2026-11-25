import assert from 'node:assert/strict';
import test from 'node:test';
import { transformAtlasContentHtml } from '../src/lib/format-atlas-html.ts';

const references = '<div class="sl-heading-wrapper level-h2"><h2 id="references-and-review-history">References and review history</h2></div>'
  + '<ol><li><a href="https://example.org/source">Original source</a></li></ol>';

test('record articles link authored and plain citation numbers to the collapsed sources drawer', () => {
  const article = '<p>First claim <a href="#ref-1">[1]</a>. Second claim [1]. '
    + '<a href="#ref-1">Named rule</a> applies. <a href="/upi/">UPI hub</a>. <code>[1]</code></p>';
  const html = transformAtlasContentHtml(article + references, { compactCitationLinks: true });
  const [body, drawer] = html.split('<section class="atlas-refs-section">');

  assert.equal((body.match(/<a href="#ref-1" class="atlas-cite" aria-label="Reference 1">1<\/a>/g) || []).length, 2);
  assert.match(body, /<a href="#ref-1">Named rule<\/a> applies/);
  assert.match(body, /<a href="\/upi\/">UPI hub<\/a>/);
  assert.match(body, /<code>\[1\]<\/code>/);
  assert.match(drawer, /<details class="atlas-refs-details">/);
  assert.match(drawer, /id="references-and-review-history"/);
  assert.match(drawer, /<li id="ref-1"><a href="https:\/\/example.org\/source">Original source/);
});

test('an authored reference target is kept once', () => {
  const authored = references.replace('<li>', '<li><a id="ref-1"></a>');
  const html = transformAtlasContentHtml('<p>Source [1].</p>' + authored, { compactCitationLinks: true });
  assert.equal((html.match(/id="ref-1"/g) || []).length, 1);
});

test('guide citation links keep their existing behavior', () => {
  const html = transformAtlasContentHtml('<p>See the source [1].</p>' + references);
  assert.match(html, /<a href="#ref-1" class="atlas-cite" aria-label="Reference 1">1<\/a>/);
});
