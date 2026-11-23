---
title: UPI — fraud and risk atlas
description: Product overview, candidate controls and operational failure patterns across India's UPI ecosystem.
---

UPI is India's instant interbank payment system operated by NPCI and used across remitter banks, beneficiary/acquiring banks, PSP banks, third-party app providers (TPAPs), payment aggregators (PAs), and merchants. Responsibilities, telemetry, and legal obligations differ sharply across each participant role.

## Practical risk engineering

- [UPI risk-stack design and validation](/india-fintech-risk-atlas/upi/risk-stack-playbook/) — end-to-end lifecycle controls, investigation triage, customer-impact safeguards, and feedback loops
- [Operator practices and evidence](/india-fintech-risk-atlas/upi/operator-insights/) — Razorpay, Cashfree, Stripe (method analogy), and empirical `arXiv` studies (`RBIH NFPC`, `GPay`, `OCBC`)
- [UPI source register](/india-fintech-risk-atlas/upi/sources/) — verified RBI directions, NPCI circular status, and research citations
- [UPI glossary](/india-fintech-risk-atlas/upi/glossary/) — participant roles, regulatory terms, and operational distinctions
- [Coverage and review status](/india-fintech-risk-atlas/upi/coverage/) — explicit source-access status and release blockers
- [Evidence and attribution policy](/india-fintech-risk-atlas/evidence-policy/) — four-layer evidence model

## Topic catalogue (17 UPI records)

All 17 records remain **unpublished drafts awaiting independent second-reviewer verification**. Records marked `Source-checked draft` have all cited primary RBI/industry/research URLs directly opened and verified on 2026-11-23; records marked `Draft (NPCI 403 blocker)` rely partly on `npci.org.in` pages blocked by `HTTP 403 Forbidden` or third-party circular mirrors awaiting direct NPCI confirmation.

### Overview & ecosystem
| ID | Record | Theme | Verification status |
| --- | --- | --- | --- |
| `UPI-OVERVIEW` | [UPI ecosystem and participant roles](./upi-ecosystem/) | System explainer | Draft (`npci.org.in` 403 blocker; independent review pending) |

### Social engineering & scams
| ID | Record | Theme | Verification status |
| --- | --- | --- | --- |
| `UPI-004` | [Collect-request deception](./collect-request-deception/) | Social engineering | Draft (`npci.org.in` 403 / provisional P2P mirror; independent review pending) |
| `UPI-006` | [QR and fake cashback deception](./qr-cashback-deception/) | Social engineering | Draft (`npci.org.in` 403 blocker; independent review pending) |
| `UPI-007` | [Fake support and grievance impersonation](./fake-support-impersonation/) | Social engineering | Draft (`npci.org.in` 403 blocker; independent review pending) |

### Identity, access & authentication
| ID | Record | Theme | Verification status |
| --- | --- | --- | --- |
| `UPI-003` | [Account takeover and device-binding risk](./account-takeover/) | Identity & access | Source-checked draft (independent review pending) |
| `UPI-008` | [Untrusted app and remote-access risk](./untrusted-app-access/) | Device & app integrity | Draft (`npci.org.in` 403 / provisional mobile security mirror; independent review pending) |
| `UPI-009` | [Authentication and payment authorization](./authentication-context/) | Preventive control | Source-checked draft (independent review pending) |
| `UPI-011` | [Repeated failed authentication attempts](./failed-authentication/) | Detective control | Source-checked draft (independent review pending) |

### Monitoring, mules & merchants
| ID | Record | Theme | Verification status |
| --- | --- | --- | --- |
| `UPI-001` | [Unusual outbound payment velocity](./unusual-outbound-velocity/) | Behavioral burst signal | Source-checked draft (independent review pending) |
| `UPI-010` | [Transaction velocity and EFRM monitoring](./transaction-velocity/) | Program-level monitoring | Source-checked draft (independent review pending) |
| `UPI-002` | [Potential mule-account funnel](./mule-account-funnel/) | Fund-flow & AML pattern | Source-checked draft (independent review pending) |
| `UPI-012` | [Merchant onboarding and classification](./merchant-onboarding/) | Merchant & PA risk | Source-checked draft (independent review pending) |

### Reconciliation, disputes & protection
| ID | Record | Theme | Verification status |
| --- | --- | --- | --- |
| `UPI-005` | [Payment status and order reconciliation](./payment-status-reconciliation/) | Merchant/PA integration | Source-checked draft (independent review pending) |
| `UPI-014` | [Settlement and reconciliation exceptions](./settlement-exceptions/) | Interbank/scheme ops | Draft (`npci.org.in` 403 on settlement doc; RBI TAT checked; independent review pending) |
| `UPI-013` | [UPI dispute and complaint routing](./dispute-routing/) | Recovery & ODR | Draft (`npci.org.in` 403 on FAQs; RBI ODR/PA checked; independent review pending) |
| `UPI-015` | [Unauthorized & fraudulent EBT protection](./customer-liability/) | Customer protection | Source-checked draft (independent review pending) |

### Policy & consultation
| ID | Record | Theme | Verification status |
| --- | --- | --- | --- |
| `UPI-016` | [Digital payment safeguards under discussion](./risk-discussion/) | RBI consultation paper | Source-checked draft (independent review pending) |

**Release notice:** Do not treat draft or source-checked entries as independently reviewed compliance advice or universal rules. See [Methodology](/india-fintech-risk-atlas/methodology/).
