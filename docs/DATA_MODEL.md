> **Active Reference Specification:** Living entity reference and controlled vocabularies guide aligned with [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) and [src/taxonomy.json](../src/taxonomy.json).

# Data model v1 — content first

## Design principles
One Markdown file per risk pattern or control. YAML frontmatter is the machine-readable index; readable Markdown is the canonical article. Stable IDs and URLs never change when titles change. No database, API or backend. Optional filter index can be generated from frontmatter during the static-site build.

## Controlled vocabularies
- product: upi, cards, imps-neft, netbanking, ppi-wallets, payment-gateway, merchant-acquiring, digital-lending, bnpl, bank-accounts, account-aggregator, cross-border, brokerage, insurance-payments, embedded-finance
- record_type: fraud-pattern, preventive-control, detective-control, operational-failure, recovery-process, explainer
- lifecycle: onboarding, authentication, initiation, authorization, processing, settlement, reconciliation, dispute, recovery, servicing
- actor: bank, payments-bank, tpap, psp-bank, nonbank-pso, payment-aggregator, merchant, nbfc, lender, broker, customer
- basis: binding-requirement, official-guidance, industry-practice, illustrative-hypothesis
- status: draft, researching, source-checked, reviewed, published, needs-reverification
- severity: avoid a universal numerical score; context-specific only

## Frontmatter example
```yaml
---
id: UPI-001
title: Unusual outbound payment velocity
slug: unusual-outbound-velocity
product: [upi]
record_type: detective-control
lifecycle: [initiation, authorization]
actors: [bank, psp-bank, nonbank-pso]
fraud_patterns: [account-takeover, mule-account]
basis: illustrative-hypothesis
status: draft
jurisdiction: IN
effective_from:
last_verified:
reviewed_by:
tags: [velocity, behavioral-risk]
sources: [SRC-RBI-PSO-2026, SRC-NPCI-UPI]
related: [UPI-002]
---
```

## Article body
1. Summary and applicability
2. How the pattern works (non-evasion level)
3. Signals / checks, with each claim linked to a source ID
4. Required data and data access constraints
5. False positives and legitimate lookalikes
6. User harm and operational trade-offs
7. Response / recovery
8. India-specific legal or scheme context (precisely scoped)
9. Related patterns
10. Numbered references with exact section, publisher, document date, URL, verified date
11. Changelog and reviewer notes

## Source record
```yaml
id: SRC-RBI-PSO-2026
publisher: Reserve Bank of India
title: Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs
url: https://www.rbi.org.in/scripts/FS_Notification.aspx?Id=13751&Mode=0&fn=2745
document_date: 2026-11-05
effective_date: null # check the actual directions
section: null # must be filled before publishing a claim
source_class: primary
applicable_actors: [nonbank-pso]
last_checked: null
superseded_by: null
```

## Claim evidence (review ledger)
For each nontrivial assertion record claim_id, exact article location, source_id, section/paragraph, short supporting paraphrase, applicability, verification result (supported / partially-supported / unsupported / conflicting), checked_at, reviewer. Store in a companion `research/UPI-001-evidence.md` until publishing.

## Cross-product reuse
A fraud pattern may have multiple products. Keep one canonical record when mechanics are identical, with product-specific applicability notes. Do not silently copy RBI applicability between banks, PSOs, merchants and lending entities. Keep source records deduplicated by canonical URL + document version.


## Hosting decision — finalized 2026-11-20
**Authoritative deployment:** GitHub Pages for `eyeinthesky6/india-fintech-risk-atlas`. **Build:** Astro + Starlight + Pagefind via GitHub Actions. **Content:** GitHub Markdown/YAML and PR review. **Backend/database/domain:** none required. Expected project URL: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/` once enabled. Astro must configure `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`; use GitHub Actions Pages deployment, not Jekyll branch processing. Site output is generated; contributors do not edit templates. Cloudflare Pages and VitePress are alternatives only, not the selected deployment. This is a documentation decision, not confirmation that Pages has been enabled or deployed.
