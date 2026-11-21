---
title: Settlement and reconciliation exceptions
description: UPI-014 — payment operations and dispute processing
---

**ID:** UPI-014 · **Stage:** Source-checked draft, independent review pending · **Actors:** UPI scheme participants

## What this covers
A payment's user-visible status, the payer's account posting, a merchant's order matching and interparticipant settlement are related but distinct records. A discrepancy should be investigated using the transaction reference and relevant participant records.

## What the source establishes
NPCI's *UPI Settlement Process*, §4, describes exception transactions as unreconciled and/or disputed by customers or members. Its dispute lifecycle depicts remitting-bank, NPCI back-office and beneficiary-bank interactions. The document expressly warns that dispute/adjustment turnaround times may be changed through subsequent operating circulars. [1]

## Candidate operational checks
Keep transaction references consistent, reconcile records, distinguish pending/failed/success statuses, investigate unmatched transactions and maintain a traceable dispute case. These are operational suggestions, not a universal statutory checklist.

## Legitimate lookalikes and limitations
Asynchronous merchant callbacks, delayed notifications and order-reference mismatches can produce temporary discrepancies. Do not equate an unmatched merchant order with money lost or a fraud event.

## References
1. NPCI, [UPI Settlement Process](https://www.npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf), §4, accessed 21 November 2026. **Current operating-circular TAT audit pending**; no specific reversal deadline asserted.
