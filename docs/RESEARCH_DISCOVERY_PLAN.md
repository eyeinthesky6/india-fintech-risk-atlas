# Research discovery and synthesis playbook
Status: approved process proposal; not a claim that all sources have been audited.

## Source map for India-only substantive content
RBI: directions, notifications, FAQs, annual reports, payment-system oversight, fraud/cyber reports — https://www.rbi.org.in/
NPCI: UPI product documentation, circulars, dispute/reconciliation scheme materials, safety awareness — https://www.npci.org.in/
FIU-IND: typologies and official reporting guidance where relevant — https://fiuindia.gov.in/
SEBI: broker/market intermediaries and investor protection — https://www.sebi.gov.in/
IRDAI: insurance distribution/payment-related risks — https://irdai.gov.in/
MeitY / CERT-In: relevant cyber incidents and advisories — https://www.cert-in.org.in/
Government / parliamentary papers and public court decisions when relevant.
Companies: banks, PSPs, payment aggregators, card networks, fintech infrastructure providers, bureau and identity providers. Their engineering blogs and public documents are **secondary technical evidence**, not a source of mandatory rules.
Academic: Google Scholar, SSRN, arXiv, ACM/IEEE; assess methods, sample representativeness, and applicability to India.

## Search recipes
- site:rbi.org.in "UPI" "fraud" "direction" OR "circular"
- site:npci.org.in "UPI" "dispute" OR "risk" OR "security"
- site:rbi.org.in "digital payment security controls" "velocity"
- "UPI" "mule account" India bank research
- "payment aggregator" "transaction laundering" India
- "digital lending" "identity fraud" India study
- site:sebi.gov.in "unauthorized trading" cybersecurity
- site:cert-in.org.in "financial" "phishing" advisory
- search named operator engineering blogs + precise issue, then corroborate.
Search in date-bounded slices, record query/date and rejected sources, and inspect documents for amendments and current applicability.

## Source extraction sheet
source_id | publisher | exact title | canonical URL | source class | document date | version | effective period | scope/actor | section | extracted claim summary | confidence reason | contradictory source | last checked | reuse/license note.

## Synthesis pipeline
1. Harvest source candidates into a source register (do not write articles from snippets).
2. Read full authoritative sections and capture source/version metadata.
3. Extract atomic claims with locators and actor applicability.
4. Cluster claims into pattern, control, requirement, case and product entities.
5. Deduplicate by canonical meaning, not just similar titles.
6. Link entities and flag disagreements/uncertainty.
7. Write original article from verified claims, with inline citations and bottom references.
8. Independent reviewer reopens cited sources, verifies every normative claim and samples technical claims.
9. Record rejected claims, open gaps and source-change triggers.
10. Publish only reviewed content; revalidate when source changes.

## Independent agent audit prompt
Read PRODUCT_ARCHITECTURE.md, DATA_MODEL.md and RESEARCH_PROTOCOL.md. Inspect every changed claim and its primary source. For each assertion report supported / partially supported / unsupported / conflicting, exact locator, scope and effective date. Look for fabricated sources, invalid links, legal overreach, copied text, duplicate records and missing false positives. Do not rewrite evidence to make the author pass. Do not approve your own research. Report blockers as GitHub review comments or issues.

## Research papers / methods to investigate further
- OASIS STIX 2.1 specification for evidence and relationship modeling: https://docs.oasis-open.org/cti/stix/v2.1/stix-v2.1.html
- FAIR principles for findable, accessible, interoperable and reusable data: https://www.go-fair.org/fair-principles/
- W3C PROV provenance data model: https://www.w3.org/TR/prov-overview/
These are architectural references only, not endorsements of implementing STIX or RDF.

## Stop conditions
If original primary source is inaccessible, current status is unclear, actor applicability conflicts, or a material claim lacks evidence: mark researching and stop publication. A passing syntax/build check is not evidence of correctness.


## Hosting decision — finalized 2026-11-20
**Authoritative deployment:** GitHub Pages for `eyeinthesky6/india-fintech-risk-atlas`. **Build:** Astro + Starlight + Pagefind via GitHub Actions. **Content:** GitHub Markdown/YAML and PR review. **Backend/database/domain:** none required. Expected project URL: `https://eyeinthesky6.github.io/india-fintech-risk-atlas/` once enabled. Astro must configure `site: 'https://eyeinthesky6.github.io'` and `base: '/india-fintech-risk-atlas'`; use GitHub Actions Pages deployment, not Jekyll branch processing. Site output is generated; contributors do not edit templates. Cloudflare Pages and VitePress are alternatives only, not the selected deployment. This is a documentation decision, not confirmation that Pages has been enabled or deployed.
