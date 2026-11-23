> **Architecture freeze notice (2026-11-21):** For current decisions, read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md). This document is retained for rationale or procedure; any regulation-only scope, alternative hosting, or flat per-product record design is superseded. Do not implement conflicting proposals.

# Final content architecture — decision record
Date: 2026-11-20
Status: finalized hosting and content architecture; website implementation not yet authorized

## Executive decision
Use **GitHub as the content source of truth**, **Astro content collections** as the structured content layer, **Astro Starlight** as the initial site shell, **Pagefind** for search, and **GitHub Pages** for static deployment. Do not add a live database, API, custom CMS, SSR backend or authentication. Contributors change records and evidence via PRs; site templates remain owner-controlled.

**Important distinction:** 2,000 content records do not imply 2,000 handwritten pages. A single template renders every record; static output may still contain one generated HTML page per record for indexing, accessibility and direct linking. This is inexpensive and simple to maintain. Runtime data fetching is optional, not a requirement.

## Research findings and sources
- Astro content collections support typed Markdown, JSON, YAML and remote sources, and thousands of entries; build-time and live-loading modes are available: https://docs.astro.build/en/guides/content-collections/
- Astro supports one dynamic route template for many records, either prerendered or on demand: https://docs.astro.build/en/guides/routing/
- Decap CMS is Git-backed, models collections and entries, and offers an optional editorial workflow using pull requests: https://decapcms.org/docs/architecture/ and https://decapcms.org/docs/editorial-workflows/
- Starlight provides documentation layouts and search: https://starlight.astro.build/ and https://starlight.astro.build/guides/site-search/
- Pagefind provides index metadata and filter support; test UI integration before promising facets: https://pagefind.app/docs/metadata/
- Sigma rules provide a useful portable precedent for stable identifiers, source links, status and false-positive descriptions: https://github.com/SigmaHQ/sigma-specification
- MITRE ATT&CK demonstrates reusable linked techniques and mitigations: https://attack.mitre.org/
These are architectural precedents, not data sources for Indian regulatory obligations.

## What is maintained versus generated
Human/agent maintained: structured records, sources, claims, editorial review and taxonomy.
Maintained once by site owner: site theme, page templates, filter definitions, navigation configuration, build pipeline.
Generated automatically: product listings, article pages, search index, related links, sitemaps.
No contributor is permitted to change the site shell as part of a content PR without owner approval.

## Canonical entities
Product, Pattern, Control, Requirement, Source, Claim/Evidence, Case, Glossary. Relationships are IDs, not duplicated paragraphs. An entity may relate to several products. Product applicability notes can be maintained separately when context differs.
Sources are versioned; requirements include entity scope, effective date and status. Claim-level evidence is mandatory for normative assertions.

## Suggested file organization
data/products/*.md
data/patterns/*.md
data/controls/*.md
data/requirements/*.md
data/sources/*.yaml
data/cases/*.md
data/glossary/*.md
research/evidence/*.md
site/ (reusable templates and configuration, owner-controlled)
docs/ (research, architecture, editorial rules)
Existing content/upi/UPI-001.md is a draft and should be migrated into canonical pattern/control records, preserving its ID as an alias where necessary. Do not copy the draft into multiple categories.

## Reader features
P0: product directory, record listing, keyword search, product filter, record type, lifecycle, fraud theme, record detail, inline claim citations, full source references, related records, clear last-verified status, report-correction link.
P1: actor/entity filter, source/regulator filter, control function, recently updated, downloadable CSV/JSON index.
Not now: personalized dashboards, saved searches, runtime AI, accounts, analytics engine, compliance scoring, complex graph visualization.

## Templates (not one per record)
1. Homepage and search
2. Product landing page
3. Generic record detail (pattern/control/requirement/case variants)
4. Source detail / bibliography
5. Glossary and methodology
6. Contribute / editorial policy
Product/category/search results are generated from metadata; source and article templates are shared.

## Citation UX
Every material assertion has a linked citation marker, pointing to a References section on the same record. References contain publisher, title, exact section, publication/effective dates, canonical URL and last checked. Source details link to all related claims/records. Clearly distinguish binding obligations from industry practice and hypotheses.

## Publishing and SEO
Generate permanent, crawlable URLs for each public record using stable IDs. Pre-render records at build time; avoid one client-side-only URL that swaps JSON without meaningful server-delivered content. A thousand generated HTML outputs are not a thousand maintenance tasks. If build time becomes a real bottleneck, Astro can render routes on demand without replacing the content model.

## Scale assumptions and performance gates
Initial: one UPI category, ~15–25 source-checked records (target only).
Medium: ~250–700 records across products.
Stress test: 2,000 and 5,000 synthetic records; measure build time, search index size, filter responsiveness, broken links and deployment limits.
Do not add database merely because records exceed 1,000.

## Data governance
Agents propose content PRs only. A different reviewer independently checks source passages, dates, applicability and cross-product reuse. Automated validation catches malformed IDs, duplicate IDs, broken relations and missing fields; it cannot establish truth. Human merge approval remains required. Decap CMS is an optional later editor, not needed for the first release.

## Technology decision gate
Before scaffolding, test whether stock Starlight + Pagefind offers usable product/type/lifecycle facets without substantial custom UI. If not, accept native search + category indexes for v1 or select a maintained existing directory template. Avoid building a custom filter application. Keep Astro collections so a later theme change is inexpensive.

## Explicit rejection
No Supabase/Postgres, headless CMS server, dynamic REST API, custom React SPA, on-demand regulatory scraping on every page view, login, role management or agent runtime in the published site.

## Next implementation sequence (requires separate approval)
1. Reconcile earlier DATA_MODEL.md and PRODUCT_ARCHITECTURE.md with this decision.
2. Produce 8–10 representative records and verify links/cross-product reuse.
3. Test unmodified Starlight and Pagefind search/filter UX.
4. Run synthetic scale smoke test.
5. Only then scaffold the production site and publish the first reviewed UPI cohort.


## Hosting decision — finalized 2026-11-20
**Authoritative deployment:** GitHub Pages for `eyeinthesky6/india-fintech-risk-atlas`. **Build:** Astro + Starlight + Pagefind via GitHub Actions. **Content:** GitHub Markdown/YAML and PR review. **Backend/database/domain:** none required. Expected project URL: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/` once enabled. Astro must configure `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`; use GitHub Actions Pages deployment, not Jekyll branch processing. Site output is generated; contributors do not edit templates. Cloudflare Pages and VitePress are alternatives only, not the selected deployment. This is a documentation decision, not confirmation that Pages has been enabled or deployed.
