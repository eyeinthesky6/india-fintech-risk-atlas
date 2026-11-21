# UPI v1 release audit — explicit evidence and implementation status

**As of:** 2026-11-21. **Decision:** NOT READY TO CLAIM VERIFIED OR PUBLICLY LAUNCHED.

## Scope inventory
- 17 drafted UPI pages (five initial and twelve expansion topics), covering scheme roles, customer scams, authentication, behavioral monitoring, merchant onboarding, reconciliation, dispute handling and customer protection.
- RBI/NPCI source register and per-record evidence/attestation scaffolds.
- Additional four-layer evidence classification, practitioner/industry intake templates, licensing and architecture freeze.

## Gaps that block factual publication
1. Most draft pages do not yet have atomic claim-to-passage evidence for **every** material assertion. An evidence ledger containing 'PENDING' is not verification.
2. The source register does not establish that all relevant NPCI circulars are current, unamended and applicable.
3. No separate reviewer has signed off every material claim, especially normative claims and operational advice.
4. Company/practitioner examples need named source links and accurate claims before presentation as observed production practice. Do not invent bank implementation details.
5. RBI directions differ by entity type and effective date. All mandatory wording must be scoped to the correct participant.
6. The current website scaffold's Astro build, Pagefind index, navigation and GitHub Pages deployment have not been independently verified.
7. Repository visibility and Pages configuration are not yet confirmed. No live site should be asserted.

## Evidence quality examples
- NPCI [Fraud Awareness](https://www.npci.org.in/fraud-awareness) explicitly covers fake cashback links, QR codes, search-result deception, social-media grievances and unknown apps. This supports consumer education, not mandatory participant monitoring rules.
- NPCI [UPI FAQs](https://www.npci.org.in/what-we-do/upi/faqs) explains UPI PIN, registration and participant/customer behavior; verify scheme changes before presenting current operational requirements.
- RBI payments-bank security directions: verify exact sections and entity scope for fraud monitoring, reconciliation and alerts.
- NPCI settlement process: do not publish fixed dispute TATs without checking current operating circulars.

## Technical validation to run
- Install pinned dependencies and commit lockfile; run `npm ci && npm run build`.
- Confirm `dist/index.html`, UPI routes and Pagefind assets exist.
- Check all internal links under `/india-fintech-risk-atlas/`.
- Run content attestation validator in CI, check workflow permissions and Pages deploy.
- Smoke-test search and mobile layout in a browser.

## Publish decision
Only promote individually reviewed pages. It is acceptable to publish a clearly labeled research preview **if** the editorial owner knowingly approves it, but do not label drafts 'verified'. Complete coverage is a scope decision; a 17-page count alone does not demonstrate completeness.
