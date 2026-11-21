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


## Evidence integrity gate — added 2026-11-21
A citation is not a verified claim. Every normative or material claim needs a claim ID and an evidence ledger entry containing: claim text, record ID, exact source URL, publisher, document version/date, section or page, short supporting passage locator, entity applicability, effective period, source retrieval date, researcher identity, independent reviewer identity, review outcome and unresolved contradictions. Store the ledger under `research/evidence/<record-id>.md`. Do not copy lengthy protected passages.

### Mandatory independent checks
- Researcher extracts source-backed claims and drafts the article.
- Reviewer independently opens the original source, verifies its text and context, checks scope, dates and supersession, and marks each claim supported / partial / unsupported / contradictory.
- Deterministic CI checks IDs, missing required fields, reference targets, duplicate canonical IDs, internal links and evidence ledger presence. A passing CI is **not** a truth certification.
- Regulatory 'must' statements require 100% primary-source review; critical claims cannot be sampled. For lower-risk technical commentary, sample review is allowed only after each cited claim has a recorded source, with sample size and observed error rate disclosed.
- If any material claim is unsupported, conflicting or unreviewed, the record remains draft and cannot be labeled verified.
- Editor spot-checks a risk-based sample of reviewed claims directly against original documents; reviewer and researcher must not be the same agent run.

### Audit trail and reproducibility
Keep source retrieval log, evidence ledger, author/reviewer, commit SHA, review date and decision. Do not ask a model 'did you verify everything?' as evidence. Require verifiable locators and independent source opening. A model's self-reported tool usage is insufficient; where feasible, preserve tool-derived URL and retrieval metadata.

### Review frequency
Use evidence-based stopping, not arbitrary three-pass consensus. Reverify on RBI/NPCI changes, broken links, substantive corrections, new contradicting evidence or scheduled content review. An independent human subject-matter review is appropriate for ambiguous or high-impact regulatory interpretation.

### Source methodology references
W3C PROV overview: https://www.w3.org/TR/prov-overview/ — attribution and provenance.
NIST AI RMF GenAI profile: https://nvlpubs.nist.gov/nistpubs/AI/NIST.AI.600-1.pdf — verification of AI-generated citations and sources.
Google ClaimReview: https://developers.google.com/search/docs/appearance/structured-data/factcheck — transparency pattern, not a substitute for verification.
