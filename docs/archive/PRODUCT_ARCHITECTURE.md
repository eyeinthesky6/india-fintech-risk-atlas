> **Architecture freeze notice (2026-11-21):** For current decisions, read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md). This document is retained for rationale or procedure; any regulation-only scope, alternative hosting, or flat per-product record design is superseded. Do not implement conflicting proposals.

# Product architecture — India Fintech Risk Atlas
Status: proposed for editorial approval; supersedes the earlier *flat record only* assumptions where inconsistent.

## Audience and primary tasks
Product manager: find fraud patterns and recommended checks for a product.
Risk analyst: compare indicators, data requirements, false positives and response options.
Founder/investor: understand mechanisms, operational risks and product-specific differences.
Researcher: trace each claim to an original dated source and follow related records.
Contributor: submit a well-sourced correction through GitHub PR.

## Entity types (canonical records)
- **Product**: UPI, cards, wallets, lending, etc.; user-facing entry point.
- **Pattern**: fraud/abuse/operational failure mechanism, reusable across products.
- **Control**: preventive/detective/recovery practice, reusable across patterns.
- **Requirement**: exact obligation or guidance tied to issuer, entity class and effective period; optional for relevant entries, never implied universal.
- **Source**: immutable source version/URL metadata and authority classification.
- **Claim**: one assertion with source IDs, section locators, verification state and reviewer.
- **Case study**: public incident or illustrative hypothetical, clearly labeled.
- **Glossary term**: canonical definition and aliases.
- **Relationship**: product-exposes-pattern, control-addresses-pattern, requirement-applies-to-actor, source-supports-claim, case-illustrates-pattern.

## Key modeling rule
Do not make 'UPI-001' the identity of a pattern that also affects cards. Prefer global IDs such as PAT-0001 and CTRL-0001, plus product-specific applicability records. Keep legacy UPI-001 as a redirect/alias until migrated. IDs remain stable even if titles or taxonomy change.

## Minimum fields
All: id, type, title, summary, status, created, updated, last_verified, authors, reviewers, tags, related_ids.
Product: rail, actors, lifecycle, applicable_patterns, applicable_controls, scope_exclusions.
Pattern: mechanism, signals, false_positives, harms, products, lifecycle, references.
Control: purpose, addresses_patterns, applicable_products, actor_scope, inputs, limitations, privacy_considerations, basis, references.
Requirement: issuer, instrument, provision, actor_scope, published_on, effective_from, effective_until, status, source_id.
Source: publisher, title, canonical_url, published_on, version, accessed_on, document_type, license_or_reuse_note, archived_locator_if_permitted.
Claim: claim_text_or_anchor, supporting_sources[{source_id, section, locator}], verification_status, verified_by, verified_on, applicability_note.
Case: public_or_hypothetical, date, source_ids, affected_products, pattern_ids.
Glossary: term, aliases, definition, sources.

## Reader navigation
Home > Product category > Lifecycle/risk grouping > Pattern/control article.
Global index views: All patterns | All controls | Sources | Glossary | Case studies | Methodology.
A product page lists linked canonical records with applicability notes, rather than duplicating content.

## Facets and search (prioritized)
P0: keyword search; product; record type; fraud/risk theme; lifecycle; source-backed status; clear filters; stable URLs.
P1: actor/entity type; control function (prevent/detect/respond); applicable regulator/scheme; last verified; cross-linked sources.
P2: date range, downloadable CSV/JSON index, change history, comparison view.
Avoid free-text tags for product, actor and regulatory status. Use fixed IDs with human-readable labels.

## Article UX
Title + ID + last verified + evidence badge in neutral styling.
Short summary; product/actor applicability; explanation; possible signals; suggested checks; limitations/false positives; customer impact; related records.
Inline citation numbers at the claim. Bottom 'References' section contains publisher, exact title, dated version, section and link. 'Source applicability' is visible for normative claims. 'Suggest edit' links to GitHub.
No generic disclaimer as a substitute for correct source scoping.

## Data and site separation
`data/products/`, `data/patterns/`, `data/controls/`, `data/requirements/`, `data/sources/`, `data/cases/`, `data/glossary/`, `data/claims/` are canonical Markdown/YAML files.
`site/` is a replaceable generated view. A future static generator can build indexes and links from data without changing content. Initially, hand-maintained links are acceptable for a small launch, but no duplicate prose.
`research/` contains temporary source notes and review evidence, not published as verified content.

## Volume / evolution
Start 1 product with 15–25 fully checked records and 30–80 sources as a target, not a verified inventory. Expand product by product. A pattern reused by 5 products stays one record. Static architecture targets thousands of records without needing a database. Introduce richer faceted search only after testing actual reader demand.

## Quality and governance
Draft -> source-checked -> independently-reviewed -> published -> needs-reverification -> archived.
No agent can promote its own record to independently-reviewed. Content validation checks structure, IDs, links and metadata; human/editorial verification checks truth and applicability. Source withdrawal triggers affected-claim review.


## Hosting decision — finalized 2026-11-20
**Authoritative deployment:** GitHub Pages for `eyeinthesky6/india-fintech-risk-atlas`. **Build:** Astro + Starlight + Pagefind via GitHub Actions. **Content:** GitHub Markdown/YAML and PR review. **Backend/database/domain:** none required. Expected project URL: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/` once enabled. Astro must configure `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`; use GitHub Actions Pages deployment, not Jekyll branch processing. Site output is generated; contributors do not edit templates. Cloudflare Pages and VitePress are alternatives only, not the selected deployment. This is a documentation decision, not confirmation that Pages has been enabled or deployed.
