# Operator intelligence: practical fraud, AML and risk-stack guide

Status: active v1 editorial guide (incorporated into frozen four-layer scope; see [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md) and [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md))

## Role in the platform

India Fintech Risk Atlas is a **reference platform first**; candidate solutions come second. **Not** a compliance-only directory, the Atlas documents operational defects, field observations, and candidate control designs across fintech fraud and AML workflows with strict source attribution. Foreign company docs or studies are permitted as architectural/method analogies only and never imply Indian legal applicability.

## How sources map into the four layers

Follow the source discovery process in [RESEARCH_PROTOCOL.md](RESEARCH_PROTOCOL.md) and attribution/copyright rules in [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md):
- **Layer 1 (`Official`):** RBI, NPCI, FIU-IND, CERT-In, SEBI, IRDAI statutory and scheme requirements.
- **Layer 2 (`Industry`):** Bank, PSP, payment aggregator, NBFC, fintech, and vendor technical docs, postmortems, and case studies (`company-reported` or `vendor-reported`). Never credit a bank with an internal control merely because it offers a payment product.
- **Layer 3 (`Practitioner`):** Named professionals' dated public posts, talks, or write-ups with explicit role and firsthand-vs-relayed status (`author-observed`; no implied employer endorsement).
- **Layer 4 (`Atlas & research references`):** Atlas operational gaps, candidate controls, hypotheses, and **academic/research paper leads** (`arXiv`, workshop benchmarks). Because academic papers are typically narrow and short-objective-focused (helpful for ideas rather than reliable ready-to-use content), keep them in Layer 4 rather than Layer 2 or Layer 3.

## Intake and classification

A source yields structured observations—never automatic proof of universal adoption or compliance:
- **Observed operational defect:** firsthand or documented failure (who observed, when, context, evidence).
- **Risk hypothesis:** plausible mechanism not independently demonstrated.
- **Proposed control:** candidate mitigation with prerequisites, latency, and operational cost.
- **Implemented practice:** a named company publicly reports using the approach (`company-reported`).
- **Evaluated benchmark (Layer 4 research lead):** academic or empirical study evaluated on specific datasets/splits; record sample size, label bias, and narrow scope before extrapolating.
- **Binding requirement:** verified India-specific legal or scheme provision scoped to exact actor class and effective date.

## Extended data entities (v2 taxonomy mapping)

When expanding structured operator catalogs post-v1 (without replacing canonical v1 `UPI-*` IDs):
- **Observation (`OBS-ID`):** title, author, organization, date, URL, source_type, firsthand_or_relayed, claim_summary, product_ids, pattern_ids, gap_ids, evidence_status, attribution_notes.
- **Gap (`GAP-ID`):** failure_mode, lifecycle, existing_control_assumption, non-evasion bypass summary, detection_limitations, affected_actors, observed_or_hypothetical, source_ids.
- **Control (`CTRL-ID`):** objective, pattern/gap links, input_data, signals, approach (rules / graph / statistical / ML / human), intervention point, false positives, privacy, operational_cost, validation_method, monitoring_metrics, deployment caveats, evidence_strength.
- **Evaluation (`EVAL-ID`):** control_id, dataset_context, period, method, baseline, metrics, limitations, who_reported, independently_reproduced.

## Mapping operational details into the canonical article structure

Do **not** use a separate layout for control articles; map every operational-engineering detail directly into [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md)'s 8-section blueprint:
- **Risk mechanism and operational gap:** failure mode, participant roles, lifecycle stage, and existing-control assumption.
- **Layers 1–3:** separated verified obligations, `company-reported` practices, and firsthand practitioner accounts.
- **Layer 4 — Candidate controls, data prerequisites, and research references:** rules/graph/ML/manual approaches at a non-evasion level (zero live secret thresholds), required telemetry and data-access constraints, investigation/escalation workflow notes, and `### Research paper leads` (ideas for gaps with narrow-study caveats).
- **False positives, customer impact, and validation:** legitimate lookalikes, friction/unblock costs, offline replay vs. shadow testing, precision@k at real analyst queue capacity, drift/feedback-loop hygiene (`confirmed_fraud` vs. overturned false positives), and evidence gaps.
- **References and review history:** inline citations and verified ledger entries (`research/evidence/<RECORD-ID>.md`).

## Architecture reference links (foreign/vendor examples, not Indian law)

- **Google Cloud AML AI docs:** input schema, supplementary indicators, feature families, risk scores, explainability, model governance, and backtesting — https://docs.cloud.google.com/financial-services/anti-money-laundering/docs
- **Google Cloud AML AI investigation guidance:** repeated alert suppression, explainability, and threshold re-evaluation — https://docs.cloud.google.com/financial-services/anti-money-laundering/docs/best-practices-investigation-process
- **Stripe Radar rules guide:** rule configuration, backtesting, 60–120 day maturity windows, and false-positive trade-offs — https://stripe.com/guides/radar-rules-101
- **FATF digital transformation & collaborative analytics:** cross-institution information gaps and privacy trade-offs — https://www.fatf-gafi.org/en/publications/digitaltransformation/digital-transformation.html
- **Featurespace case studies:** named operator claims, marked `vendor-reported` and verified individually — https://www.featurespace.com/case-studies

## Current UPI v1 status

For UPI v1, operator docs (Razorpay, Cashfree, Stripe) and Layer 4 academic research leads (`RBIH NFPC`, `GPay India`, `OCBC Singapore`) are already cataloged in [src/content/docs/upi/operator-insights.md](../src/content/docs/upi/operator-insights.md) and [research/upi/OPERATOR_EVIDENCE.md](../research/upi/OPERATOR_EVIDENCE.md), with Pagefind filters (`record_type`, `stage`, `product`, `lifecycle`, `actor`, `evidence_layer`) rendered natively without custom search UI or a backend. Continue new discovery via [UPI_OPERATOR_RESEARCH_QUEUE.md](UPI_OPERATOR_RESEARCH_QUEUE.md).
