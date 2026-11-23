# Browser Computer-Use Verification Checklist

Use this checklist whenever `scripts/verify-citations.py` places URLs in `Manual browser verification queue`, returns JS SPA shells, or when auditing RBI/NPCI regulatory updates directly.

## 1. Pre-flight check
- [ ] Run `python scripts/verify-citations.py --files <changed-article.md>` (or `--offline --all`) to identify every URL flagged `NEEDS_BROWSER_FALLBACK` or `BROKEN_OR_DEPRECATED`.
- [ ] Confirm you are not asked to log in, pay, or solve a CAPTCHA/anti-bot check. (If a login wall or CAPTCHA blocks public access, stop and log `blocked (...)`—never bypass it.)

## 2. Live DOM & Soft-404 inspection
- [ ] Open the exact cited URL in a live browser (`browser` subagent / Chrome DevTools / desktop browser).
- [ ] Verify the **rendered `<title>`, visible `<h1>`, and main body** load real scheme/regulatory content—not a blank container, generic `"Page Not Found"`, or redirected marketing homepage.
- [ ] Check the final browser address bar URL: if the site redirected cleanly to a new canonical path (for example `/product/upi/about-upi` instead of legacy `/what-we-do/upi/product-overview`), update the article, `## References`, `research/evidence/<ID>.md`, and `PRIMARY_SOURCE_REGISTER.md` to the new canonical URL.

## 3. Interactive UI & PDF extraction
- [ ] Expand relevant tabs/accordions (e.g., on `npci.org.in/product/upi/roles-responsibilities`, check all three tabs: **NPCI**, **PSP Bank**, **UPI App**).
- [ ] When a page links to an official circular/settlement PDF:
  - [ ] Open the PDF in-browser and inspect page 1 + relevant clauses visually.
  - [ ] Capture exact **circular/notification ID**, **issue date**, **effective date** (including rescheduled dates or phased rollouts), **addressees/entity scope** (e.g., Commercial Banks vs. PBs vs. SFBs vs. non-bank PSOs vs. PAs vs. TPAPs), **exact section/page**, and **expiry/deemed-acceptance rules**.
  - [ ] Note whether an explanatory PDF is **undated** (for example `UPI_Settlement_Process_256f73e1df.pdf`) and pair it with recent operating circulars where timelines changed (e.g., `NPCI/UPI/OC No. 235/2026-27` cutting URCS TAT from 35 to 15 days).

## 4. Supersession & search verification (keeping content up to date)
- [ ] On **NPCI** (`https://www.npci.org.in/circulars/upi` and `/circulars/others`): sort or filter recent circulars (2025–current year) for keywords tied to your topic (`Collect`, `Dispute`, `Settlement`, `TAT`, `UDIR`, `Security`, `VPA`, `Mandate`) to check for addenda or superseding dates.
- [ ] On **RBI** (`https://www.rbi.org.in/`): check Master Directions `Update` dates (e.g., Oct 1, 2026 / Nov 11, 2026 consolidation updates) and cross-check linked Notifications (`NotificationUser.aspx?Id=...`) for amendments taking effect in upcoming quarters (e.g., Jan 1, 2027; Apr 1, 2028).
- [ ] Check whether any secondary vendor claim (e.g., Razorpay's Feb 2026 mobile VPA blog note) has a matching official circular in the public index. If none appears, state that explicitly and keep it scoped as `company-reported`.

## 5. Mirror vs. Official decision rule

| What the browser showed | Required `Layer` & `Result` in `research/evidence/<ID>.md` | Allowed `reviewStage` |
|---|---|---|
| Official URL/PDF opened directly on issuer domain (`rbi.org.in`, `npci.org.in`, `pib.gov.in`, `arxiv.org`, vendor docs) and supports the claim | Original layer (`Official` / `Industry` / `Atlas (research ref)`); `supported (browser checked on <host> YYYY-MM-DD; independent review pending)` | `source-checked` (if **zero** blocked/PENDING rows remain) |
| Official page confirms advisory text, **except** referenced circular does not appear publicly on `npci.org.in/circulars/*` (relies on third-party bank mirror) | `Official (mirror)`; `blocked (not publicly listed on <host> YYYY-MM-DD; provisional third-party mirror visually read)` | **`draft` only** (`blockerNote` required) |
| Source requires login, member portal, paywall, or CAPTCHA | `Official` (or applicable layer); `blocked (<exact barrier> on YYYY-MM-DD)` | **`draft` only** (`blockerNote` required) |

## 6. Post-check updates & hygiene
- [ ] Update `lastSourceCheck: "YYYY-MM-DD"` in article frontmatter (`90`-day refresh SLA when `official` is in `evidenceLayers`; `180`-day SLA otherwise).
- [ ] Ensure every `https://...` URL inside `## References` appears verbatim in `research/evidence/<ID>.md`.
- [ ] Run `python scripts/check-attestations.py --all`, `python scripts/verify-citations.py --files <file>`, and `npm run build` before committing.
- [ ] Leave `Independent reviewer: PENDING` and checkboxes `8–10` and `12` unchecked `[ ]` unless you are executing an independent second-reviewer audit pass.
