# Historical Audit & Deprecated Pre-Consolidation Archive

These files are preserved strictly for historical audit trail and point-in-time commit inspection.

The active living specifications—including **Product Architecture**, **International Reference Architectures**, **Discovery Playbook & Search Recipes**, **Contributor Workflow (Hard vs Soft Gates)**, **Data Model**, and **Site Blueprint**—have been **restored to the main [docs/](../) directory** as active reference specifications.

## Preserved Historical Snapshots in this Archive

| Archived File | Nature of Content | Why It Remains Archived | Active Living Equivalent |
|---|---|---|---|
| `UPI_RELEASE_AUDIT.md` | Historical audit snapshot (Nov 23 morning) | Recorded earlier counts (10 source-checked / 7 blocked by NPCI WAF) that are now superseded | [docs/RELEASE_STATUS.md](../RELEASE_STATUS.md) |
| `BUILD_VALIDATION_FINDINGS.md` | Point-in-time CI run logs (Nov 23) | Fixed build logs from early branch setup | [docs/RELEASE_STATUS.md](../RELEASE_STATUS.md) |
| `UPI_COVERAGE_AND_GAPS.md` | Static draft tracking table | Superseded by dynamic coverage table | [src/content/docs/upi/coverage.mdx](../../src/content/docs/upi/coverage.mdx) |
| `UPI_V1_RELEASE_HANDOFF.md` | Point-in-time handoff memo | Superseded by PR #6 release status | [docs/RELEASE_STATUS.md](../RELEASE_STATUS.md) |
| `LOCAL_MACHINE_HANDOFF.md` | Early command scratchpad | Consolidated into repository root | [README.md](../../README.md) |
| `FOUR_LAYER_CONTENT_SCHEMA.md` | Early 4-layer schema draft | Upgraded to 5 frozen evidence layers | [docs/CONTENT_SCHEMA.md](../CONTENT_SCHEMA.md) |

## Restored Active Living Specifications in [docs/](../)

- [docs/PRODUCT_ARCHITECTURE.md](../PRODUCT_ARCHITECTURE.md) — 5 user personas, canonical entities, cross-product ID reuse (`PAT-*`, `CTRL-*`), P0/P1/P2 facets.
- [docs/ARCHITECTURE_RESEARCH.md](../ARCHITECTURE_RESEARCH.md) — Reference architectures (Sigma, MITRE ATT&CK, OpenCTI, AUSTRAC), synthetic scale targets (500, 2k, 5k pages).
- [docs/RESEARCH_DISCOVERY_PLAN.md](../RESEARCH_DISCOVERY_PLAN.md) — Regulator map, battle-tested search query recipes, 10-step synthesis pipeline.
- [docs/SECTION_WORKFLOW.md](../SECTION_WORKFLOW.md) — Single work unit per PR, Hard vs. Soft gates, agent contract.
- [docs/SITE_BLUEPRINT.md](../SITE_BLUEPRINT.md) — GitHub Pages configuration, performance limits, template separation.
- [docs/DATA_MODEL.md](../DATA_MODEL.md) — Controlled vocabularies, entity relationships, frontmatter schema.
- [docs/FINAL_CONTENT_ARCHITECTURE.md](../FINAL_CONTENT_ARCHITECTURE.md) — GitHub as source of truth, Starlight rendering, maintained-vs-generated separation.
