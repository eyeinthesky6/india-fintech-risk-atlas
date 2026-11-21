# Architecture freeze — India Fintech Risk Atlas

**Decision date:** 2026-11-21. **Scope:** UPI v1 and subsequent category research. **Status:** freeze proposal in release branch; not a production launch certification.

## What the product is
A free India-focused fraud, AML and risk-engineering reference, not a compliance SaaS, transaction monitor or automated decision maker. A practitioner should find: risk mechanism → operational gap → control candidates → data prerequisites → false positives → validation → original evidence. Regulatory obligations are a distinct source layer, not the entire product.

## Four evidence layers (mandatory distinction)
1. **Official:** exact regulator/scheme document, section, effective period and applicable entity.
2. **Industry:** named company or vendor reports a practice, with method and limitations; no implied endorsement.
3. **Practitioner:** attributed firsthand or secondhand observation, dated and linked; not universal proof.
4. **Atlas:** our editorial synthesis or future AI-assisted hypotheses, never silently promoted to fact.

A record may contain several layers. **Do not duplicate canonical patterns per source layer.** Cross-link the same pattern/control with evidence assertions. One source can support many claims, but the article must cite precise passages.

## Canonical content entities
Product, Pattern, Gap, Control, Requirement, Source, Claim, Evaluation, Case, Glossary. Stable IDs and many-to-many links. Frontmatter is metadata; Markdown is the readable source. Legacy UPI-001… IDs remain stable aliases until a tested migration to global PAT/CTRL IDs. Do not undertake a mass renaming during UPI v1.

## Publication and presentation
GitHub repository as the content store, Astro + Starlight + Pagefind as the static rendering layer, GitHub Pages as the host, GitHub Actions as the build and validation mechanism. **No runtime backend, database, scraper, CMS, vector store or AI endpoint.** One shared article template may render thousands of generated HTML pages; contributors maintain records, not page code.

## User-facing navigation and filters
P0: UPI landing; scheme and lifecycle; fraud patterns; controls; operations; evidence policy; source index; glossary; full-text search. P1: product, record type, actor, lifecycle, evidence layer, reviewed state. Do not implement custom faceted filtering until native search/navigation is tested and insufficient. Search is not a claim of coverage completeness.

## Legal and safety
Original editorial content CC BY 4.0; original site code MIT. Third-party materials retain their own rights. Use concise original summaries and links, not mirrored bank articles, LinkedIn posts or proprietary rules. Avoid operational evasion thresholds, private customer data and unsourced production claims.

## Research and enforcement
One record or closely related section per agent work unit. Researcher collects sources and creates claim evidence; different reviewer opens originals and records decisions. Draft attestation may remain incomplete. Published status requires full evidence and distinct reviewer. CI checks structure only; human review checks truth. Never represent a successful build as evidence validation.

## Conflict resolution — supersedes earlier documents
- Earlier VitePress/Cloudflare references are historical alternatives, **not current architecture**.
- Earlier regulation-only descriptions are superseded by the four-layer risk-engineering mission.
- Earlier UPI-only per-product duplication is superseded by canonical cross-product records; migration deferred until tested.
- Earlier '17 entries complete' language means **17 draft pages exist**, not verified complete research.
- Any proposed AI layer is future research, **not** part of the frozen v1.
- A private repository cannot be assumed eligible for free GitHub Pages; check repository plan/visibility before public deployment.
- `docs/FINAL_CONTENT_ARCHITECTURE.md`, `docs/PRODUCT_ARCHITECTURE.md`, `docs/DATA_MODEL.md` remain historical design rationale where inconsistent; **this freeze record governs new work**.

## Change control
Freeze new features and schema migrations after UPI launch. Exceptions only for material factual errors, broken publishing/security, legal rights issues, or demonstrably high-value user feedback. Each exception needs a short issue explaining impact and minimum change.
