> **Active Reference Specification:** Living contributor and agent workflow guide aligned with [RESEARCH_PROTOCOL.md](RESEARCH_PROTOCOL.md). Enforces the single-work-unit PR rule, the Hard vs. Soft gates distinction, and local verification checks.

# Section-by-section agent workflow (v1)

# Section-by-section agent workflow (v1)

**Goal:** one bounded research unit per PR. Never ask one agent to complete a product category in a single pass.

## Smallest work unit
One product + one topic/record, or at most five closely related records. Start with an inventory and stop after one unit. Stages: **discover → extract → draft → source-check → independent review → publish**. A draft may stop at any stage; it must be labeled accurately.

## Agent contract
1. Read `docs/RESEARCH_PROTOCOL.md`, `docs/DATA_MODEL.md`, and this document.
2. Identify the exact unit and scope, duplicate records, actor types and exclusions.
3. Search original RBI/NPCI/relevant regulator documents first; collect technical and operator references second. Record URL, exact passage, document version, applicability and retrieval date.
4. Write atomic claims with source locators in `research/evidence/<record-id>.md`. Do not claim verification from a search-result snippet.
5. Draft one record; explain counterexamples, limitations and data access constraints.
6. Create `research/attestations/<record-id>.md` from the template. Check only steps actually completed. **Unchecked boxes are permitted for draft work**; do not falsely check a box to pass a gate.
7. Separate reviewer reopens primary sources, records discrepancies and signs the independent review item. Researcher must not self-certify review.
8. Open PR with the checklist. Stop and report blockers. Never merge autonomously.

## Hard versus soft gates
**Hard (machine-verifiable):** attestation exists for changed published-content records, required checklist sections are present, no contradictory 'reviewed' declaration with incomplete checks, basic source URL and evidence locator format, and build smoke tests when website code changes.
**Soft (human evidence review):** whether the source supports the claim, is current, is correctly scoped and independently corroborated. No script can prove this.

## Local setup (once per clone)
Run `git config core.hooksPath .githooks`. Git does **not** automatically install repository hooks. The pre-commit hook checks staged content and calls the same validator used by CI. Hooks can be bypassed with `--no-verify`; branch protection and CI must be enabled to prevent bypass through GitHub web/API commits.

## Publication policy
Draft work can merge only to a non-published research area or remain in a draft PR. Content promoted to `reviewed` or `published` requires every checklist item complete, evidence ledger, distinct named reviewer and human merge approval. Do not automatically publish draft research pages.

## Current source scope
Before research, read `docs/ARCHITECTURE_FREEZE.md`, `docs/OPERATOR_INTELLIGENCE.md`, `docs/EVIDENCE_LAYERS_AND_RIGHTS.md` and `docs/FOUR_LAYER_CONTENT_SCHEMA.md`. Collect official, industry, practitioner and Atlas-interpretation evidence separately. A draft may be incomplete; never self-certify independent verification.
