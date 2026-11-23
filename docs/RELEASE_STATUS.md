# India Fintech Risk Atlas — UPI v1 release status & audit

**Branch & PR:** `release/upi-v1-freeze` (PR `#6`).  
**Publication verdict:** Technically validated release candidate — **NOT independently second-reviewer certified and NOT yet deployed publicly to GitHub Pages**.

---

## Scope inventory

- **17 canonical UPI topic records** (`UPI-OVERVIEW` explainer and `UPI-001` through `UPI-016`) under `src/content/docs/upi/`, using typed YAML frontmatter driven by [src/taxonomy.json](../src/taxonomy.json) and `src/content.config.ts`, paired 1:1 with `research/evidence/<ID>.md` and `research/attestations/<ID>.md`.
- **6 product-level engineering & reference pages:** [upi/index.mdx](../src/content/docs/upi/index.mdx) (auto-generated catalogue), [upi/coverage.mdx](../src/content/docs/upi/coverage.mdx) (live verification table), [risk-stack-playbook.md](../src/content/docs/upi/risk-stack-playbook.md), [operator-insights.md](../src/content/docs/upi/operator-insights.md), [sources.md](../src/content/docs/upi/sources.md), and [glossary.md](../src/content/docs/upi/glossary.md).
- **Internal research ledgers:** `research/upi/PRIMARY_SOURCE_REGISTER.md` (14 RBI/GoI documents + 10 browser-verified NPCI pages/circulars/PDFs + 1 provisional NPCI mirror `NPCI/2025-26/IS/003` absent from public circular indexes) and `research/upi/OPERATOR_EVIDENCE.md` (5 company docs `OP-001`–`OP-005` under Layer 2 + 3 `arXiv` preprints `RES-001`–`RES-003` classified under Layer 4 research leads).

## Evidence verification & source retrieval (2026-11-23 audit)

- **`16` `source-checked` drafts (`Independent reviewer: PENDING`):** `UPI-OVERVIEW`, `UPI-001`–`UPI-007`, `UPI-009`–`UPI-016`. Every cited source is directly opened and verified across 13 RBI directions/circulars/discussion paper (`id=13642`, `13624`, `13633`, `Id=13751`, `Id=12898`, `Id=13543`, `id=13089`, `id=11040`, `id=13641`, `id=12896`, `Id=11693`, `Id=11946`, `id=23810`), PIB release (`PRID=2260277`), browser-verified canonical `npci.org.in` pages and PDFs (`/product/upi`, `/about-upi`, `/roles-responsibilities`, `/faqs/upi`, `/complaint-register`, `/fraud-awareness`, `UPI_Settlement_Process_256f73e1df.pdf`, `OC 220`, `222A`, `OC 235`), Razorpay/Cashfree/Stripe docs, and 3 `arXiv` preprints (`2610.21314v1`, `2410.19845v1`, `2607.17586v1`). Deprecated `/what-we-do/upi/product-overview` and `/what-we-do/upi/faqs` `404` URLs were replaced.
- **`1` `draft` record (`UPI-008` — non-public circular blocker):** RBI directions and `npci.org.in/fraud-awareness` (*Downloading of unknown apps*) are directly verified, while circular `NPCI/2025-26/IS/003` (*Comprehensive Mobile Application Security Framework for UPI - 2025*, May 19, 2025) does not appear publicly on `npci.org.in/circulars/upi` or `/circulars/others` and continues to rely provisionally on a third-party cooperative bank mirror (`rscb.bank.in`).
- **`0` `reviewed` / `published` records:** Independent second-reviewer verification has not yet occurred on any record.

## Technical, schema & CI validation status

- **OSS stack & audit:** `astro@^7.4.13`, `@astrojs/starlight@^0.43.1`, and `starlight-links-validator@^0.27.0` with reproducible `package-lock.json`; `npm audit --omit=dev` reports **`0 vulnerabilities`**.
- **Build, search & link validation:** `npm ci --no-audit --no-fund && npm run build` builds all 29 pages cleanly, `starlight-links-validator` validates Markdown/MDX links, built HTML internal link & `/india-fintech-risk-atlas/` base-path checks pass, and Pagefind indexes 6 filter keys (`record_type`, `stage`, `product`, `lifecycle`, `actor`, `evidence_layer` across strictly 4 layers).
- **Pre-commit & attestation enforcement:** `scripts/check-attestations.py` (enforcing `frontmatter.reviewStage == attestation.Stage`, valid `lastSourceCheck`, deprecated-URL guards, 12 checkboxes, `PENDING` reviewer guards, and `## References` external URL presence in `research/evidence/<ID>.md`) and `scripts/verify-citations.py` (online/offline citation triage, browser-fallback queueing, and `90d`/`180d` freshness SLAs; documented in `.agents/skills/atlas-content-update/SKILL.md`) pass (`--all` and staged hooks), with negative failure tests verified.
- **GitHub Actions CI:** Consolidated `.github/workflows/validate.yml` (`Content attestation` + `Site build & link check`) and `.github/workflows/pages.yml` run on Node 24 native actions (`actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`), alongside weekly `.github/workflows/external-links.yml` (`lycheeverse/lychee-action@v2` with `.lycheeignore` excluding WAF-blocked `npci.org.in`). Exact run links are tracked in PR `#6`.
- **Live preview browser QA (`127.0.0.1:4321`):** Desktop (`1280×800`) and mobile (`375×812`) inspection verified `<Aside>` stage banners, wrapped metadata chips, auto-generated `/upi/` & `/upi/coverage/` tables, interactive Pagefind filter toggling, 0 console errors, 0 failed network requests, and 0 horizontal overflow on mobile.
- **Resolved Nov-23 defects:** Fixed Starlight root sidebar `link: '/'`, added `public/favicon.svg`, removed duplicate `content/upi/UPI-001.md`, fixed Windows `python3.exe` alias fallback in `.githooks/pre-commit`, added blocked `npci.org.in/what-we-do/upi/product-overview` URL to `research/evidence/UPI-004.md`, eliminated hardcoded counts via `.mdx` build components, and aligned academic research leads under Layer 4.

## Ordered release blockers & no-go rules

1. **Independent second-reviewer verification:** A separate reviewer must re-open each primary source, record claim outcomes in `research/evidence/<ID>.md`, and sign `research/attestations/<ID>.md`. An authoring/audit agent run cannot self-certify independent review.
2. **Official confirmation of `NPCI/2025-26/IS/003` (`UPI-008`):** Canonical `npci.org.in` product, FAQ, complaint-register, fraud-awareness, settlement, and circular pages (`OC 220`, `222A`, `OC 235`) were directly verified via browser on 2026-11-23; only `NPCI/2025-26/IS/003` remains absent from public `npci.org.in/circulars/upi` and `/circulars/others` and awaits member-circular confirmation against the provisional third-party bank mirror (`rscb.bank.in`).
3. **Named Indian practitioner observations:** None included in v1 (deferred until original dated public posts are directly verified).
4. **Repository visibility, Pages activation & branch protection:** Review rights/plan before making repo public, configure GitHub Pages (`Source: GitHub Actions`), enable branch protection requiring `Content attestation` and `Site build & link check` on `main`, and verify the live deployed URL post-merge.
5. **Overlapping draft PR hygiene:** Close superseded draft PRs `#1`, `#2`, `#4`, and `#5` with pointers to consolidation PR `#6` without merging them separately.

**No-go rules:** Never tick independent reviewer boxes without an actual separate review; never label `draft` or `source-checked` records as `reviewed`/`published`; never merge PR `#6` as a verified compliance guide before blockers 1–2 are resolved; never claim a live Pages URL without observing deployment.

## Post-launch roadmap (v2 — once live)

1. **Read-only MCP server & AI-readable exports (once live):** Emit static `llms.txt` and build-time JSON record/evidence exports from `src/content/docs/` and `src/taxonomy.json`, and publish an official **read-only Model Context Protocol (MCP) server** over those static GitHub Pages artifacts (zero runtime database) exposing `search_risk_records`, `get_record`, `get_evidence_ledger`, and `list_sources` with explicit `reviewStage`, 4-layer attribution, and `lastSourceCheck` dates.
2. **Agent-led issue/PR maintenance & BYO-agent contributor workflow *(deferred until core product flows complete)*:** Auto-updates, agentic updates, MCP, and automated GitHub management are explicitly deferred until after core product flows are finished. Because GitHub Copilot Free does not include Copilot Coding Agent ("Assign to Copilot") or Copilot Code Review (paid Pro/Business/Enterprise required) and GitHub requires `Write` access to assign issues to Copilot, external contributors cannot trigger owner-side agents directly. Instead:
   - *Contributors (BYO-agent or no-code):* Add structured GitHub Issue Forms (`.github/ISSUE_TEMPLATE/*.yml`) and a repo-root `AGENTS.md` pointer so non-coding or web-AI contributors can file structured issues cleanly, while technical contributors fork and run *any* coding agent they choose (Antigravity, Claude Code, Codex, Cursor, or their own Copilot seat) to submit PRs matching `.agents/skills/atlas-content-update/SKILL.md`.
   - *Owner's agent management:* PR triage, verification checks, and merge orchestration are managed by the repository owner's own agent (`scripts/check-attestations.py`, `scripts/verify-citations.py`, `npm run build`), keeping `Independent reviewer` verification distinct before marking records `reviewed`/`published` (and adding scheduled issue/PR triage only once core flows settle).

## Definition of complete

Complete means every agreed UPI topic family is covered by source-checked, independently reviewed entries with explicit entity scope, effective dates, limitations, and disclosed gaps—not that every possible fraud scheme is exhausted. For local clone, build, and preview commands, see [README.md](../README.md).
