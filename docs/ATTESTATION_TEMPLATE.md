# Evidence attestation — RECORD-ID

Record: RECORD-ID
Researcher: PENDING
Independent reviewer: PENDING
Reviewed content SHA-256: PENDING
Stage: draft
Evidence ledger: research/evidence/RECORD-ID.md

## Researcher declarations
- [ ] Scope and duplicate search completed
- [ ] Original primary sources opened (not just snippets)
- [ ] Every material claim has a precise source locator or is labeled hypothesis
- [ ] Regulator, actor, effective date and supersession checked where relevant
- [ ] Technical claims cross-checked where feasible; limitations documented
- [ ] False positives, customer impact and privacy considered
- [ ] Original wording and source attribution checked

## Independent reviewer declarations
- [ ] Different reviewer reopened the original sources
- [ ] Unsupported or conflicting claims resolved or blocked
- [ ] Reviewer recorded outcomes in the evidence ledger

## Release declarations
- [ ] Metadata, IDs, references and internal links checked
- [ ] Article is ready for publication, with no unresolved material evidence gaps

## Notes and open blockers
PENDING

**Important:** Check a box only after performing the corresponding step. Draft work may retain unchecked items. Reviewed and published stages require all boxes and a stable independent reviewer identifier recorded with maintainers. Use the same opaque identifier in the attestation and evidence ledger, in the format `reviewer-` followed by 12 lowercase hexadecimal characters. Leave `Independent reviewer: PENDING` until the reviewer completes the check. Public pages and exports display the review status.

After checking the final article and evidence ledger, the reviewer records the output of `python scripts/check-attestations.py --review-fingerprint RECORD-ID` in `Reviewed content SHA-256`. Keep it `PENDING` while the independent review is open. A change to the article or evidence ledger requires a new check before it can carry the **Human checked** label.
