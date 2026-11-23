# India Fintech Risk Atlas

An open, source-cited reference to fraud patterns, risk checks and operational failure modes across Indian financial products.

**Purpose:** practitioner education, product design and independent research. **Not:** legal advice, an exhaustive compliance checklist, or production-ready fraud detection rules.

## Finalized hosting
GitHub Pages hosts the static site built with Astro + Starlight + Pagefind via GitHub Actions. No separate host, backend, database or domain. Planned URL: https://eyeinthesky6.github.io/india-fintech-risk-atlas/ (not live until deployed). See [architecture freeze](docs/ARCHITECTURE_FREEZE.md) and [site blueprint](docs/SITE_BLUEPRINT.md).

## Start here
- [Architecture freeze](docs/ARCHITECTURE_FREEZE.md)
- [Research and verification protocol](docs/RESEARCH_PROTOCOL.md)
- [UPI documentation entry point](src/content/docs/upi/index.md)
- [Data model](docs/DATA_MODEL.md)

## Editorial rules
Every material claim has a source or is labeled an opinion/hypothesis. A rule is only mandatory when a current primary source supports its applicability to the named entity. Avoid sensitive operational thresholds and evasion instructions. New contributions require review.

## Current state
UPI v1 release candidate (`release/upi-v1-freeze`): Astro/Starlight/Pagefind static build is validated, 10 UPI entries are source-checked against directly opened RBI/industry/research originals, and 7 entries remain `draft` pending direct `npci.org.in` circular access (`HTTP 403` blocker). All 17 entries remain **unpublished drafts awaiting independent second-reviewer verification**, and the repository is not yet deployed to GitHub Pages.


## Frozen v1 direction
This is a **fraud, AML and risk-engineering compendium**, not a regulatory digest. See [Architecture Freeze](docs/ARCHITECTURE_FREEZE.md), [UPI Release Audit](docs/UPI_RELEASE_AUDIT.md), [Operator Intelligence](docs/OPERATOR_INTELLIGENCE.md) and [Four-Layer Evidence Model](docs/FOUR_LAYER_CONTENT_SCHEMA.md).

**Licenses:** original editorial content CC BY 4.0; original website code MIT; third-party sources retain their rights. [Full terms](LICENSE.md).

**Release state:** the UPI research collection and site are not independently verified or deployed. Do not mark the project complete solely because draft pages exist.
