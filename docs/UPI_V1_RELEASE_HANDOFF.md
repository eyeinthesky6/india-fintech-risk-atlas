# UPI v1 — release blockers and owner handoff

Updated 2026-11-21. **This is a release candidate in a draft PR, not a published verified compendium.**

## Completed in the consolidation branch
- GitHub Pages/Astro/Starlight static website scaffold, UPI navigation and full-text search integration.
- 17 UPI topic drafts, plus risk-stack playbook, company-practice examples, licensing and evidence policy.
- Source register, evidence ledgers, research attestations, four-layer attribution model.
- CC BY 4.0 original editorial material / MIT original code.
- Local hook and CI attestation mechanism integrated; architecture freeze and outdated assumptions marked.
- Corrected known subpath links for GitHub Pages.

## Blockers, ordered
1. **Build gate:** CI build has not produced a confirmed success. The package versions are not locked; create/commit `package-lock.json` from a successful install and switch CI from `npm install` to `npm ci`. Test GitHub Pages base path, Pagefind assets, sidebar links and mobile layout.
2. **Research gate:** current NPCI UPI operating circulars, dispute timing and amended requirements must be verified against official originals. Do not publish unverified deadlines.
3. **Claim audit:** every material normative statement needs a specific source passage and actor/effective-date applicability. Draft attestations with unchecked boxes remain truthful but not release approval.
4. **Independent reviewer:** a different reviewer must reopen each primary source, mark supported/unsupported/contradictory, and sign the evidence ledger. One agent's two passes do not establish independence.
5. **Operator evidence:** named practitioner examples need original posts, dates and accurate attribution; existing company-reported examples must be checked against their precise documentation. Avoid assuming proprietary controls.
6. **Publishing gate:** repository is private as last checked. Make public only after rights/source review; enable Pages source GitHub Actions; confirm actual live URL and mobile/search behavior.
7. **Enforcement gate:** configure repository branch protection to require content attestation and site build checks; local hooks alone are bypassable.

## No-go rules
Do not tick incomplete attestations, label unverified material 'reviewed', merge PR #6 as a verified launch, or claim a live site without observing the successful deployment. Do not merge older PRs #1/#2/#4/#5 independently after this consolidation, to avoid reintroducing conflicts.

## Definition of done
- Build and smoke tests pass.
- Every published material claim has evidence and a distinct reviewer.
- UPI scope and exclusions are explicit.
- Search, navigation, citations and responsive UI work on the live Pages URL.
- Licensing and attribution review passes.
- Release owner signs off the publication state.

## Freeze
No new backend, scraper, AI runtime, custom search application or schema migration. Fix blockers only.
