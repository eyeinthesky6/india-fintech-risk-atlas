import { fromMarkdown } from 'mdast-util-from-markdown';

export function markdownLinks(markdown) {
  const tree = fromMarkdown(markdown);
  const definitions = new Map(tree.children
    .filter((node) => node.type === 'definition')
    .map((node) => [node.identifier, node.url]));
  const links = [];
  function walk(node) {
    const url = node.type === 'link' ? node.url : node.type === 'linkReference' ? definitions.get(node.identifier) : undefined;
    if (url) {
      const title = node.children.map((child) => child.value ?? '').join('') || url;
      links.push({ title, url });
    }
    for (const child of node.children ?? []) walk(child);
  }
  walk(tree);
  return links;
}
