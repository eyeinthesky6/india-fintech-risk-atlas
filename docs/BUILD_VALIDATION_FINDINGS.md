# Build validation findings — 2026-11-23

## Verified structural defect and fix
The original scaffold lacked `src/content.config.ts`, which Starlight's manual setup requires to register the docs collection. Added the documented `docsLoader` and `docsSchema` configuration. Official reference: https://starlight.astro.build/manual-setup/

## Runtime limitation
Node 22 and npm 10 are present in the working environment, but npm registry access failed with DNS `EAI_AGAIN` on 2026-11-23. Therefore a real install/build and package-lock generation were **not** completed. Do not label the build passing.

## CI validation plan
The pull-request workflow must install dependencies and run `npm run build`, then confirm `dist/index.html` and `dist/pagefind`. The GitHub Pages deployment workflow runs only after merge to main and after Pages is configured. The first successful build should commit a lockfile and switch to `npm ci` for reproducibility.

## Editorial blocker
Current UPI pages are explicitly research drafts. A working website build does not authorize publishing them as independently verified. Independent claim-level review and NPCI circular currency checks remain outstanding.

## Source retrieval recheck — 2026-11-23
Direct inspection attempts through the available public retrieval service did not yield substantive RBI/NPCI page text: the RBI directions URL returned a cache miss; NPCI FAQ and fraud-awareness pages returned JavaScript-only shells. Therefore **do not claim that these pages were freshly re-verified in this pass**. A separate reviewer must obtain the original document text through official downloadable documents, accessible published circulars, or an authorized browser and record exact provisions. This is a source-access blocker, not evidence that the underlying sources are incorrect.
