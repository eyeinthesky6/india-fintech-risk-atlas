---
title: Transaction velocity and behavioral anomalies
description: UPI-010 — risk monitoring and false positives
---

**ID:** UPI-010 · **Stage:** Source-checked draft, independent review pending · **Actors:** payments banks (RBI requirement); other participants (illustrative only)

## What this covers
An unusual concentration of transfers or beneficiary additions can be a signal for investigation, especially when considered with customer history and account context. Velocity alone does not prove fraud.

## What the RBI actually says
The RBI's *Payments Banks – Digital Payment Security Controls Directions, 2026* §52 requires payments banks to document configuration requirements for suspicious transactional behaviour, preventive and detective controls, and failed-authentication alerts. §53 identifies transaction velocity, new-account activity, location, IP and behavioural indicators among applicable parameters that **could** be monitored. §55 addresses staff training, including distinguishing false positives. [1]

These provisions apply to **payments banks** under Chapter I §3; they are not automatically requirements for every UPI app, merchant or PSP.

## Suggested practitioner considerations (not mandated thresholds)
Compare transaction frequency, value and counterparties with a suitable customer baseline. Consider data availability, privacy, alert review and customer impact. Avoid publishing universal numerical limits.

## Legitimate lookalikes
Merchants, community collections, salary-related transfers, festivals, new customers and shared-expense activity may produce similar patterns.

## References
1. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), Chapter I §3 and Chapter III §§52–55, updated 1 October 2026. Primary source checked 21 November 2026. Independent reviewer pending.
