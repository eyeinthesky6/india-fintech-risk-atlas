# Operator intelligence: practical fraud, AML and risk-stack knowledge

Status: proposed editorial expansion | 2026-11-21

## Product mission
The Atlas is an India-focused, source-cited engineering reference that helps fintechs and banks design, review and improve fraud, AML and risk controls. **Not** a regulation-only directory. Include credible field observations, production failure modes, practical control designs, data prerequisites, validation and trade-offs. Foreign sources are permitted as method/architecture references, but do not automatically imply applicability to Indian payment rails or law.

## Source discovery priorities
1. RBI, NPCI, FIU-IND, CERT-In, SEBI, IRDAI and official operator documents.
2. Bank, PSP, payment gateway, NBFC and fintech engineering blogs, postmortems, product/security documentation and published case studies.
3. Named practitioners' LinkedIn posts, conference talks, podcasts and public technical write-ups. Record author, role **as stated by source**, organization, publication date, canonical post URL and access date. Never imply an employer endorses a personal view.
4. Fraud/AML vendor technical docs and case studies; distinguish independently verified findings from vendor claims.
5. Academic and industry research, datasets, benchmarks and reproducible open-source implementations.

## Candidate discovery queries
- India UPI fraud detection false positives PSP engineering blog
- bank AML transaction monitoring investigation operations alert fatigue India
- fintech mule account network detection graph case study India
- merchant acquiring fraud operations dispute reconciliation postmortem
- LinkedIn fraud risk leader UPI payment scam detection India
- RBI NPCI fraud risk circular device binding payment authentication
- Google AML AI investigation repeated alerts feature explainability
- Stripe Radar rules false positives review and backtest

## Intake and classification
A source yields one or more *observations*, not automatically a recommended control. Distinguish:
- **Observed operational defect:** firsthand or documented failure (who observed, when, context, evidence).
- **Risk hypothesis:** plausible mechanism not independently demonstrated.
- **Proposed control:** what might reduce risk, with prerequisites and costs.
- **Implemented practice:** a named operator says it uses the approach; do not assume universal adoption.
- **Evaluated control:** quantitative or qualitative evaluation with methods, sample context and limitations.
- **Binding requirement:** precise India-specific legal/scheme source and affected entity.

## Extended data entities
Observation (OBS-ID): title, author, organization, date, URL, source_type, first_hand_or_relayed, claim_summary, product_ids, pattern_ids, gap_ids, evidence_status, attribution_permission_notes.
Gap (GAP-ID): failure_mode, lifecycle, existing_control_assumption, bypass_or_breakdown_summary (non-evasion detail), detection_limitations, affected_actors, observed_or_hypothetical, source_ids.
Control (CTRL-ID): objective, risk/pattern/gap links, input_data, signals, approach (rules / graph / statistical / ML / human), expected outputs, intervention point, false positives, privacy, operational_cost, validation_method, monitoring_metrics, deployment caveats, evidence_strength.
Evaluation (EVAL-ID): control_id, dataset_context, period, method, baseline, metrics, limitations, who_reported, independently_reproduced.

## Practical control page template
1. Problem and operational failure being addressed.
2. Product(s), participant roles and lifecycle stage.
3. Mechanism and observations, with clear source attribution.
4. Control approach (rules/graph/ML/manual), not a production-ready implementation prescription.
5. Data prerequisites, quality and access rights.
6. Example detection logic at a non-evasion level; avoid publishing sensitive operational thresholds.
7. False positives, alert workload and customer friction.
8. Investigation workflow and escalation/response.
9. How to validate: offline replay, baseline comparison, precision/recall where labels support it, investigation yield, alert volume, drift and feedback loop.
10. Evidence quality and what is not known.
11. India-specific requirements only when relevant.
12. Inline citations, full references, contributors and last verified.

## Attribution and copyright
Link to the original author and original work; include author's name, article/post title, organization when relevant, date, URL and a concise original paraphrase. Credit the **specific insight** rather than merely listing a source at the bottom. Do not copy long LinkedIn posts, diagrams or proprietary vendor rules. Request permission for reproduction or images. If a post is unavailable, preserve metadata and mark unverified; do not fabricate content or imply endorsement.

## Evidence and review
A firsthand account can be useful with one source, but label it **single-source practitioner observation**. A vendor's performance number is **vendor-reported** unless independently reproduced. For an operator claim, independently cross-check where possible against documentation, another firsthand account, empirical data or an implementation case study. Separate existence of a pattern from effectiveness of a proposed mitigation. Reviewer must confirm the source says what we claim, attribution is accurate, and caveats remain visible. Existing per-record attestations apply.

## Examples from external practice (architecture references, not Indian obligations)
- Google Cloud AML AI docs: input schema, supplementary indicators, feature families, risk scores, explainability, model governance and backtesting — https://docs.cloud.google.com/financial-services/anti-money-laundering/docs
- Google Cloud AML AI investigation guidance: repeated alert suppression, explainability and model-threshold re-evaluation — https://docs.cloud.google.com/financial-services/anti-money-laundering/docs/best-practices-investigation-process
- Stripe Radar rules guide: rule configuration, testing, false-positive/operational trade-offs — https://stripe.com/guides/radar-rules-101
- FATF digital transformation and collaborative analytics: cross-institution information gaps and data-protection trade-offs — https://www.fatf-gafi.org/en/publications/digitaltransformation/digital-transformation.html
- Featurespace case studies: named operator claims, to be labeled vendor-reported and verified individually — https://www.featurespace.com/case-studies

## MVP scope
For UPI, add an operator-insights register and a curated set of controls with evidence strength. Start with transaction monitoring, mule networks, device/account takeover, merchant risk, false positives, reconciliation, dispute workflows and investigation feedback. Do not defer all operator insights until after regulations are complete. No new backend or custom UI needed: these are additional structured content types and filters.
