> **Governing freeze:** Read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md) alongside this schema. **Product priority:** Reference platform first; candidate solutions come second preference.

# Content schema and data model

## Design principles

- **Content first:** One Markdown/MDX file per canonical pattern, control, operational failure, recovery process, or policy explainer. Typed YAML frontmatter (validated by Astro/Zod in `src/content.config.ts`) is the machine-readable index; readable Markdown is the canonical article.
- **Stable IDs and URLs:** Record identifiers (`UPI-001`, etc., and v2 global `PAT-0001` / `CTRL-0001` IDs) and URL slugs never change when titles or taxonomies evolve.
- **Strict four evidence layers without duplication:** Attach assertions from the **4 frozen evidence layers** (`official`, `industry`, `practitioner`, `atlas`) to the same canonical record rather than creating separate articles per layer. Academic/research papers sit inside **Layer 4 (`atlas`)** under reference leads for candidate gap solutions—never under `industry` or `practitioner`.
- **Static build, no backend:** Product directories, verification summaries, and Pagefind filter metadata are generated at build time from frontmatter—no database, CMS server, runtime API, or custom search UI.

## Canonical content entities

| Entity | Purpose | Where stored / status in v1 |
|---|---|---|
| `Product` | Payment rail or financial product (`UPI`; v2 adds more categories) | Product directories under `src/content/docs/<product>/` |
| `Pattern` | Fraud, scam, AML, or abuse mechanism reusable across products | Canonical articles with `recordId` frontmatter |
| `Control` | Preventive, detective, or governance measure | Canonical articles with `recordId` frontmatter |
| `Gap` | Operational or telemetry breakdown enabling a failure mode | Documented per record (`docs/OPERATOR_INTELLIGENCE.md` `GAP-ID`) |
| `Requirement` | Precisely scoped statutory/regulatory/scheme rule with actor scope & dates | Layer 1 citations inside records + `PRIMARY_SOURCE_REGISTER.md` |
| `Source` | Immutable versioned source metadata & reuse rights | Linked in references, source registers, and claim ledgers |
| `Claim` / `Assertion` | Atomic factual/normative assertion paired with locator, layer, and outcome | Markdown table rows in `research/evidence/<RECORD-ID>.md` |
| `Evaluation` | Academic/empirical method, dataset, baseline, metrics, and caveats | Layer 4 research-lead notes (`OPERATOR_EVIDENCE.md` `RES-*` / v2 `EVAL-*`) |
| `Case` | Publicly documented incident or clearly marked illustrative scenario | Inline examples & case citations |
| `Glossary` | Canonical definitions and operational distinctions | `src/content/docs/upi/glossary.md` |

## Implemented v1 record frontmatter (`src/content.config.ts` & `src/taxonomy.json`)

Canonical IDs and display labels live in one shared file—**[src/taxonomy.json](../src/taxonomy.json)**—read directly by `src/content.config.ts` (Zod validation), Starlight UI components (`AtlasMarkdownContent.astro`, `UpiCatalogue.astro`), Pagefind filter chips, and `scripts/check-attestations.py`. Do **not** duplicate value lists or manual `**ID:** ...` metadata headers in Markdown articles:

```yaml
---
title: Unusual outbound payment velocity
description: UPI-001 — account-level outbound burst and rapid balance-depletion signals.
recordId: UPI-001                  # Regex enforced from src/taxonomy.json (^[A-Z]+-(?:OVERVIEW|\d{3})$)
products:
  - upi                            # Canonical IDs from src/taxonomy.json
recordType: detective-control
theme: monitoring-mules-merchants
lifecycle:
  - initiation
  - authorization
  - monitoring
actors:
  - remitter-bank
  - psp-bank
  - tpap
  - payment-aggregator
evidenceLayers:
  - official
  - atlas                          # Only 4 layers allowed: official | industry | practitioner | atlas
reviewStage: source-checked         # Must match research/attestations/<RECORD-ID>.md Stage:
blockerNote: ""                     # Optional; rendered in caution banner when draft/researching
lastSourceCheck: "2026-11-23"
---
```

Starlight overrides (`src/components/AtlasMarkdownContent.astro`) look up display labels from `src/taxonomy.json` at build time and render stage banners and Pagefind filter chips automatically.

## Controlled vocabularies

### Enforced in v1 (single source of truth: [src/taxonomy.json](../src/taxonomy.json))

- **`products`, `recordType`, `theme`, `lifecycle`, `actors`, `evidenceLayers`, `reviewStage`, and `recordIdPattern`:** See [src/taxonomy.json](../src/taxonomy.json) for the authoritative list of allowed keys and display labels.
- **Editorial scope discipline:** Keep legal/regulatory citations separated per entity class (commercial bank vs. payments bank vs. small finance bank vs. non-bank PSO vs. payment aggregator). Academic/research papers are tagged under `atlas` as research paper leads, not `industry` or `practitioner`.

### Planned for v2 roadmap (not enforced in v1 build)

- **Additional `products` categories:** `cards`, `imps-neft`, `netbanking`, `ppi-wallets`, `payment-gateway`, `merchant-acquiring`, `digital-lending`, `bnpl`, `bank-accounts`, `account-aggregator`, `cross-border`, `brokerage`, `insurance-payments`, `embedded-finance`.
- **Cross-product `actor` classes:** `bank`, `payments-bank`, `small-finance-bank`, `nonbank-pso`, `nbfc`, `lender`, `broker`, `customer`.
- **Post-launch `reviewStage` maintenance states:** `needs-reverification` (live page needing re-check after circular changes) and `archived` (retired record).
- **Global cross-product & operator IDs:** `PAT-0001`, `CTRL-0001` (with `UPI-*` preserved as redirects/aliases), plus optional `OBS-*`, `GAP-*`, `EVAL-*`.
- **`severity`:** Never assign a universal numeric risk score; describe severity only in product- and actor-specific terms.

## Evidence classification, `Source` metadata & ledger format

### Evidence classes (`basis`)
`binding` (`binding-requirement`) | `official-guidance` | `company-reported` | `practitioner-observation` (`author-observed`) | `vendor-reported` | `atlas-research-lead` *(narrow academic/empirical study cited for gap ideas)* | `atlas-hypothesis` (`atlas-interpretation`).

### Structured `Source` metadata
Used when documenting entries in `research/upi/PRIMARY_SOURCE_REGISTER.md` and `research/upi/OPERATOR_EVIDENCE.md`:

```yaml
id: SRC-EXAMPLE
layer: industry                    # official | industry | practitioner | atlas (papers go in atlas)
source_type: company-blog          # regulation | circular | technical-doc | company-blog | linkedin-post | case-study | research-paper | atlas-analysis
publisher: Example Bank
author: null                       # Required for practitioner posts
title: Example article
canonical_url: https://example.org/article
document_date: 2026-10-01
effective_date: null               # Required for binding regulatory/scheme rules
section: "Section 4.2"             # Exact section, paragraph, or page locator
applicable_actors: [Payment aggregator]
published_on: 2026-10-01
accessed_on: 2026-11-23
license: unknown
reuse_mode: link-and-original-summary
firsthand: unknown
company_endorsement: false
superseded_by: null
```

### Required `research/evidence/<RECORD-ID>.md` Markdown format
`scripts/check-attestations.py` inspects `research/evidence/<RECORD-ID>.md` using Markdown headers and pipe-table cells (not YAML). Every evidence ledger **must** use these exact headers and 7-column pipe table:

```markdown
# Evidence ledger — UPI-001

Researcher: <name or pass>
Independent reviewer: PENDING
Publication status: BLOCKED until independent reviewer verification.

| Claim ID | Layer | Claim | Source | Exact locator | Scope & effective date | Result |
|---|---|---|---|---|---|---|
| `UPI-001-C1` | Official | Concise paraphrased claim. | [Source Title](https://...) | Ch. III §53 (Oct 1, 2026) | Commercial banks (excl. PBs/SFBs) | supported (primary checked YYYY-MM-DD; independent review pending) |
| `UPI-001-C2` | Atlas (research ref) | Narrow empirical finding cited as gap idea. | [arXiv:2610.21314v1](https://...) | §4, Fig. 2 | Public NFPC benchmark (not turnkey rule) | supported (source checked YYYY-MM-DD; independent review pending) |
```

- Valid `Layer` cell labels: `Official`, `Official (mirror)`, `Industry`, `Practitioner`, `Atlas (research ref)`, `Atlas`.
- Any row containing `| PENDING |`, `| unverified |`, or `| blocked... |` in the `Result` column prevents promotion to `source-checked`, `reviewed`, or `published`.

## Canonical article section blueprint (single repository format)

All records follow this unified 8-part layout, keeping **reference facts first** and **candidate solutions second**:

1. **Risk mechanism and operational gap** *(or **At a glance** for explainers)*: How the pattern or failure works at a non-evasion level, which telemetry/UX boundary breaks, and affected roles.
2. **Layer 1 — Official regulatory and scheme context** *(when applicable)*: Scoped obligations or non-binding consultations with exact circular ID, section/clause, effective date, and excluded entities.
3. **Layer 2 — Company-reported industry practices** *(when observed)*: Attributed operator documentation or engineering posts marked `company-reported` / `vendor-reported`.
4. **Layer 3 — Practitioner observations** *(when observed)*: Dated firsthand human practitioner observations (`single-source practitioner observation` unless corroborated). *Omit when none verified; never place academic papers here.*
5. **Layer 4 — Candidate controls, data prerequisites, and research references** *(Atlas synthesis)*: Controls tailored to the operational gap, required telemetry/data access limits, and an optional `### Research paper leads (ideas for gaps, not ready-to-use rules)` subsection summarizing academic studies with sample/objective caveats.
6. **False positives, customer impact, and validation**: Legitimate lookalikes, friction/disruption risks, investigation workflow notes, and offline/shadow validation methods (without copy-paste evasion thresholds).
7. **Related records** *(where helpful)*.
8. **References and review history**: Numbered external citations (every URL must appear in `research/evidence/<RECORD-ID>.md`), access/blocker status, and `Independent reviewer` state.

Omit empty layers rather than padding; never imply that missing public operator documentation makes a control unnecessary.

## Cross-product reuse and v2 migration

- One pattern affecting multiple rails remains one canonical record with product-specific applicability notes rather than contradictory copies across rails.
- `UPI-OVERVIEW` and `UPI-001`–`UPI-016` remain stable IDs during UPI v1; migration to global `PAT-0001` / `CTRL-0001` IDs (preserving `UPI-*` aliases) waits until cross-product patterns are added and tested in v2.

## Search facets (Pagefind, zero server)

- **Implemented P0/P1 facets:** `product`, `record_type`, `stage` (`reviewStage`), `lifecycle`, `actor`, `evidence_layer` (4 layers) — emitted from frontmatter via `data-pagefind-filter` attributes in `src/components/AtlasMarkdownContent.astro`.
- **Planned v2 P2 additions:** evidence strength filter, last-verified range, downloadable static JSON/CSV catalogue generated at build time (only if reader feedback warrants).
