---
title: Contribute
---

Corrections, original case studies, and new risk patterns are welcome after the repository is public.

## Report a factual error or outdated source (no PR needed)

1. Click **Report a factual error** in the disclaimer at the bottom of any page. This opens the pre-filled [`factual-correction`](https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=factual-correction.yml) GitHub issue form with the page title and URL already populated.
2. Specify which claim, entity scope, effective date, or source link is wrong or superseded, and paste the primary RBI, NPCI, statutory, or operator URL supporting the correction.
3. Maintainers verify the primary source, update the record and evidence ledger, and log the change under independent review.

## Submit a fix or new record (Pull Request)

1. Click **Edit page** at the bottom of a record (or fork and branch the repository) to propose changes directly.
2. Follow the [content schema](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/main/docs/CONTENT_SCHEMA.md), [research protocol](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/main/docs/RESEARCH_PROTOCOL.md), and [content update & browser verification skill](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/main/.agents/skills/atlas-content-update/SKILL.md).
3. Update original writing in Ready-Reckoner format, `research/evidence/<RECORD-ID>.md`, and `research/attestations/<RECORD-ID>.md` with verified primary links (use manual browser checks when automated HTTP hits WAF/SPA portals, and run `scripts/verify-citations.py` and `scripts/check-attestations.py` before opening the PR).
4. An independent reviewer (distinct from the author) checks each regulatory claim, entity scope, effective date, counterexamples, and citation.

Contributors should not modify the site UI in content-only pull requests.
