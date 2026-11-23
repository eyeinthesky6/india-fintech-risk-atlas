# Architecture freeze — India Fintech Risk Atlas

**Decision date:** 2026-11-21. **Scope:** UPI v1 and subsequent category research. **Status:** freeze proposal in release branch; not a production launch certification.

## What the product is
A free India-focused **reference platform first**—with candidate solutions to operational gaps coming second preference—for fraud, AML, and risk engineering (not a compliance SaaS, transaction monitor, or automated decision maker). A practitioner should find: risk mechanism → operational gap → verified official/industry/practitioner reference → candidate control ideas & research leads → data prerequisites → false positives → validation → original evidence. Regulatory obligations are a distinct source layer, not the entire product.

## Four evidence layers (mandatory distinction)
1. **Official:** exact regulator/scheme document, section, effective period and applicable entity.
2. **Industry:** named company or vendor reports a practice, with method and limitations; no implied endorsement.
3. **Practitioner:** attributed firsthand or secondhand human observation, dated and linked; not universal proof. (Do not classify academic papers here.)
4. **Atlas (synthesis & research references):** our editorial synthesis, candidate gap solutions, future AI-assisted hypotheses, and academic/research paper leads (`arXiv`, etc.). Academic papers sit here—not under Industry or Practitioner—because papers are typically narrow, short-objective studies useful for ideas rather than reliable ready-to-use content. Never silently promote synthesis or paper ideas to binding fact.

A record may contain several layers. **Do not duplicate canonical patterns per source layer.** Cross-link the same pattern/control with evidence assertions. One source can support many claims, but the article must cite precise passages.

## Canonical content entities
Product, Pattern, Gap, Control, Requirement, Source, Claim, Evaluation, Case, Glossary. Stable IDs and many-to-many links. Frontmatter is metadata; Markdown is the readable source. Legacy UPI-001… IDs remain stable aliases until a tested migration to global PAT/CTRL IDs. Do not undertake a mass renaming during UPI v1.

## Publication and presentation
GitHub repository as the content store, Astro + Starlight + Pagefind as the static rendering layer, GitHub Pages as the host, GitHub Actions as the build and validation mechanism. **No runtime backend, database, scraper, CMS, vector store or AI endpoint.** One shared article template may render thousands of generated HTML pages; contributors maintain records, not page code. Always link to official external PDFs rather than committing large binary documents into Git (to respect GitHub Pages size limits), and run synthetic build/search stress tests (`500 / 2,000 / 5,000` records) before considering any custom search or backend infrastructure.

## User-facing navigation and filters
P0: UPI landing; scheme and lifecycle; fraud patterns; controls; operations; evidence policy; source index; glossary; full-text search. P1: product, record type, actor, lifecycle, evidence layer, reviewed state (implemented natively via Pagefind `data-pagefind-filter` attributes without custom filter UI). Search is not a claim of coverage completeness.

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
- Superseded pre-freeze design memos and pre-consolidation drafts are preserved in `docs/archive/`; active schema, workflow, and status rules live in `docs/CONTENT_SCHEMA.md`, `docs/RESEARCH_PROTOCOL.md`, and `docs/RELEASE_STATUS.md`. **This freeze record governs new work.**

## Change control
Freeze new features and schema migrations after UPI launch. Exceptions only for material factual errors, broken publishing/security, legal rights issues, or demonstrably high-value user feedback. Each exception needs a short issue explaining impact and minimum change.
