# Local machine handoff — 2026-11-23

## Where the work is
- Repository: https://github.com/eyeinthesky6/india-fintech-risk-atlas
- Working branch: `release/upi-v1-freeze`
- Consolidation PR: https://github.com/eyeinthesky6/india-fintech-risk-atlas/pull/6
- **Do not use `main` as the latest UPI website state.** The release branch contains the integrated work. It is pushed through the GitHub API; no extra `git push` is needed.

## First-time checkout
```bash
git clone https://github.com/eyeinthesky6/india-fintech-risk-atlas.git
cd india-fintech-risk-atlas
git fetch origin
git switch --track origin/release/upi-v1-freeze
node --version
npm --version
npm install
npm run build
npm run dev
```
Open the localhost URL shown by Astro. If you already cloned the repository: `git fetch origin && git switch release/upi-v1-freeze && git pull --ff-only`. If the local branch doesn't exist, use `git switch --track origin/release/upi-v1-freeze` instead.

## Reproducible dependency installation
The repository has no verified lockfile yet. On a machine with npm registry access, run `npm install`; inspect the build and commit `package-lock.json` to the release branch. Afterward change workflows to `npm ci` only after verifying the lockfile.

## Local hook
On Linux/macOS: `chmod +x .githooks/pre-commit && git config core.hooksPath .githooks`.
On Windows: `git config core.hooksPath .githooks` (requires Git and Python 3 on PATH). Run `python scripts/check-attestations.py --staged` manually if the shell hook does not execute. Hooks are bypassable; CI is the server-side gate.

## Inspect before merging
1. `npm run build` and verify `dist/index.html` and `dist/pagefind`.
2. Check Astro base path `/india-fintech-risk-atlas/`, sidebar links, home page, mobile layout and search.
3. Review `docs/UPI_V1_RELEASE_HANDOFF.md` and `docs/UPI_RELEASE_AUDIT.md`.
4. Source-check all UPI material against current official RBI/NPCI circulars; independently verify claims and attribution. Unchecked attestations must remain unchecked until done.
5. Only then mark PR #6 ready, run required checks and merge. GitHub Pages must be enabled/configured separately.

## Frozen architecture
GitHub Markdown/YAML → Astro/Starlight → Pagefind → GitHub Pages. No scraper, backend, database or runtime AI. Original editorial content CC BY 4.0; original code MIT; third-party sources retain rights.

## Known blockers
- No confirmed production build, due to unavailable npm registry in the remote execution environment.
- No completed independent claim review or current NPCI circular audit.
- No confirmed live Pages deployment.
- Do not merge overlapping PRs #1, #2, #4, #5 separately after the consolidated PR.
