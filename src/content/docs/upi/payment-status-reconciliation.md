---
title: Payment status and reconciliation discrepancies
description: UPI-005 — operational risk and customer experience.
---

**ID:** UPI-005 · **Type:** Operational failure · **Basis:** Illustrative practice · **Status:** Research preview

## Pattern
A payment may appear successful to a payer while the merchant has not yet matched it to an order. Status display, merchant callbacks, bank ledger entries and settlement are distinct concepts.

## Candidate checks
Use transaction references, idempotent processing, reconciliation reports and exception queues as appropriate. Do not assume an unmatched order means money was lost.

## False positives
Delayed notifications, temporary network issues, mismatched order references and asynchronous processing.

## References
1. [NPCI UPI product overview](https://www.npci.org.in/what-we-do/upi/product-overview) — system background; dispute/reversal circular verification pending.
