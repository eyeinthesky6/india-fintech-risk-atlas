> **Governing freeze:** Read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md) alongside this schema. This document merges the repository's data model, four-layer content extension, and canonical entity taxonomy.

# Content schema and data model

## Design principles

- **Content first:** One Markdown/MDX file per canonical pattern, control, operational failure, recovery process, or policy explainer. Typed YAML frontmatter (validated by Astro/Zod in `src/content.config.ts`) is the machine-readable index; readable Markdown is the canonical article.
- **Stable IDs and URLs:** Record identifiers (`UPI-001`, etc., and future cross-product `PAT-0001` / `CTRL-0001` IDs) and URL slugs never change when titles or taxonomies evolve.
- **No per-layer duplication:** Attach typed evidence assertions from all four evidence layers (`official`, `industry`, `practitioner`, `atlas`, plus `research`) to the same canonical record rather than creating separate articles per source layer.
- **Static build, no backend:** Product directories, verification summaries, and Pagefind filter metadata are generated at build time from frontmatter—no database, CMS server, runtime API, or custom search UI.

## Canonical content entities

| Entity | Purpose | Where stored / status in v1 |
|---|---|---|
| `Product` | Payment rail or financial product (`UPI`, future cards, lending, etc.) | Product directories under `src/content/docs/<product>/` |
| `Pattern` | Fraud, scam, AML, or abuse mechanism reusable across products | Canonical articles with `recordId` frontmatter |
| `Control` | Preventive, detective, or governance measure | Canonical articles with `recordId` frontmatter |
| `Gap` | Operational or telemetry breakdown enabling a failure mode | Documented per record (`docs/OPERATOR_INTELLIGENCE.md` `GAP-ID`) |
| `Requirement` | Precisely scoped statutory/regulatory/scheme rule with actor scope & dates | Layer 1 citations inside records + `PRIMARY_SOURCE_REGISTER.md` |
| `Source` | Immutable versioned source metadata & reuse rights | Linked in references, source registers, and claim ledgers |
| `Claim` / `Assertion` | Atomic factual/normative assertion paired with locator, layer, and outcome | `research/evidence/<RECORD-ID>.md` |
| `Evaluation` | Empirical method, dataset, baseline, metrics, and limitations | Referenced in Layer 3 / Validation sections (`EVAL-ID`) |
| `Case` | Publicly documented incident or clearly marked illustrative scenario | Inline examples & case citations |
| `Glossary` | Canonical definitions and operational distinctions | `src/content/docs/upi/glossary.md` |

## Implemented v1 record frontmatter (`src/content.config.ts`)

Every canonical article under `src/content/docs/<product>/` defines typed YAML frontmatter enforced at build time by `docsSchema` (`astro/zod`) and cross-checked against `research/attestations/<RECORD-ID>.md` by `scripts/check-attestations.py`:

```yaml
---
title: Unusual outbound payment velocity
description: UPI-001 — account-level outbound burst and rapid balance-depletion signals.
recordId: UPI-001                  # Regex: ^[A-Z]+-(?:OVERVIEW|\d{3})$
products:
  - UPI
recordType: detective-control
recordTypeLabel: Detective signal
theme: monitoring-mules-merchants
themeLabel: Monitoring, mules & merchants
lifecycle:
  - initiation
  - authorization
  - monitoring
actors:
  - Remitter bank
  - PSP bank
  - TPAP
  - Payment aggregator
evidenceLayers:
  - official
  - industry
  - research
  - atlas
reviewStage: source-checked         # Must match research/attestations/<RECORD-ID>.md Stage:
blockerNote: ""                     # Optional; rendered in caution banner when draft/researching
lastSourceCheck: "2026-11-23"
---
```

Starlight overrides (`src/components/AtlasMarkdownContent.astro`) render stage banners and Pagefind filter chips directly from this frontmatter—do **not** duplicate manual `**ID:** ...` metadata headers or hand-counted status tables inside pages.

## Controlled vocabularies

Avoid free-text variants for core classification fields:

- **`product` (planned India roadmap; v1 implements `UPI`):** `upi`, `cards`, `imps-neft`, `netbanking`, `ppi-wallets`, `payment-gateway`, `merchant-acquiring`, `digital-lending`, `bnpl`, `bank-accounts`, `account-aggregator`, `cross-border`, `brokerage`, `insurance-payments`, `embedded-finance`.
- **`recordType` (v1 schema enums):** `explainer`, `fraud-pattern`, `preventive-control`, `detective-control`, `operational-failure`, `recovery-process`, `policy-consultation`.
- **`lifecycle`:** `onboarding`, `initiation`, `authentication`, `authorization`, `processing`, `monitoring`, `settlement`, `reconciliation`, `investigation`, `dispute`, `recovery`, `servicing`.
- **`actor` (normative scope discipline):** `bank` (`commercial-bank`), `payments-bank`, `small-finance-bank`, `tpap`, `psp-bank`, `nonbank-pso`, `payment-aggregator`, `merchant`, `nbfc`, `lender`, `broker`, `customer`, `npci`. *Never silently copy regulatory applicability across distinct actor classes.*
- **`evidenceLayers`:** `official`, `industry`, `research`, `practitioner`, `atlas`.
- **`basis` / `evidence_class`:** `binding` (`binding-requirement`), `official-guidance`, `company-reported`, `practitioner-observation`, `vendor-reported`, `independently-evaluated`, `atlas-hypothesis` (`illustrative-hypothesis`).
- **`reviewStage` / lifecycle states:** `draft` → `researching` → `source-checked` → `reviewed` (`independently-reviewed`) → `published` → `needs-reverification` → `archived`.
- **`severity`:** Avoid universal numerical risk scores; describe severity only in product- and actor-specific operational terms.

## Four-layer `Source` and `Assertion` schemas

When documenting sources and claim-by-claim evidence ledgers (`research/evidence/<RECORD-ID>.md` and `research/upi/*`), record structured provenance covering both regulatory metadata and rights/attribution posture:

```yaml
# Source record metadata
id: SRC-EXAMPLE
layer: industry                    # official | industry | research | practitioner | atlas
source_type: company-blog          # regulation | circular | technical-doc | company-blog | linkedin-post | paper | case-study | atlas-analysis
publisher: Example Bank
author: null                       # Required for practitioner posts
title: Example article
canonical_url: https://example.org/article
document_date: 2026-10-01
effective_date: null               # Required for binding regulatory/scheme rules
section: "Section 4.2"             # Exact section, paragraph, or page locator
applicable_actors: [payment-aggregator]
published_on: 2026-10-01
accessed_on: 2026-11-23
license: unknown
reuse_mode: link-and-original-summary
firsthand: unknown
company_endorsement: false
superseded_by: null
```

```yaml
# Claim / Assertion evidence entry (stored in research/evidence/<RECORD-ID>.md)
id: CLM-EXAMPLE
record_id: UPI-001
layer: industry
statement: A named operator publicly describes this approach and its constraints.
source_ids: [SRC-EXAMPLE]
locators: ["Section: Webhook signature verification"]
evidence_class: company-reported   # binding | official-guidance | company-reported | practitioner-observation | vendor-reported | independently-evaluated | atlas-hypothesis
actor_scope: [payment-aggregator, merchant]
verification_result: supported     # supported | partially-supported | unsupported | conflicting | blocked | atlas-interpretation
verified_by: null                  # Separate reviewer identity when reviewed
verified_on: null
status: source-checked
```

## Canonical article section blueprint

Combine consistent engineering usability with strict evidence separation:

1. **Risk mechanism and operational gap** (or **At a glance** for explainers): How the failure or scam works at a non-evasion level, which telemetry/UX boundary breaks, and applicable actors/lifecycle stages.
2. **Layer 1 — Official regulatory and scheme context** *(when applicable)*: Scoped obligations or non-binding consultations with exact circular ID, section/clause, effective date, and excluded entities.
3. **Layer 2 — Company-reported industry practices** *(when observed)*: Attributed operator documentation or engineering posts marked `company-reported` / `vendor-reported`.
4. **Layer 3 — Practitioner observations & open-access research** *(when observed)*: Dated firsthand practitioner observations (`single-source practitioner observation` unless corroborated) and empirical papers with dataset/sample limits.
5. **Layer 4 — Candidate controls and data prerequisites** *(Atlas synthesis)*: Preventive, detective, and recovery controls, required inputs, data-access limits across PSP/TPAP/bank boundaries, and operational trade-offs.
6. **False positives, customer impact, and validation**: Legitimate lookalikes, friction/disruption risks, and offline/shadow/metric validation methods (avoiding hardcoded evasion thresholds).
7. **Related records** *(where helpful)*.
8. **References and review history**: Numbered external citations matching entries recorded in `research/evidence/<RECORD-ID>.md`, access/blocker status, and `Independent reviewer` state.

Omit empty evidentiary layers rather than padding with speculation; never imply that the absence of public operator documentation means a control is unnecessary.

## Cross-product reuse and v2 migration

- One pattern affecting multiple rails (e.g., ATO, velocity bursts, mule funnels) should remain one canonical record with product-specific applicability notes rather than contradictory copies across rails.
- Per `ARCHITECTURE_FREEZE.md`, `UPI-OVERVIEW` and `UPI-001`–`UPI-016` remain stable IDs during UPI v1; migration to global cross-product IDs (`PAT-0001`, `CTRL-0001`, with `UPI-*` preserved as redirects/aliases) is deferred until tested post-v1.

## Search facets (Pagefind, zero server)

- **Implemented P0/P1 facets:** `product`, `record_type`, `stage` (`reviewStage`), `lifecycle`, `actor`, `evidence_layer` — emitted from frontmatter via `data-pagefind-filter` attributes inside `<AtlasMarkdownContent>`.
- **Planned P2 additions:** evidence strength filter, last-verified range, downloadable static JSON/CSV catalogue generated at build time (only if reader feedback justifies them).
