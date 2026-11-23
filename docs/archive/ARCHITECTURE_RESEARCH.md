> **Architecture freeze notice (2026-11-21):** For current decisions, read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md). This document is retained for rationale or procedure; any regulation-only scope, alternative hosting, or flat per-product record design is superseded. Do not implement conflicting proposals.

# Architecture research — decision before implementation
Date: 2026-11-20 | Status: research recommendation, not implementation approval

## Purpose and boundaries
India-only public reference atlas of fintech fraud, controls, operational failures, scheme mechanisms, and source-backed regulatory context. Not a compliance engine, live rules service, or international database. International resources are studied for information architecture, provenance and publishing patterns only.

## Reference architectures studied
1. **Sigma specification** https://github.com/SigmaHQ/sigma-specification/blob/main/specification/sigma-rules-specification.md — stable IDs, structured YAML, status, author, references, false positives, taxonomy and scope. **Adopt:** portable metadata, references, status, false positives. **Reject:** executable detection DSL and SIEM-specific fields.
2. **MITRE ATT&CK** https://attack.mitre.org/matrices/ and https://attack.mitre.org/resources/attack-data-and-tools/ — stable technique IDs, browsable matrices, linked mitigations, versioned exports. **Adopt:** canonical identifiers, many-to-many relationships, linked records, changelog. **Reject:** giant matrix as default navigation. Note ATT&CK deprecated its old data-source objects in v18; do not freeze our taxonomy around them.
3. **OpenCTI data model** https://github.com/OpenCTI-Platform/opencti/blob/master/docs/docs/usage/data-model.md — nodes, relationships, provenance. **Adopt:** explicit entity and relationship model in simple files. **Reject:** graph database, STIX infrastructure and heavy application.
4. **Starlight documentation template** https://starlight.astro.build/ and https://starlight.astro.build/guides/site-search/ — content-first docs, default Pagefind search. **Adopt:** ready-made UI and search. **Trade-off:** facets may need small configuration/extension.
5. **Pagefind metadata** https://pagefind.app/docs/metadata/ — search metadata indexing. **Adopt:** filter-ready fields, avoid hosted search. Verify actual faceted UI capability before promising it.
6. **VitePress** https://vitepress.dev/ — simpler alternative with native local search. **Trade-off:** category filtering may need extra work. Preserve as fallback.
7. **Archer Protect Library** https://www.archerprotect.com/library/ — product inspiration for navigable rule explanations and references; do not copy prose.
8. **AUSTRAC** https://www.austrac.gov.au/ and **FINTRAC** https://fintrac-canafe.canada.ca/ — source discovery for how typologies and indicators are explained; no foreign legal rules in India content.

## Findings
The hard part is not site rendering; it is the editorial model: one pattern may apply to many products; one control can mitigate several patterns; one source can support many claims; a regulator's requirement applies to a subset of actors and dates. Flat article-per-product duplication will create contradictory records. The website should be a projection of normalized editorial entities, not the primary data model.

## Expected scale (planning assumptions, not observed counts)
14 initial product categories; 15–50 curated entries/category = 210–700 articles. Shared pattern and control entities reduce duplication. Plan for 500–2,000 content pages, 1,000–5,000 source records/claim links, and many-to-many tags. This is comfortably static-site territory, but the site must be smoke-tested with synthetic fixtures at 500, 2,000 and 5,000 pages before selecting a custom indexing solution. These are capacity scenarios, not a commitment to fill them.

## Main risks and preventative decisions
- **Taxonomy explosion:** controlled vocabularies, review new tags, no free-form variants for key facets.
- **Duplication:** canonical pattern/control IDs, product pages link to them.
- **Regulatory drift:** source version, applicable actor, effective dates, supersession and review trigger.
- **Citation rot:** persistent source register, official URLs, date verified, exact section; mark inaccessible sources.
- **False certainty:** distinguish binding requirement, official guidance, practitioner practice, hypothesis.
- **Overengineering:** no backend, database, graph service, account system, LLM runtime, admin console or custom UI initially.
- **Copyright:** original summaries, hyperlinks and attribution; inspect licenses before copying data or text.
- **Agents gaming checks:** evidence ledger and separate review, sampled manual source inspection, explicit unsupported status; a green build does not certify truth.

## Architecture decision (provisional)
**Prefer Astro Starlight + Pagefind + GitHub Markdown/YAML + Cloudflare Pages** if a 30-minute template proof confirms navigation, search, basic metadata filtering and straightforward deployment. **Fallback VitePress** if the first stack needs custom code. Neither choice changes the content model. No backend.

## Decision gates before any site build
1. Approve normalized content model and taxonomy.
2. Inspect 10 representative entries spanning UPI, cards and lending; prove cross-product reuse.
3. Verify search + filter support on the selected unmodified template.
4. Run static build on generated 500/2,000/5,000-page fixtures and measure time, bundle/index size and browser search behavior.
5. Verify source and claim review workflow.
6. Only then freeze the template choice and scaffold website.

## Explicit non-goals
International product catalog, compliance audit software, execution-ready detection thresholds, live regulatory API, custom CMS, dynamic search server, authentication, user profiles, ratings, dashboards.

## Open decisions
- Content license: CC BY 4.0 is a candidate for original prose/data; confirm third-party rights and attribution. Site code retains upstream licenses.
- Contributor credit: GitHub history plus byline; personal attribution requires contributor consent.
- Exact faceted UI: prove default plugin support or use product-specific category landing pages first.


## Hosting decision — finalized 2026-11-20
**Authoritative deployment:** GitHub Pages for `eyeinthesky6/india-fintech-risk-atlas`. **Build:** Astro + Starlight + Pagefind via GitHub Actions. **Content:** GitHub Markdown/YAML and PR review. **Backend/database/domain:** none required. Expected project URL: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/` once enabled. Astro must configure `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`; use GitHub Actions Pages deployment, not Jekyll branch processing. Site output is generated; contributors do not edit templates. Cloudflare Pages and VitePress are alternatives only, not the selected deployment. This is a documentation decision, not confirmation that Pages has been enabled or deployed.
