> **Active Reference Specification:** Living contributor and agent workflow guide aligned with [RESEARCH_PROTOCOL.md](RESEARCH_PROTOCOL.md). Enforces the single-work-unit PR rule, the Hard vs. Soft gates distinction, and local verification checks.

# Section-by-section agent workflow (v1)

**Goal:** one bounded research unit per PR. Never ask one agent to complete a product category in a single pass.

## Smallest work unit
One product + one topic/record, or at most five closely related records. Start with an inventory and stop after one unit. Stages: **discover → extract → draft → source-check → independent review → publish**. A draft may stop at any stage; it must be labeled accurately.

## Agent contract
1. Read `AGENTS.md`, `docs/RESEARCH_PROTOCOL.md`, `docs/DATA_MODEL.md`, `docs/CONTENT_SCHEMA.md`, and this document.
2. Identify the exact unit and scope, duplicate records, actor types and exclusions.
3. Search original RBI/NPCI/relevant regulator documents first; collect technical and operator references second. Record URL, exact passage, document version, applicability and retrieval date.
4. Write atomic claims with source locators in `research/evidence/<record-id>.md`. Do not claim verification from a search-result snippet.
5. Draft one record in the Ready-Reckoner 6-part layout; explain counterexamples, limitations and data access constraints.
6. Create `research/attestations/<record-id>.md` from the template. Check only steps actually completed. **Unchecked boxes are permitted for draft work**; do not falsely check a box to pass a gate.
7. Separate reviewer reopens primary sources, records discrepancies and signs the independent review item. Researcher must not self-certify review.
8. Open PR with the checklist. Stop and report blockers. Never merge autonomously.

## Hard versus soft gates
- **Hard (machine-verifiable):** Attestation exists for changed published-content records (`scripts/check-attestations.py`), required checklist sections are present, frontmatter passes Zod schema (`src/taxonomy.json`), double-ledger reference URL parity is confirmed, and build/link checks pass (`npm run build`).
- **Soft (human evidence review):** Whether the source supports the claim in context, is current, is correctly scoped by entity license, and is independently corroborated. No automated script can prove this.

## Local setup and verification tooling
Run once per fresh clone:
```powershell
# 1. Enable git pre-commit hook
git config core.hooksPath .githooks

# 2. Verify attestations and ledger parity
python scripts/check-attestations.py --all

# 3. Verify citation freshness & offline queues
python scripts/verify-citations.py --offline --all

# 4. Check for newly gazetted regulator circulars
python scripts/watch-regulators.py

# 5. Run MCP integration tests, fast-check property tests & dataset audit
npm test

# 6. Build static site, sync MCP/llms.txt datasets & validate all links
npm run build
```

## Publication policy
The Atlas is a public research reference. Draft and source-checked records may appear in the site, search and machine exports with their review stage and source blockers. Keep provisional claims labeled alongside their citations and outside compliance checklists. The five evidence layers distinguish attributed material from Atlas suggestions.

The public **Human checked** label requires the existing `reviewed` or `published` stage, a complete evidence ledger and checklist, an attestation by a distinct human reviewer, and human merge approval. Use a stable reviewer identifier in the attestation and keep the link to the person's identity with maintainers. The site and exports show the status without a reviewer name. Readers should consult the original source for authoritative wording and applicability.

## Current source scope
Before research, read `docs/ARCHITECTURE_FREEZE.md`, `docs/OPERATOR_INTELLIGENCE.md`, `docs/EVIDENCE_LAYERS_AND_RIGHTS.md`, and `docs/CONTENT_SCHEMA.md`. Collect strictly across the 5 frozen evidence layers (`Regulatory`, `Industry practice`, `Community insight`, `Research & academic`, and `Atlas guidance`). A draft may be incomplete; never self-certify independent verification.
