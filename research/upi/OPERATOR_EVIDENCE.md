# Operator evidence ledger — UPI v1

**Status:** initial source verification; independent review pending. **Checked:** 2026-11-21.

| Claim | Layer | Original source | Locator / claim supported | Scope | Result |
| --- | --- | --- | --- | --- | --- |
| OP-001: Webhooks may be delivered more than once or out of order | Industry | [Razorpay payment-gateway webhooks](https://razorpay.com/blog/payment-gateway-webhooks-india/) | Duplicate prevention and out-of-order events | Razorpay merchant integration; not universal UPI scheme | Source-supported, company-reported |
| OP-002: Verify incoming webhook authenticity | Industry | [Cashfree webhook verification](https://www.cashfree.com/devstudio/preview/pg/tools/webhookVerification) | Webhook verification section | Cashfree integration | Source-supported, company-reported |
| OP-003: Fraud rule backtesting involves false-positive trade-offs | Industry / international method | [Stripe Radar Rules 101](https://stripe.com/guides/radar-rules-101) | Backtesting rules | Stripe Radar; not India UPI | Source-supported, non-UPI method analogy |
| OP-004: Event deduplication and business-operation idempotency should be separate | Atlas interpretation | [Razorpay technical discussion](https://razorpay.com/blog/payment-gateway-webhooks-india/) | Duplicate prevention | Proposed design extrapolation, not mandated | Editorial inference, not independently evaluated |

## Review limitations
- These sources support the stated *published guidance*, not proof that a named bank runs the approach in production.
- Technical content may change; confirm publication/version before release.
- No named practitioner LinkedIn source is currently verified; do not fabricate an attributed viewpoint.
- No copied diagrams, proprietary rules or full source text.
- Separate reviewer: **PENDING**. This ledger is not an independent sign-off.
