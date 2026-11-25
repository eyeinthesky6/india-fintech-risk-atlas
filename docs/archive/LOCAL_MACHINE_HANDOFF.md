# Local machine handoff — updated 2026-11-23

## Where the work is
- Repository: https://github.com/eyeinthesky6/india-fintech-risk-atlas
- Local checkout: `.` (repository root)
- Working branch: `release/upi-v1-freeze` (synced cleanly with `main`)
- Consolidation PR: https://github.com/eyeinthesky6/india-fintech-risk-atlas/pull/6

## Verified local commands
```powershell
# From repository root:
git config core.hooksPath .githooks
npm ci --no-audit --no-fund
python scripts/check-attestations.py --all
npm run build
npx astro preview --host 127.0.0.1 --port 4321
```
Open `http://127.0.0.1:4321/india-fintech-risk-atlas/` to inspect locally. Note that `.githooks/pre-commit` automatically picks `python3` or `python` (`>= 3.8`) so Windows `WindowsApps\python3.exe` stubs do not break commits.

## What was verified on 2026-11-23
- `package-lock.json` generated and verified via `npm ci --no-audit --no-fund`.
- `npm run build` succeeded cleanly (`29` pages, `Pagefind v1.6.0` indexed `28` pages, `0` broken internal links).
- Live `astro preview` verified across desktop (`1280×800`), mobile (`375×812`, `0` horizontal overflow), Pagefind search (`"mule"`, `"13624"`, `"reconciliation"`), and `/india-fintech-risk-atlas/` base paths.
- 10 UPI records `source-checked` against directly opened RBI/GoI/industry/`arXiv` documents; 7 UPI records remain `draft` due to `www.npci.org.in` returning `HTTP 403 Forbidden`.

## Remaining owner actions before launch
1. Complete independent second-reviewer verification across `research/evidence/<ID>.md` and `research/attestations/<ID>.md`.
2. Verify blocked `npci.org.in` pages/circulars in an authorized browser session.
3. Configure GitHub branch protection (`Validate site`, `Content attestation`) and GitHub Pages (`GitHub Actions` source) once ready to make the repository public and merge PR #6.
4. Close overlapping PRs #1, #2, #4, #5 without merging separately.
