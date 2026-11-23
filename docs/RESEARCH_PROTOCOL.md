# Research, validation, and contribution protocol

> **Scope & evidence model:** Read [ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md), [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md), [OPERATOR_INTELLIGENCE.md](OPERATOR_INTELLIGENCE.md), and [EVIDENCE_LAYERS_AND_RIGHTS.md](EVIDENCE_LAYERS_AND_RIGHTS.md) before drafting or auditing records.

## Mission and quality principle

Create accurate, accessible, independently verifiable explanations of fraud, AML, and operational risk across Indian financial products. **Reference platform first; candidate solutions come second preference.** Every material assertion must trace to an opened primary document or be explicitly labeled as an industry report, practitioner observation, or Atlas synthesis / research lead.

**Quality principle:** Completeness means clearly bounded, source-backed coverage with visible limitations and blockers—never an assertion that all fraud methods or detection rules are exhausted, and never treating a passing build as proof of truth.

## Four-layer evidence rules

Organize and cite sources strictly across **four layers** (`official`, `industry`, `practitioner`, `atlas`):
- **Layer 1 (`Official`):** Verifiable regulatory/scheme mandates and official guidance, scoped precisely to entity class and effective period.
- **Layer 2 (`Industry`):** Company-reported engineering docs and practices; **not** regulatory mandates or proof of ecosystem-wide adoption.
- **Layer 3 (`Practitioner`):** Named human professionals' dated firsthand operational observations (author, stated role/organization, date, URL, concise original paraphrase; no employer endorsement implied).
- **Layer 4 (`Atlas & research references`):** Atlas editorial synthesis, candidate gap controls, hypotheses, and **academic/research paper leads (`arXiv`, etc.)**. Because academic papers are typically narrow and short-objective-focused (useful for exploring ideas rather than reliable ready-to-use content), keep them in Layer 4 with dataset/sample caveats—never under Industry or Practitioner.
- **No scraping infrastructure:** Fetch/read only publicly accessible URLs directly; document access blockers (`HTTP 403`, paywalls) honestly rather than bypassing access controls or inventing claims.

## Smallest work unit & agent contract

**Goal:** One bounded research unit per PR—one product + one topic/record, or at most five closely related records. Never run an unreviewed category-wide rewrite in a single pass.

Lifecycle progression: `discover → extract → draft → source-check → independent review → publish`.

1. Check [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md), [RELEASE_STATUS.md](RELEASE_STATUS.md), existing records, and `research/upi/` registers to avoid duplicates and clarify actor applicability/exclusions.
2. Search original RBI/NPCI/statutory sources first, then operator engineering docs, dated practitioner observations, and (as Layer 4 gap-solution leads) open-access academic papers.
3. Open every primary source directly (never cite search snippets). Extract exact claims and locators into the Markdown pipe table in `research/evidence/<RECORD-ID>.md`.
4. Draft or update the article under `src/content/docs/<product>/` using typed YAML frontmatter matching `src/content.config.ts` and the unified 8-section layout in [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md).
5. Update `research/attestations/<RECORD-ID>.md` strictly from `docs/ATTESTATION_TEMPLATE.md`. Unchecked boxes are expected and valid for `draft` and `source-checked` work; **never** check boxes 8–10 or 12 without an independent reviewer.
6. Separate independent reviewer re-opens every cited URL, verifies scope/dates/context, marks outcomes in `research/evidence/<RECORD-ID>.md`, and signs the attestation. **Researcher and reviewer must never be the same agent or pass.**
7. Open a PR with the PR template checklist, disclose blockers, and wait for human review. Never merge or deploy autonomously.

**Publication policy:** Draft and `source-checked` records may remain in clearly labeled research preview branches/draft PRs. Promoting a record to `reviewed` or `published` requires all 12 attestation checkboxes completed, zero `PENDING`/`unverified`/`blocked` ledger rows, a distinct named independent reviewer, and human merge approval.

## Unified 10-step research & synthesis pipeline

1. **Scope & deduplicate:** Select product, lifecycle stage(s), risk/control record, and target actors; check existing `UPI-*` / canonical IDs.
2. **Discover candidates:** Search RBI, NPCI, and Indian sector regulators first; then PSP/bank/PA documentation, dated practitioners, and open-access studies (`arXiv`, Google Scholar, SSRN) for Layer 4 ideas.
3. **Retrieve originals:** Open full source PDFs/HTML pages directly. Record title, publisher, circular/notification number, document date, version, effective period, actor scope, section/clause, and URL.
4. **Extract & atomize claims:** Split prose into discrete claims using the source extraction sheet below and log each claim in `research/evidence/<RECORD-ID>.md`'s 7-column Markdown table (`Claim ID | Layer | Claim | Source | Exact locator | Scope & effective date | Result`).
5. **Cross-check:** Verify substantive technical assertions with a second independent source where feasible (two blogs quoting the same press release do not count as independent corroboration). Deduplicate by underlying mechanism, not surface title.
6. **Draft record:** Write original Markdown per `docs/CONTENT_SCHEMA.md`, putting verified reference facts first and Layer 4 candidate controls & academic research leads second, with data prerequisites, false positives, customer harm, and validation trade-offs without disclosing exploitable evasion thresholds.
7. **Self-attest honestly:** Set frontmatter `reviewStage` and attestation `Stage:` consistently (`draft` if any source is blocked/incomplete; `source-checked` only when every cited claim's primary source has been opened and recorded with `Independent reviewer: PENDING`).
8. **Independent audit & editor spot-checks:** Separate reviewer independently re-opens each cited URL, verifies exact passages, legal applicability, effective dates, supersession, link validity, duplication, and copyright, and logs `supported` / `partially-supported` / `unsupported` / `conflicting`. An editor additionally spot-checks a risk-based sample of reviewed claims directly against primary documents.
9. **Resolve discrepancies:** Remove unsupported claims or downgrade them to visibly labeled hypotheses; preserve genuine contradictions cleanly.
10. **Publish gate & ongoing maintenance:** Re-verify records when RBI/NPCI circulars supersede prior rules, external links break (monitored weekly by `.github/workflows/external-links.yml`), material corrections arrive, or product mechanics shift.

## Source precedence & India source map

**Source precedence:**
1. Current primary statutory, regulatory, and scheme documents (RBI, NPCI, Parliament/GoI, FIU-IND, SEBI, IRDAI, CERT-In).
2. Official product, API, and security documentation (banks, PSPs, PAs, card networks).
3. Firsthand operational incident postmortems and dated practitioner observations (Layer 2 / Layer 3).
4. Vendor case studies and media reports (secondary context only; mark `vendor-reported`).
5. Academic papers and open benchmarks (cited strictly under **Layer 4** as candidate gap ideas/evaluations, never Layer 2/3 production proof).

**India source map:**
- **RBI:** Master Directions, circulars, FAQs, annual reports, payments oversight, discussion papers — `https://www.rbi.org.in/`
- **NPCI:** UPI product documentation, procedural circulars, UDIR/dispute scheme specs, fraud awareness — `https://www.npci.org.in/` *(note: direct automated fetches may face HTTP 403 WAF blocks requiring authorized browser audit)*
- **FIU-IND:** AML/CFT typologies and reporting guidance — `https://fiuindia.gov.in/`
- **SEBI:** Broker/intermediary cybersecurity & investor protection — `https://www.sebi.gov.in/`
- **IRDAI:** Insurance payment/distribution controls — `https://irdai.gov.in/`
- **MeitY / CERT-In:** Advisories and cyber incident directives — `https://www.cert-in.org.in/`
- **Government / parliamentary / courts:** PIB releases, committee reports, public rulings.
- **Industry operators:** Banks, PSPs, PAs, card networks, bureaus (secondary technical evidence only).
- **Academic & open benchmarks (Layer 4 leads):** arXiv, Google Scholar, SSRN, ACM/IEEE (explicitly state dataset/sample biases and narrow study scope).

**Search recipes (date-bounded; log queries and rejected candidates):**
- `site:rbi.org.in "UPI" "fraud" "direction" OR "circular"`
- `site:npci.org.in "UPI" "dispute" OR "risk" OR "security"`
- `site:rbi.org.in "digital payment security controls" "velocity"`
- `"UPI" "mule account" India bank research`
- `"payment aggregator" "transaction laundering" India`
- `"digital lending" "identity fraud" India study`
- `site:sebi.gov.in "unauthorized trading" cybersecurity`
- `site:cert-in.org.in "financial" "phishing" advisory`
- Search named operator engineering blogs + specific failure mode, then corroborate.

**Source extraction columns (single canonical format):**
`source_id | publisher | exact title | canonical URL | source class | document date | version | effective period | scope/actor | section | extracted claim summary | confidence reason | contradictory source | last checked | reuse/license note`

## Evidence integrity gate, independent checks & stop conditions

- **100% check on regulatory mandates:** Every `must`/`required` statutory or regulatory statement requires full primary-source verification (no sampling). Lower-risk technical commentary may be sampled only after each claim has a recorded source and locator, with sample size and error rate disclosed.
- **Ledger format & no `PENDING`/blocked promotion:** Every record keeps `Researcher:`, `Independent reviewer:`, `Publication status:`, and the 7-column Markdown table (`Claim ID | Layer | Claim | Source | Exact locator | Scope & effective date | Result`) in `research/evidence/<RECORD-ID>.md`. Any record with a `PENDING`, `unverified`, or `blocked` cell stays `draft`; it reaches `source-checked` only when 100% of cited claims are opened cleanly (with `Independent reviewer: PENDING`).
- **Audit trail & reproducibility:** Preserve retrieval dates, exact section locators, researcher/reviewer identities, commit SHAs, and review decisions. Do not treat a model's self-reported verification summary in place of explicit URLs and locators.
- **Evidence-based stopping & SME escalation:** Use evidence-based stopping rather than arbitrary three-pass consensus; bring in an independent human subject-matter expert for ambiguous or high-impact regulatory interpretation.
- **Stop conditions:** If a primary source is inaccessible (`403`/paywall), applicability/effective status is ambiguous, or a material claim lacks evidence, stop promotion, document the blocker accurately in the evidence ledger and frontmatter `blockerNote`, and keep `reviewStage: draft`.

## Hard vs. soft gates & local hook setup

- **Hard gates (automated CI & pre-commit):** Run once per clone: `git config core.hooksPath .githooks`. Note that local Git hooks can be bypassed with `git commit --no-verify`, which is why **server-side branch protection on `main` is mandatory** alongside CI so neither `--no-verify` nor web/API commits can skip validation.
  - [check-attestations.py](../scripts/check-attestations.py): checks unique `recordId`, typed frontmatter `reviewStage`, exact `frontmatter.reviewStage == attestation.Stage`, 12 attestation checkboxes, Researcher != Independent reviewer guards, `PENDING` reviewer box protections, non-blocked claims for `source-checked`/`reviewed`/`published`, and that every external URL in `## References` appears in `research/evidence/<ID>.md`.
  - [validate.yml](../.github/workflows/validate.yml): runs attestation check (`--all`), reproducible `npm ci && npm run build` (`starlight-links-validator`), Pagefind `.pf_filter` assertion, and HTML link/base-path checks.
- **Soft gates (human / independent reviewer):** Whether the primary text genuinely supports the wording, scope, effective dates, exceptions, and risk trade-offs.

## Required PR evidence checklist

- [ ] Exact product/actor applicability and exclusions stated
- [ ] All normative requirements cite current operative primary source and exact section
- [ ] Numerical limits/timelines dated, sourced, and entity-scoped
- [ ] Draft, consultation (`non-binding`), and superseded guidance marked clearly
- [ ] Fraud indicators distinguished from proof of fraud
- [ ] False positives, customer friction, and data-access limits documented
- [ ] Academic papers classified strictly under Layer 4 (`atlas`) with narrow-study caveats
- [ ] Every URL checked and external `## References` match `research/evidence/<RECORD-ID>.md`
- [ ] No copied protected text or actionable evasion thresholds
- [ ] No duplicate canonical IDs or broken cross-links
- [ ] `research/attestations/<RECORD-ID>.md` matches frontmatter stage (`Independent reviewer` left `PENDING` until separately reviewed) and `npm run build` / Pagefind filter checks pass

## Agent prompts

### Contributor / researcher prompt
> You are a research contributor to India Fintech Risk Atlas. Work on **one** bounded unit (`1–5` records) at a time. Remember the Atlas is a **reference platform first** (candidate solutions second). Read `README.md`, `docs/ARCHITECTURE_FREEZE.md`, `docs/CONTENT_SCHEMA.md`, `docs/OPERATOR_INTELLIGENCE.md`, `docs/EVIDENCE_LAYERS_AND_RIGHTS.md`, and `docs/RESEARCH_PROTOCOL.md` before drafting. Prioritize current primary RBI/NPCI sources, open original documents (never snippets), separate evidence strictly across 4 layers (`Official`, `Industry`, `Practitioner`, and `Atlas`—keeping academic papers in Layer 4 as gap-idea leads), produce `research/evidence/<ID>.md` and `research/attestations/<ID>.md`, ensure frontmatter `reviewStage` matches attestation `Stage`, and open a PR disclosing blockers. Never invent citations, thresholds, or dates, and never self-certify independent review.

### Independent audit agent prompt
> Read `docs/ARCHITECTURE_FREEZE.md`, `docs/CONTENT_SCHEMA.md`, `docs/RESEARCH_PROTOCOL.md`, and `docs/EVIDENCE_LAYERS_AND_RIGHTS.md`. Inspect every changed claim and its primary source directly. For each assertion record `supported` / `partially-supported` / `unsupported` / `conflicting`, exact locator, actor scope, and effective date. Check for fabricated/misattributed sources, invalid links, legal overreach across actor classes, academic papers misclassified as Industry or Practitioner proof, copied protected text, duplicate records, and missing false positives. Do not rewrite evidence to force a pass and never review work from your own drafting run. Report blockers cleanly in ledger files and PR review comments.

## Source & provenance methodology references

- **W3C PROV overview:** https://www.w3.org/TR/prov-overview/ — attribution and provenance modeling.
- **NIST AI RMF GenAI Profile:** https://nvlpubs.nist.gov/nistpubs/AI/NIST.AI.600-1.pdf — verification discipline for AI-assisted research/citations.
- **Google ClaimReview:** https://developers.google.com/search/docs/appearance/structured-data/factcheck — transparency pattern (not a substitute for verification).
- **OASIS STIX 2.1:** https://docs.oasis-open.org/cti/stix/v2.1/stix-v2.1.html — entity/relationship provenance precedent (architectural reference only).
- **FAIR principles:** https://www.go-fair.org/fair-principles/ — findable, accessible, interoperable, reusable research artifacts.
