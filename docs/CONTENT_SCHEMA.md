> **Governing freeze:** Read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md) alongside this schema. **Product priority:** Reference platform first; candidate solutions come second preference.

# Content schema and data model

## Design principles

- **Content first:** One Markdown/MDX file per canonical pattern, control, operational failure, recovery process, or policy explainer. Typed YAML frontmatter (validated by Astro/Zod in `src/content.config.ts`) is the machine-readable index; readable Markdown is the canonical article.
- **Stable IDs and URLs:** Record identifiers (`UPI-001`, etc., and v2 global `PAT-0001` / `CTRL-0001` IDs) and URL slugs never change when titles or taxonomies evolve.
- **Strict five evidence layers without duplication:** Attach assertions from the **5 frozen evidence layers** (`official`, `industry`, `practitioner`, `research`, `atlas`) to the same canonical record rather than creating separate articles per layer. Academic/research papers sit in their own **`research`** (`Research & academic`) layer—separate from `industry`, `practitioner`, and `atlas`.
- **Static build, no backend:** Product directories, verification summaries, and Pagefind filter metadata are generated at build time from frontmatter—no database, CMS server, runtime API, or custom search UI.

## Canonical content entities

| Entity | Purpose | Where stored / status in v1 |
|---|---|---|
| `Product` | Payment rail or financial product (`UPI`; v2 adds more categories) | Product directories under `src/content/docs/<product>/` |
| `Pattern` | Fraud, scam, AML, or abuse mechanism reusable across products | Canonical articles with `recordId` frontmatter |
| `Control` | Preventive, detective, or governance measure | Canonical articles with `recordId` frontmatter |
| `Gap` | Operational or telemetry breakdown enabling a failure mode | Documented per record (`docs/OPERATOR_INTELLIGENCE.md` `GAP-ID`) |
| `Requirement` | Precisely scoped statutory/regulatory/scheme rule with actor scope & dates | `Regulatory` (`official`) citations inside records + `PRIMARY_SOURCE_REGISTER.md` |
| `Source` | Immutable versioned source metadata & reuse rights | Linked in references, source registers, and claim ledgers |
| `Claim` / `Assertion` | Atomic factual/normative assertion paired with locator, layer, and outcome | Markdown table rows in `research/evidence/<RECORD-ID>.md` |
| `Evaluation` | Academic/empirical method, dataset, baseline, metrics, and caveats | `Research & academic` (`research`) lead notes (`OPERATOR_EVIDENCE.md` `RES-*` / v2 `EVAL-*`) |
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
  - atlas                          # Only 5 keys allowed: official | industry | practitioner | research | atlas
reviewStage: source-checked         # Must match research/attestations/<RECORD-ID>.md Stage:
blockerNote: ""                     # Optional; rendered in caution banner when draft/researching
lastSourceCheck: "2026-11-23"
---
```

Starlight overrides (`src/components/AtlasMarkdownContent.astro`) look up display labels from `src/taxonomy.json` at build time and render stage banners and Pagefind filter chips automatically.

## Controlled vocabularies

### Enforced in v1 (single source of truth: [src/taxonomy.json](../src/taxonomy.json))

- **`products`, `recordType`, `theme`, `lifecycle`, `actors`, `evidenceLayers`, `reviewStage`, and `recordIdPattern`:** See [src/taxonomy.json](../src/taxonomy.json) for the authoritative list of allowed keys and display labels.
- **Control owners:** Keep the readable owner label in the article. [The owner-role registry](../src/control-owner-roles.json) maps that exact label to eligible actor IDs for the MCP controls and checklist. Broad categories retain their own IDs. Generic owner labels are available in all-role results with no inferred license scope.
- **Control and evidence IDs:** Machine exports assign a control ID from the record and normalized row contents. Filters preserve that ID. Evidence claims keep their separate ledger IDs. Link individual candidate rows to their numbered sources where possible.
- **Editorial scope discipline:** Keep legal/regulatory citations separated per entity class (commercial bank vs. payments bank vs. small finance bank vs. non-bank PSO vs. payment aggregator). Academic/research papers are tagged under `research` as Research & academic leads, not `industry`, `practitioner`, or `atlas`.

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
| `UPI-001-C2` | Research & academic | Narrow empirical finding cited as gap idea. | [arXiv:2610.21314v1](https://...) | §4, Fig. 2 | Public NFPC benchmark (not turnkey rule) | supported (source checked YYYY-MM-DD; independent review pending) |
```

- Valid `Layer` cell labels: `Regulatory` / `Official`, `Official (mirror)`, `Industry practice` / `Industry`, `Community insight` / `Practitioner`, `Research & academic` / `Atlas (research ref)`, `Atlas guidance` / `Atlas`.
- Any row containing `| PENDING |`, `| unverified |`, or `| blocked... |` in the `Result` column prevents promotion to `source-checked`, `reviewed`, or `published`.

## Canonical Ready-Reckoner article section blueprint (single repository format)

All records follow this unified **Ready-Reckoner** layout, keeping plain-English scanning first, colour-keyed **Basis** controls second, and merged reference proof collapsed at the bottom:

1. **What it is** *(or **What it solves** / **What it covers**)*: Plain-English explanation of the fraud pattern, control, failure, or overview, affected roles, and which telemetry/UX boundary breaks—followed where helpful by a concise **Impact** subsection.
2. **Common patterns** *(or **When it applies**)*: Bulleted real-world variants, operational triggers, or scenario paths in plain language without vague prose paragraphs.
3. **What to do** *(3-column `Basis | Owner | Action` checklist)*: Each actionable row is tagged by its exact evidence basis (`Regulatory`, `Industry practice`, `Community insight`, `Research & academic`, or `Atlas guidance`), the responsible `Owner` (`Remitter bank`, `PSP bank`, `TPAP`, `PA`, `Customer`), and the concrete `Action` with citation anchors (`<a href="#ref-N">[N]</a>`). Optional subheadings (such as `### Data prerequisites` or `### Research paper leads`) stay inside this plain-English operational flow.
4. **Watch-outs and validation**: Legitimate lookalikes, false-positive friction risks, legal/scope boundaries, and shadow/replay validation methods (without copy-paste evasion thresholds).
5. **Related records** *(where helpful)*.
6. **Sources, legal scope & review history** *(bottom collapsed `<details>` drawer built under `## References and review history`)*: Entity-class scope caveats, `Independent reviewer` state, `Researcher`, `Last source check`, and numbered external citations `[1]..[N]` (`id="ref-N"`) verified against `research/evidence/<RECORD-ID>.md`. The page component (`AtlasMarkdownContent.astro`) renders the Record Dossier (`5 evidence layers`) and best-effort legal disclaimer with **Report a factual error** link below the main content.

Keep claim-to-source links in the Markdown and evidence ledger. The website hides numbered citation markers in the article body and displays their sources in the collapsed drawer. The article outline still links to the drawer.

Use only real citations from the page's verified sources; never fabricate company practices or academic claims to fill rows.

## Cross-product reuse and v2 migration

- One pattern affecting multiple rails remains one canonical record with product-specific applicability notes rather than contradictory copies across rails.
- `UPI-OVERVIEW` and `UPI-001`–`UPI-016` remain stable IDs during UPI v1; migration to global `PAT-0001` / `CTRL-0001` IDs (preserving `UPI-*` aliases) waits until cross-product patterns are added and tested in v2.

## Search facets (Pagefind, zero server)

- **Implemented P0/P1 facets:** `product`, `record_type`, `stage` (`reviewStage`), `lifecycle`, `actor`, `evidence_layer` (5 layers) — emitted from frontmatter via `data-pagefind-filter` attributes in `src/components/AtlasMarkdownContent.astro`.
- **Planned v2 P2 additions:** actor persona-based matrix filtering (`TPAP`, `Bank`, `PA`), interactive/exportable readiness & self-audit gap checklists, evidence strength filter, last-verified range, static `llms.txt` + build-time JSON/CSV catalogue, and a post-launch **read-only MCP server** exposing canonical records, evidence ledgers, entity scopes, and `reviewStage` metadata to external AI agents once live.
