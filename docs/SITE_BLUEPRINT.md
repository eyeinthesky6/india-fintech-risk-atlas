> **Architecture freeze notice (2026-11-21):** For current decisions, read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md). This document is retained for rationale or procedure; any regulation-only scope, alternative hosting, or flat per-product record design is superseded. Do not implement conflicting proposals.

# Website blueprint — FINAL: GitHub Pages

## Selected stack
- Astro: https://astro.build/ — static generator and content collections
- Starlight: https://starlight.astro.build/ — documentation UI, navigation, accessible layout
- Pagefind: https://pagefind.app/ — generated local search index; confirm desired facets before customization
- GitHub Pages: https://docs.github.com/en/pages — free public project website
- GitHub Actions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages — build and deploy generated output
- Content and contributions: Markdown/YAML in GitHub; pull requests and review.

## Deployment configuration
For repository `eyeinthesky6/india-fintech-risk-atlas`, expected URL is `https://eyeinthesky6.github.io/india-fintech-risk-atlas/`.
Astro configuration must set `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`. Use a standard GitHub Actions Pages workflow with checkout, Node install, dependency install, Astro build, `actions/upload-pages-artifact`, and `actions/deploy-pages`; grant pages:write and id-token:write. Set repository Settings > Pages > Build and deployment source to GitHub Actions. Test all asset and search URLs under the project subpath. No custom domain is required.

## Page templates and navigation
Home; product directory; product landing; reusable record detail; source bibliography; glossary; methodology; contribute. Product and record indexes derive from canonical data IDs. Avoid duplicating article prose across products. Keep URLs stable.

## Search and filters
P0: full-text search, product, record type, lifecycle, risk theme, evidence status. Use Pagefind's metadata/filter facilities only if compatible with the selected Starlight integration without substantial custom UI; otherwise launch with native search plus category navigation. P1: actor, regulator, updated date. Do not introduce a search server.

## Content workflow
Contributors edit only `data/` and permitted research records. Agents draft PRs; separate source reviewer checks applicability, links and evidence. Owner approves merge. Site automatically rebuilds and redeploys after merge. No CMS, database, API, login or runtime agent.

## Performance and limits
GitHub Pages has published-site and bandwidth soft limits; monitor actual site output and traffic. Link to original PDFs rather than committing copies. Test synthetic 500, 2,000 and 5,000 records for build duration, search index size and browser performance. Generated pages do not require hand maintenance.

## Gate before implementation
Reconcile legacy sample `content/upi/UPI-001.md` with normalized entity IDs; verify Starlight search/filter behavior and GitHub Pages subpath deployment with a minimal proof. Then publish reviewed UPI content. No site has yet been deployed.
