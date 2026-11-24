# India Fintech Risk Atlas — Agent Instructions & Contributor Router

Welcome, agent. This document governs how AI coding assistants (Antigravity, Claude Code, Codex, Cursor, GitHub Copilot) and human contributors work in this repository.

**Mission:** Build an open, source-cited **reference platform first**—with candidate solutions to operational gaps second—covering fraud patterns, risk checks, and operational failures in Indian financial products.

---

## 1. Governing Specifications & Document Map

Before drafting, editing, or validating content, read the canonical living specifications directly:

| Area | Living Document (Single Source of Truth) |
|---|---|
| **Supreme Governance & Freeze** | [docs/ARCHITECTURE_FREEZE.md](docs/ARCHITECTURE_FREEZE.md) — Tech stack, licensing (CC BY 4.0 / MIT), scope boundaries. |
| **Product Design & Personas** | [docs/PRODUCT_ARCHITECTURE.md](docs/PRODUCT_ARCHITECTURE.md) — 5 user personas, canonical entity models, cross-product ID reuse (`PAT-*`, `CTRL-*`). |
| **Content Schema & Layout** | [docs/CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md) & [src/taxonomy.json](src/taxonomy.json) — Frontmatter rules, strictly 5 evidence layers, Ready-Reckoner layout. |
| **Data Model & Vocabularies** | [docs/DATA_MODEL.md](docs/DATA_MODEL.md) — Controlled taxonomies for products, lifecycles, actors, and record types. |
| **Evidence & Research Protocol** | [docs/RESEARCH_PROTOCOL.md](docs/RESEARCH_PROTOCOL.md) — 12-rule evidence integrity protocol, entity-scope boundaries. |
| **Source Discovery & Search** | [docs/RESEARCH_DISCOVERY_PLAN.md](docs/RESEARCH_DISCOVERY_PLAN.md) — Official source map, search query recipes, 10-step synthesis pipeline. |
| **Contributor Workflow & Gates** | [docs/SECTION_WORKFLOW.md](docs/SECTION_WORKFLOW.md) — Single-work-unit rule, Hard vs. Soft gates, agent contract. |
| **Website Blueprint & Routing** | [docs/SITE_BLUEPRINT.md](docs/SITE_BLUEPRINT.md) — GitHub Pages configuration, `/india-fintech-risk-atlas/` base path. |
| **Browser Verification Skill** | [.agents/skills/atlas-content-update/SKILL.md](.agents/skills/atlas-content-update/SKILL.md) — In-browser computer-use verification for WAF/Cloudflare/SPA pages. |
| **Release Status & Audit** | [docs/RELEASE_STATUS.md](docs/RELEASE_STATUS.md) — Live audit of the 17 UPI topic records, PR #6 readiness, and blockers. |

---

## 2. Hard Invariants for All Agents

1. **One Bounded Work Unit per PR:**
   - Never attempt to rewrite an entire product suite in a single pass.
   - Max 1 product + 1 topic record (or up to 5 closely related records) per PR.
2. **Strictly 5 Evidence Layers:**
   - Every claim must map to: `Regulatory` (`official`), `Industry practice` (`industry`), `Community insight` (`practitioner`), `Research & academic` (`research`), or `Atlas guidance` (`atlas`).
   - Academic papers (`arXiv`, journals) belong **exclusively** under `Research & academic` with sample caveats—never under `industry` or `practitioner`.
3. **Additive Updates (Zero Silent Deletion):**
   - Regular updates must be additive. Never wipe or dilute existing candidate controls, failure modes, or watch-outs without documented evidence.
   - Minor circular amendments/addendums update the row or note; major consolidations mark prior sources `superseded` while preserving historical audit trails in `research/evidence/<ID>.md`.
4. **Double-Ledger Parity:**
   - Every canonical record in `src/content/docs/upi/<ID>.md` must have matching entries in:
     - `research/evidence/<ID>.md` (claim-by-claim assertion ledger)
     - `research/attestations/<ID>.md` (12-item declaration)
   - Every external URL in `## References and review history` must exist as an assertion locator in `research/evidence/<ID>.md`.
5. **Hard Gates vs. Soft Gates (No Agent Self-Certification):**
   - **Hard Gates (Machine-verifiable):** Python scripts and CI build tools enforce syntax, Zod schema, attestation format, link validity, and freshness SLAs.
   - **Soft Gates (Human domain review):** Verifying whether the circular supports the claim in context requires an independent human reviewer.
   - **STRICT RULE:** An authoring or audit agent **CAN NEVER** tick the independent reviewer boxes (`8–10, 12` in attestations) or self-certify review.
6. **Git Identity:**
   - Git author and committer must resolve to `Jai <95236332+eyeinthesky6@users.noreply.github.com>`.

---

## 3. Essential Commands & Verification Scripts

Always run these commands before submitting changes:

```powershell
# 1. Ensure git pre-commit hook is active
git config core.hooksPath .githooks

# 2. Verify attestation ledgers and stage parity
python scripts/check-attestations.py --all

# 3. Verify citation freshness, deprecations, and offline queue
python scripts/verify-citations.py --offline --all

# 4. Run daily regulatory feed watcher (RBI / PIB RSS)
python scripts/watch-regulators.py

# 5. Build static site & validate all internal links and Pagefind filters
npm run build

# 6. Preview site locally (subpath: /india-fintech-risk-atlas/)
npx astro preview --host 127.0.0.1 --port 4321
```

---

## 4. Ready-Reckoner Article Structure

All topic records follow the 6-part Ready-Reckoner layout:

1. `## What it is` (Plain-English mechanism and telemetry breakdown)
2. `## Impact` (Customer, Bank/PSP, and ecosystem consequences)
3. `## Common patterns` (Real-world scenario variants and operational triggers)
4. `## What to do` (3-column table: `Basis` | `Owner` | `Action` with `<a href="#ref-N">[N]</a>` citation anchors)
5. `## Watch-outs and validation` (Legitimate lookalikes, false-positive risks, signals needed, and staging test methods)
6. `## References and review history` (Numbered citations with dates, entity-scope caveats, and reviewer status)
