# Architecture freeze — India Fintech Risk Atlas

**Decision date:** 2026-11-21. **Scope:** UPI v1 and subsequent category research. **Status:** freeze proposal in release branch; not a production launch certification.

## What the product is
A free India-focused **reference platform first**—with candidate solutions to operational gaps coming second preference—for fraud, AML, and risk engineering (not a compliance SaaS, transaction monitor, legal advisor, or automated decision maker). A reader should find: plain-English mechanism → impact → common patterns → layered `Basis | Owner | Action` checklist → watch-outs & validation → collapsed sources, legal scope & review history. Regulatory obligations are one distinct source layer, not the entire product.

## Five evidence layers (mandatory distinction)
1. **Regulatory (`official`):** exact regulator/scheme document, section, effective period and applicable entity.
2. **Industry practice (`industry`):** named company or vendor reports a practice, with method and limitations; no implied endorsement.
3. **Community insight (`practitioner`):** attributed firsthand or secondhand human observation, dated and linked; not universal proof. (Do not classify academic papers here.)
4. **Research & academic (`research`):** published empirical or academic paper leads (`arXiv`, workshops, benchmarks) kept separate from Industry practice, Community insight, and Atlas guidance—useful for exploring gaps, with explicit dataset/sample/jurisdiction caveats rather than turnkey rules.
5. **Atlas guidance (`atlas`):** editorial synthesis, operational gap framing, candidate controls, telemetry prerequisites, and validation guidance. Never silently promote synthesis, hypotheses, or paper ideas to binding fact.

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
- Earlier regulation-only or four-layer descriptions are superseded by the five-layer Ready-Reckoner risk-engineering mission.
- Earlier UPI-only per-product duplication is superseded by canonical cross-product records; migration deferred until tested.
- Earlier '17 entries complete' language means **17 draft pages exist**, not verified complete research.
- Any proposed AI layer is future research, **not** part of the frozen v1.
- **Post-launch meaningful-usage features (v2, once live):** After the static site deploys to GitHub Pages:
  1. Add **role-based persona filtering** to dynamically slice Ready-Reckoner `What to do` matrices by operator license (`TPAP`, `PSP Bank`, `Remitter Bank`, `Payment Aggregator`).
  2. Provide downloadable and client-side **readiness & self-audit gap checklists** for fintech teams pre-auditing against RBI/NPCI rules.
  3. Publish static machine-readable exports (`llms.txt` and build-time JSON catalogue) plus an official **read-only Model Context Protocol (MCP) server** backed by those static artifacts (zero runtime database) so external AI agents (ChatGPT, Claude, Codex, Antigravity, IDE assistants) can query verified records, exact citations, entity scopes, and `reviewStage` trust status cleanly.
  4. Develop the **public data intelligence layer** ([docs/PUBLIC_DATA_INTELLIGENCE_ROADMAP.md](PUBLIC_DATA_INTELLIGENCE_ROADMAP.md)) curating open NPCI decline metrics, parliamentary fraud statistics, and an interactive customer liability calculator.
- A private repository cannot be assumed eligible for free GitHub Pages; check repository plan/visibility before public deployment.
- Superseded pre-freeze design memos and pre-consolidation drafts are preserved in `docs/archive/`; active schema, workflow, and status rules live in `docs/CONTENT_SCHEMA.md`, `docs/RESEARCH_PROTOCOL.md`, and `docs/RELEASE_STATUS.md`. **This freeze record governs new work.**

## Change control
Freeze new features and schema migrations after UPI launch. Exceptions only for material factual errors, broken publishing/security, legal rights issues, or demonstrably high-value user feedback. Each exception needs a short issue explaining impact and minimum change.
