# India Fintech Risk Atlas — UPI v1 release status & audit

**Historical release branch & PR:** `release/upi-v1-freeze` (PR `#6`).

**Publication verdict:** Public [research preview](https://eyeinthesky6.github.io/india-fintech-risk-atlas/) — **NOT independently second-reviewer certified**. Technical results below are historical audit results, not a fresh CI run.

---

## Scope inventory

- **17 canonical UPI topic records** (`UPI-OVERVIEW` explainer and `UPI-001` through `UPI-016`) under `src/content/docs/upi/`, using typed YAML frontmatter driven by [src/taxonomy.json](../src/taxonomy.json) and `src/content.config.ts`, paired 1:1 with `research/evidence/<ID>.md` and `research/attestations/<ID>.md`.
- **6 product-level engineering & reference pages:** [upi/index.mdx](../src/content/docs/upi/index.mdx) (auto-generated catalogue), [upi/coverage.mdx](../src/content/docs/upi/coverage.mdx) (live verification table), [risk-stack-playbook.md](../src/content/docs/upi/risk-stack-playbook.md), [operator-insights.md](../src/content/docs/upi/operator-insights.md), [sources.md](../src/content/docs/upi/sources.md), and [glossary.md](../src/content/docs/upi/glossary.md).
- **Internal research ledgers:** `research/upi/PRIMARY_SOURCE_REGISTER.md` records inspected primary sources and the provisional NPCI member-bank mirror. `research/upi/OPERATOR_EVIDENCE.md` records company engineering material and separately lists academic research.

## Evidence verification & source retrieval

- **16 `source-checked` UPI records:** `UPI-OVERVIEW`, `UPI-001`–`UPI-007` and `UPI-009`–`UPI-016`. The [primary source register](../research/upi/PRIMARY_SOURCE_REGISTER.md) preserves the November 23 audit and the November 25 inspection of OC-226.
- **1 research draft:** `UPI-008` awaits direct inspection of the original NPCI member circular.
- **`0` `reviewed` / `published` records:** Independent second-reviewer verification has not yet occurred on any record.

## Technical, schema & CI validation status

- **OSS stack & audit:** `astro@^7.4.13`, `@astrojs/starlight@^0.43.1`, and `starlight-links-validator@^0.27.0` with reproducible `package-lock.json`; `npm audit --omit=dev` reports **`0 vulnerabilities`**.
- **Build, search & link validation:** `npm ci --no-audit --no-fund && npm run build` builds all 29 pages cleanly, `starlight-links-validator` validates Markdown/MDX links, built HTML internal link & `/india-fintech-risk-atlas/` base-path checks pass, and Pagefind indexes 6 filter keys (`record_type`, `stage`, `product`, `lifecycle`, `actor`, `evidence_layer` across strictly 5 plain-English layers). All 17 UPI records + guides use the Ready-Reckoner format with collapsed bottom source drawers, bottom Record Dossier, and best-effort disclaimer linking to `.github/ISSUE_TEMPLATE/factual-correction.yml`.
- **Pre-commit & attestation enforcement:** `scripts/check-attestations.py` (enforcing `frontmatter.reviewStage == attestation.Stage`, valid `lastSourceCheck`, deprecated-URL guards, 12 checkboxes, `PENDING` reviewer guards, and `## References` external URL presence in `research/evidence/<ID>.md`) and `scripts/verify-citations.py` (online/offline citation triage, browser-fallback queueing, and `90d`/`180d` freshness SLAs; documented in `.agents/skills/atlas-content-update/SKILL.md`) pass (`--all` and staged hooks), with negative failure tests verified.
- **GitHub Actions CI:** Consolidated `.github/workflows/validate.yml` (`Content attestation` + `Site build & link check`) and `.github/workflows/pages.yml` run on Node 24 native actions (`actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`), alongside weekly `.github/workflows/external-links.yml` (`lycheeverse/lychee-action@v2` with `.lycheeignore` excluding WAF-blocked `npci.org.in`). Exact run links are tracked in PR `#6`.
- **Live preview browser QA (`127.0.0.1:4321`):** Desktop (`1280×800`) and mobile (`375×812`) inspection verified `<Aside>` stage banners, wrapped metadata chips, auto-generated `/upi/` & `/upi/coverage/` tables, interactive Pagefind filter toggling, 0 console errors, 0 failed network requests, and 0 horizontal overflow on mobile.
- **Resolved Nov-23 defects:** Fixed Starlight root sidebar `link: '/'`, added `public/favicon.svg`, removed duplicate `content/upi/UPI-001.md`, fixed Windows `python3.exe` alias fallback in `.githooks/pre-commit`, added blocked `npci.org.in/what-we-do/upi/product-overview` URL to `research/evidence/UPI-004.md`, eliminated hardcoded counts via `.mdx` build components, and aligned academic research leads under Layer 4.

## Ordered release blockers & no-go rules

1. **Independent second-reviewer verification (Domain Steward Model):** Transitioning from blank-slate monolithic re-auditing to designated human **Domain Stewards & Section Supporters** ([docs/TOPIC_STEWARDSHIP_AND_DELTA_REVIEW.md](TOPIC_STEWARDSHIP_AND_DELTA_REVIEW.md)). Stewards certify baseline records, while subsequent regulatory updates only require delta-verification of the specific diff rather than resetting the entire page.
2. **Original-source verification of `NPCI/2025-26/IS/003` (`UPI-008`):** Open. A member-bank mirror and CERT-In empaneled auditor advisories corroborate the circular. The issuer original, exact operative scope and later changes remain unverified. The [evidence ledger](../research/evidence/UPI-008.md) retains the provisional claim and locator.
3. **Company-reported Indian engineering practices:** Expanded (2026-11-24); separate named practitioner evidence remains open. Automated engineering feed watcher (`scripts/watch-practitioners.py`) and scheduled GitHub Action (`.github/workflows/practitioner-watcher.yml`) implemented. Discovered and auto-ingested verified engineering publications from PhonePe (TStore transaction persistence & idempotency `OP-007`/`OP-008`, Real-time fraud detection `OP-013`, Module sandboxing & security isolation `OP-009`/`OP-011`/`OP-012`, Clockwork reconciliation `OP-010`) and Cashfree (UPI International checkout, refunds & settlements `OP-014`/`OP-015`) into `research/upi/OPERATOR_EVIDENCE.md` under Layer 2.
4. **Repository visibility, Pages activation & branch protection:** Public research preview is available. Verify branch protection requiring `Content attestation` and `Site build & link check` on `main`; do not infer protection from deployment.
5. **Overlapping draft PR hygiene:** **RESOLVED (2026-11-24).** Superseded draft PRs `#1`, `#2`, `#4`, and `#5` closed on GitHub with comment pointers to consolidation PR `#6`. Clean PR queue maintained.

**No-go rules:** Never tick independent reviewer boxes without an actual separate review; never label `draft` or `source-checked` records as `reviewed`/`published`; never represent the public preview as a verified compliance guide before blockers 1–2 are resolved; never claim a live Pages URL without observing deployment.

## Post-launch roadmap (v2 — once live)

1. **Role-based persona filtering (operator playbooks):** Zero-backend, client-side table filtering and curated persona views (`TPAP`, `PSP Bank`, `Remitter Bank`, `Beneficiary Bank`, `Payment Aggregator`, `Customer/Payer`) across the Ready-Reckoner `What to do` checklists, enabling operators to immediately filter down to the statutory mandates, telemetry requirements, and candidate controls applicable to their exact entity license.
2. **Interactive readiness & gap self-audit checklists:** Downloadable CSV/Markdown matrices and client-side self-audit toggles (e.g. assessing implementation of DoT MNRL screening, 12-hour cooling periods, remote-access app detection, chargeback TATs, and settlement reconciliations) for fintech engineering and risk teams preparing for internal pre-audits and regulatory reviews.
3. **Read-only MCP server & AI-readable exports (once live):** Emit static `llms.txt` and build-time JSON record/evidence exports from `src/content/docs/` and `src/taxonomy.json`, and publish an official **read-only Model Context Protocol (MCP) server** over those static GitHub Pages artifacts (zero runtime database) exposing `search_risk_records`, `get_record`, `get_evidence_ledger`, and `list_sources` with explicit `reviewStage`, 5-layer attribution, and `lastSourceCheck` dates.
4. **Agent-led issue/PR maintenance & BYO-agent contributor workflow *(deferred until core product flows complete)*:** Auto-updates, agentic updates, MCP, and automated GitHub management are explicitly deferred until after core product flows are finished. Because GitHub Copilot Free does not include Copilot Coding Agent ("Assign to Copilot") or Copilot Code Review (paid Pro/Business/Enterprise required) and GitHub requires `Write` access to assign issues to Copilot, external contributors cannot trigger owner-side agents directly. Instead:
   - *Contributors (BYO-agent or no-code):* Add structured GitHub Issue Forms (`.github/ISSUE_TEMPLATE/*.yml`) and a repo-root `AGENTS.md` pointer so non-coding or web-AI contributors can file structured issues cleanly, while technical contributors fork and run *any* coding agent they choose (Antigravity, Claude Code, Codex, Cursor, or their own Copilot seat) to submit PRs matching `.agents/skills/atlas-content-update/SKILL.md`.
   - *Owner's agent management:* PR triage, verification checks, and merge orchestration are managed by the repository owner's own agent (`scripts/check-attestations.py`, `scripts/verify-citations.py`, `npm run build`), keeping `Independent reviewer` verification distinct before marking records `reviewed`/`published` (and adding scheduled issue/PR triage only once core flows settle).

## Definition of complete

Complete means every agreed UPI topic family is covered by source-checked, independently reviewed entries with explicit entity scope, effective dates, limitations, and disclosed gaps—not that every possible fraud scheme is exhausted. For local clone, build, and preview commands, see [README.md](../README.md).
