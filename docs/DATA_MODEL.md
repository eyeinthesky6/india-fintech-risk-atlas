> **Active Reference Specification:** Living entity reference and controlled vocabularies guide aligned with [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) and [src/taxonomy.json](../src/taxonomy.json).

# Data model v1 — content first

## Design principles
One Markdown file per risk pattern or control. YAML frontmatter is the machine-readable index; readable Markdown is the canonical article. Stable IDs and URLs never change when titles change. No database, API or backend. Optional filter index can be generated from frontmatter during the static-site build.

## Controlled vocabularies (Enforced via `src/taxonomy.json` & Zod)
- **`products`:** `upi` (v1; multi-rail products like `cards`, `netbanking`, `imps-neft`, `lending` staged for v2)
- **`recordTypes`:** `explainer`, `fraud-pattern`, `preventive-control`, `detective-control`, `operational-failure`, `recovery-process`, `policy-consultation`
- **`themes`:** `overview`, `social-engineering`, `identity-auth`, `monitoring-mules-merchants`, `reconciliation-disputes-protection`, `policy`
- **`lifecycle`:** `onboarding`, `initiation`, `authentication`, `authorization`, `processing`, `monitoring`, `settlement`, `reconciliation`, `investigation`, `dispute`, `recovery`, `servicing`
- **`actors`:** `payer`, `merchant`, `tpap`, `psp-bank`, `remitter-bank`, `beneficiary-bank`, `payment-aggregator`, `npci`
- **`evidenceLayers`:** `official` (Regulatory), `industry` (Industry practice), `practitioner` (Community insight), `research` (Research & academic), `atlas` (Atlas guidance)
- **`reviewStages`:** `draft`, `researching`, `source-checked`, `reviewed`, `published`

## Frontmatter example (Astro Content Collections Schema)
```yaml
---
title: Unusual outbound payment velocity
description: UPI-001 — burst transfer velocity and rapid account draining.
recordId: UPI-001
products:
  - upi
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
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
blockerNote: "" # Optional; rendered in caution banner when draft/researching
lastSourceCheck: "2026-11-23"
---
```

## Article body (Ready-Reckoner 6-Part Layout)
1. `## What it is` (Plain-English mechanism, affected actors, and telemetry breakdown)
2. `## Impact` (Customer, Bank/PSP, and ecosystem consequences)
3. `## Common patterns` (Real-world scenario variants and operational triggers)
4. `## What to do` (3-column table: `Basis` | `Owner` | `Action` with `<a href="#ref-N">[N]</a>` citation anchors)
5. `## Watch-outs and validation` (Legitimate lookalikes, false positives, signals needed, and staging test methods)
6. `## References and review history` (Numbered citations with dates, entity-scope caveats, and reviewer status)

## Source record (`research/upi/PRIMARY_SOURCE_REGISTER.md`)
```yaml
id: RBI-2026-NBPSO
publisher: Reserve Bank of India
title: Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs
url: https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0
document_date: 2026-11-05
effective_date: 2026-11-05 (Large/Medium), 2028-04-01 (Small)
section: §§3, 22(d), 27(c)-(d), 28, 30, 31(c),(g)
source_class: primary
applicable_actors: [nonbank-pso]
last_checked: 2026-11-23
superseded_by: null
```

## Claim evidence (Double-Ledger Architecture)
For each nontrivial assertion, record claim_id, exact article location, source_id, section/paragraph, supporting paraphrase, entity applicability, and verification result (supported / unsupported). Stored in paired `research/evidence/<RECORD-ID>.md` and declared in `research/attestations/<RECORD-ID>.md`. Parity is enforced on every commit by `scripts/check-attestations.py`.

## Cross-product reuse
A fraud pattern may have multiple products. Keep one canonical record when mechanics are identical, with product-specific applicability notes. Do not silently copy RBI applicability between banks, PSOs, merchants and lending entities. Keep source records deduplicated by canonical URL + document version.


## Hosting decision — finalized 2026-11-20
**Authoritative deployment:** GitHub Pages for `eyeinthesky6/india-fintech-risk-atlas`. **Build:** Astro + Starlight + Pagefind via GitHub Actions. **Content:** GitHub Markdown/YAML and PR review. **Backend/database/domain:** none required. Expected project URL: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/` once enabled. Astro must configure `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`; use GitHub Actions Pages deployment, not Jekyll branch processing. Site output is generated; contributors do not edit templates. Cloudflare Pages and VitePress are alternatives only, not the selected deployment. This is a documentation decision, not confirmation that Pages has been enabled or deployed.
