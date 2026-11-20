# Research, validation and contribution protocol

## Mission
Create accurate, accessible, independently attributable explanations of fraud risks and checks for Indian fintech products. This protocol is intended for any AI research agent or human contributor.

## Per-record workflow
1. **Scope**: select one product, one lifecycle stage, one risk/control and relevant actor types. Check for duplicate IDs and overlapping records.
2. **Discover**: start with RBI, NPCI, relevant regulator or scheme operator; then banks, PSPs, payments companies, official engineering blogs, independent research, academic papers and practitioner writing. Record searches and candidate URLs.
3. **Retrieve**: open the primary document itself, not merely a search snippet. Capture exact title, publisher, date, version, effective date, applicable entities, paragraph/section and URL. Note amendments, draft status and withdrawals.
4. **Atomize claims**: split prose into discrete factual or normative assertions. Pair each with an exact source locator. Keep opinion separate and labeled.
5. **Cross-check**: independently verify substantive technical assertions with a second source when feasible. Two articles repeating the same release are not independent. Prioritize original operating documents over marketing pages.
6. **Draft**: populate DATA_MODEL.md fields and article sections. Discuss legitimate behavior that resembles fraud, privacy/data access constraints and customer harms. Never invent limits, SLAs, thresholds or mandated procedures.
7. **Audit**: reviewer opens each cited URL and checks the actual passage, legal applicability, effective period, technical accuracy, link validity, duplication and copyright. Record a claim-by-claim evidence ledger.
8. **Resolve**: unsupported claims are removed or explicitly labeled hypotheses; disagreements are documented. No silent assumption or hallucinated citation.
9. **Publish gate**: only status=reviewed, valid references, confirmed applicability and a passing static build can merge for publication. Human approves the PR.
10. **Maintain**: recheck after regulator or scheme circular changes, corrections, material product changes or contributor reports. Record the date and change history.

## Source precedence
1. Current primary regulatory / scheme documents
2. Official product and technical documentation
3. Firsthand incident reports and research papers
4. Independent practitioner studies
5. Vendor blogs and media reports as secondary context

## Required PR evidence
- [ ] Exact product/actor applicability stated
- [ ] All 'must'/'required' claims cite current operative primary source and section
- [ ] All numerical limits dated, sourced and scoped
- [ ] Draft/superseded guidance marked correctly
- [ ] Fraud indicators are not described as proof
- [ ] False positives and customer impact included
- [ ] Every link checked and material claims supported
- [ ] No copied protected text or unsafe evasion instructions
- [ ] No duplicate record, broken ID or broken cross-link
- [ ] Reviewer and verified date present
- [ ] Site build and search smoke check pass

## Agent prompt
You are a research contributor to India Fintech Risk Atlas. Work on ONE record at a time. Read README.md, docs/DATA_MODEL.md and this protocol before drafting. Prioritize current original RBI/NPCI sources, inspect source documents, distinguish obligations from suggested controls, produce an evidence ledger, and open a PR. Do not invent citations, thresholds or dates. If evidence is inadequate, mark the record researching and report the gap. Never merge or publish autonomously.

## Quality principle
Completeness means clearly bounded coverage with verified claims—not an assertion that all possible fraud controls are known.


## Hosting decision — finalized 2026-11-20
**Authoritative deployment:** GitHub Pages for `eyeinthesky6/india-fintech-risk-atlas`. **Build:** Astro + Starlight + Pagefind via GitHub Actions. **Content:** GitHub Markdown/YAML and PR review. **Backend/database/domain:** none required. Expected project URL: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/` once enabled. Astro must configure `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`; use GitHub Actions Pages deployment, not Jekyll branch processing. Site output is generated; contributors do not edit templates. Cloudflare Pages and VitePress are alternatives only, not the selected deployment. This is a documentation decision, not confirmation that Pages has been enabled or deployed.
