---
name: atlas-content-update
description: Add, update, and verify India Fintech Risk Atlas records, references, and citations, including manual in-browser computer-use fallback when automated HTTP fetches fail or hit JavaScript SPAs. Use whenever drafting new patterns, refreshing stale sources, fixing broken or deprecated links, or checking whether regulatory circulars have changed.
license: CC-BY-4.0
---

# Atlas Content Update & Source Verification Skill

Use this skill when adding new risk/control records, updating existing articles, or re-verifying links, references, and citations in `india-fintech-risk-atlas`.

## Core Principle

**Reference platform first, candidate solutions second—and every cited source must be opened, verified in context, and kept current.**

- Try fast automated HTTP checks (`scripts/verify-citations.py`) first on every record.
- Whenever HTTP fails with a WAF block (`HTTP 403`/`429`), timeout, or JavaScript SPA shell (`<app-root>`, empty body), switch to **manual in-browser computer-use validation** (browser subagent, Chrome DevTools, or a human browser session).
- When a source still cannot be opened publicly (member-only circular, login wall, paywall, or CAPTCHA), stop honestly, record `blocked (...)` in the evidence ledger, and keep `reviewStage: draft`.

## Authoritative Repo References (Read Before Editing)

Do not duplicate canonical rules from prose—read the live repository files directly:

| Concern | Single Source of Truth |
|---|---|
| Allowed `products`, `recordType`, `theme`, `lifecycle`, `actors`, `evidenceLayers`, `reviewStage` | [src/taxonomy.json](../../../src/taxonomy.json) |
| Frontmatter shape, 4-layer model, 8-section layout | [docs/CONTENT_SCHEMA.md](../../../docs/CONTENT_SCHEMA.md) |
| Research protocol, precedence, source map, stopping rules | [docs/RESEARCH_PROTOCOL.md](../../../docs/RESEARCH_PROTOCOL.md) |
| Rights, paraphrasing, third-party limits | [docs/EVIDENCE_LAYERS_AND_RIGHTS.md](../../../docs/EVIDENCE_LAYERS_AND_RIGHTS.md) |
| Per-record attestation checkboxes (12 items) | [docs/ATTESTATION_TEMPLATE.md](../../../docs/ATTESTATION_TEMPLATE.md) |
| Verified UPI regulatory & industry registries | [research/upi/PRIMARY_SOURCE_REGISTER.md](../../../research/upi/PRIMARY_SOURCE_REGISTER.md), [research/upi/OPERATOR_EVIDENCE.md](../../../research/upi/OPERATOR_EVIDENCE.md) |

> **Strict layer reminder:** Keep strictly **four** layers (`official`, `industry`, `practitioner`, `atlas`). Academic papers (`arXiv`, journals) belong exclusively under **Layer 4 (`atlas`)** as idea leads for exploring gaps—never under `industry` or `practitioner`.

---

## Diagnostic States & Interventions

### State 1: Adding a new canonical record (`1–5` records max per PR)
**When:** Creating a new entry under `src/content/docs/<product>/`.
1. Search existing records and registers first to deduplicate by underlying mechanism (not surface title).
2. Draft the article using typed YAML frontmatter matching `src/taxonomy.json` and the 8-part layout in `docs/CONTENT_SCHEMA.md` (reference facts first, candidate controls second, plain language, no actionable evasion thresholds).
3. Open **100%** of cited primary sources and create both paired files:
   - `research/evidence/<RECORD-ID>.md` (exact `Claim ID | Layer | Claim | Source | Exact locator | Scope & effective date | Result` pipe table containing every external URL listed in `## References`).
   - `research/attestations/<RECORD-ID>.md` (copied from `docs/ATTESTATION_TEMPLATE.md`).
4. Set `lastSourceCheck: "YYYY-MM-DD"`, set `reviewStage: source-checked` only if **zero** cells contain `PENDING`/`unverified`/`blocked`, and leave `Independent reviewer: PENDING` plus checkboxes `8–10` and `12` unchecked `[ ]`.

### State 2: Updating or refreshing an existing record
**When:** Refreshing stale citations (`> 90` days with `official` layer; `> 180` days otherwise), incorporating new RBI/NPCI circulars, fixing broken links, or promoting `draft` -> `source-checked`.
1. **Never** change `recordId` or URL slug (preserve citation stability).
2. Run `python scripts/verify-citations.py --files <path>` first to isolate stale dates, deprecated routes, and URLs needing browser checks.
3. Re-open primary sources to check for:
   - Amending/superseding RBI Master Directions or NPCI Operating Circulars.
   - Upcoming effective-date transitions turning active (e.g., Jan 1, 2027 Commercial Banks RBC amendment; Apr 1, 2028 Small non-bank PSOs).
   - Redirected or retired portal URLs (replace deprecated routes cleanly across the article, ledger, source register, and glossary).
4. Update prose, `## References`, `research/evidence/<RECORD-ID>.md`, `research/attestations/<RECORD-ID>.md`, and `lastSourceCheck: "YYYY-MM-DD"`. Update `src/content/docs/<product>/sources.md` and `docs/RELEASE_STATUS.md` if source counts or statuses changed.

### State 3: Automated fetch fails (`HTTP 403`/timeout) or hits a JS SPA -> Manual In-Browser ("Computer-Use") Validation
**When:** `scripts/verify-citations.py` places a URL in `Manual browser verification queue` (e.g., `npci.org.in` WAF `HTTP 403`), or an `HTTP 200` response returns an empty JS shell.

Follow the detailed walkthrough in [references/browser-verification-checklist.md](references/browser-verification-checklist.md):
1. **Open the exact URL in a real browser** (for agents: invoke the `browser` subagent or inspect via Chrome DevTools; for human contributors: open cleanly in Chrome/Edge/Firefox).
2. **Catch soft-404s and dead SPA routes:** Never trust a bare HTTP status code. Confirm the visible page title, `<h1>`, and body render actual content instead of an Angular/React `"Page Not Found"` / `"404"` screen. If moved, navigate from the official portal menu to find the live canonical URL.
3. **Inspect interactive widgets & PDFs visually:** Click role tabs/accordions (e.g., NPCI *NPCI / PSP Bank / UPI App* tabs), search official circular indexes by year/keyword, and open official PDF links directly to verify exact circular number, issue date, effective date, addressee/entity scope, clause numbers, and any addendum/deemed-acceptance rules.
4. **Confirm supersession before trusting old claims:** Search RBI Notifications (`rbi.org.in`) and NPCI Circulars (`npci.org.in/circulars/upi`) for amendments dated *after* the cited document. If a vendor blog claims a circular rule that is absent from public indexes (e.g., manual VPA mobile restrictions), keep that assertion strictly labeled `company-reported` in Layer 2.
5. **Log exact provenance cleanly:** Record `browser-checked on <host> YYYY-MM-DD` (plus exact PDF URL, tab name, clause, and publication date) in `research/evidence/<ID>.md`. Never commit downloaded third-party PDFs into the repo (`LICENSE-CODE` / reuse rights).

### State 4: Non-public, member-only, login-walled, or CAPTCHA-gated source -> Honest Stop
**When:** Even a real browser confirms a document is missing from public archives (like `NPCI/2025-26/IS/003`), behind a bank/PSP login portal, gated by CAPTCHA, or paywalled.
1. **Never** bypass login walls, WAF blocks, anti-bot challenges, or CAPTCHAs.
2. Keep the record at `reviewStage: draft` and `Stage: draft`, with `blockerNote` explaining what is missing.
3. Leave a `blocked (...)` row in `research/evidence/<RECORD-ID>.md` and keep Researcher boxes 2 and 4 unchecked (`[ ]`). If reading a third-party mirror temporarily (like a public cooperative bank PDF copy), mark Layer `Official (mirror)` and document why it stays provisional.

---

## How Content Stays Accurate & Most Up to Date (5 Defense Layers)

Contributors and agents maintain quality through five connected layers rather than trusting one script or one pass:

| Layer | Mechanism | What It Prevents | Cadence |
|---|---|---|---|
| **1. Schema & taxonomy lock** | `src/taxonomy.json` + Astro/Zod `src/content.config.ts` | Invented labels, broken filter chips, missing metadata | Every build (`npm run build`) |
| **2. Parity & attestation gate** | `scripts/check-attestations.py` (pre-commit + PR CI) | Unchecked URLs, invalid `lastSourceCheck`, missing ledgers, reviewer self-certification | Every commit & PR |
| **3. Tiered citation & deprecation triage** | `scripts/verify-citations.py` | Soft-404s, retired `/what-we-do/upi/*` URLs, blind `HTTP 403` ignores | Pre-PR & weekly CI |
| **4. Freshness SLA & event triggers** | `90`-day SLA (`official` layer) / `180`-day SLA (non-official) + circular-supersession checks | Quietly outdated regulatory rules or broken vendor links | Weekly Monday CI summary (`.github/workflows/external-links.yml`) + event-driven refreshes |
| **5. Independent Maker–Checker review** | Separate reviewer/audit pass re-opening 100% of Level 1 citations + risk-based technical check | Misread clauses, scope creep across commercial vs. SFB/PB/PSO directions, hallucinated citations | Before promoting `source-checked` -> `reviewed` |

---

## Required Verification Commands (Run After Final Edit)

From `C:\Projects\india-fintech-risk-atlas`:

```powershell
# 1. Structure, frontmatter parity, and date format
python scripts/check-attestations.py --all

# 2. Online citation & deprecation check (queued WAF/SPA URLs print cleanly for browser check)
python scripts/verify-citations.py --files src/content/docs/upi/<changed-file>.md

# 3. Repo-wide offline freshness & ledger parity check
python scripts/verify-citations.py --offline --all

# 4. Production build, Pagefind filters, and Starlight internal link validation
npm run build
```

---

## Anti-Patterns (Never Do These)

- **Self-certifying review:** Never fill `Independent reviewer:` with the authoring agent/person or tick boxes `8–10` or `12` in the same PR.
- **Treating `HTTP 200` as live content:** SPA sites like `npci.org.in` return `HTTP 200` shells for removed URLs—always check DOM text visually in browser mode.
- **Mixing evidence layers:** Never cite `arXiv` papers as Layer 2 (`Industry`) or Layer 3 (`Practitioner`), and never cite a company blog as a binding NPCI/RBI rule.
- **Committing downloaded primary PDFs:** Always cite canonical issuer URLs and paraphrase original summaries rather than mirroring protected files in git.
- **Unbounded diffs:** Keep UI component edits (`src/components/*`) separate from content/evidence updates, and keep PRs to `1–5` related records.
