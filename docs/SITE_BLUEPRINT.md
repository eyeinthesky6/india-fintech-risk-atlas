# Website blueprint — reuse, don't build

## Recommended stack
- VitePress official default documentation theme: https://vitepress.dev/
- Built-in local full-text search: https://vitepress.dev/reference/default-theme-search
- Cloudflare Pages GitHub deployment: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vitepress-site/
- Markdown + YAML frontmatter for records; GitHub PRs for contributions.
- No database, login, server, CMS, custom backend, paid search or AI chat.

## Site navigation
Home | Products | Fraud patterns | Controls | Sources | Methodology | Contribute

UPI landing page: overview, payment lifecycle, categorized records, glossary, related references and coverage disclaimer.
Every record: breadcrumbs, title, product/lifecycle/type/basis/status metadata, article, inline numbered citations, full references at bottom, 'Edit on GitHub', reviewed date.

## Search and filters
Phase 1: native VitePress full-text search and category sidebar; zero custom filter code.
Phase 1.1 only if needed: a small generated index of frontmatter tags for product, lifecycle, actor, pattern and evidence status. Reuse an existing compatible VitePress component/plugin after checking maintenance and license. Avoid building a faceted search app.
Permanent links: /upi/patterns/UPI-001 (or similar), never rename IDs.

## Comparison / reuse
Existing financial-crime lists can inform taxonomy and source discovery, not be copied wholesale without licensing and provenance review. Existing detection engines are out of scope: this is a reference site, not transaction processing software.

## First release
A credible UPI overview, source register, glossary, curated source-checked records, contributor guide, working navigation/search, and a deployed static site. Make coverage gaps visible. Don't promise exhaustive coverage in 48 hours.

## Publishing
Create a VitePress scaffold from its official starter, use the default theme, connect the repo to Cloudflare Pages and a domain after content review. Preserve the original Markdown in GitHub as the portable source of truth. If the user wants no code involvement, the agent handles template setup; the user approves the domain connection and public release.
