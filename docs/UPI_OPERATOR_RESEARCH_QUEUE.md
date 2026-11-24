# UPI operator and practitioner research queue

**Status:** source-discovery backlog, not a list of proven company practices.

## Research targets and what to extract
- NPCI / PSP banks: scheme security, fraud awareness, authentication, UPI complaint journeys, reconciliation and settlement; exact circular/version and actor.
- Payment companies (Razorpay, Cashfree, PayU, PhonePe, Google Pay): public product/security documentation, merchant risk, webhook idempotency, refund reconciliation and dispute workflows. Only attribute a practice if an official article actually describes it.
- Banks (SBI, ICICI, HDFC, Axis and payments banks): public fraud advisories, customer reporting journeys and published risk controls. Do not infer proprietary monitoring systems.
- Vendor engineering material (Featurespace, Feedzai, Google Cloud AML AI, Stripe Radar): reusable monitoring, alert quality, investigator feedback, model evaluation and false-positive techniques. Mark vendor-reported and assess India relevance.
- Practitioner talks and LinkedIn posts: original author, date, role as publicly stated, post URL, firsthand versus relayed, operational observation, counterexample and independent corroboration.
- Research papers (classified strictly under **`Research & academic` (`research`)**—separate from Industry practice, Community insight, and Atlas guidance): dataset provenance, geography, sample selection, labels, model comparison, precision/recall, operational cost, reproducibility and narrow-study caveats.

## Search queries
- site:razorpay.com/blog UPI payment reconciliation webhook idempotency
- site:cashfree.com/docs payments reconciliation UPI dispute
- site:phonepe.com fraud awareness UPI merchant risk
- site:npci.org.in/circulars/upi security risk dispute reconciliation
- site:rbi.org.in payments banks digital payment security fraud monitoring
- UPI mule account false positives India bank investigation research
- fraud risk analyst UPI detection false positives LinkedIn India
- merchant payment fraud prevention operational gaps India case study

## Extraction schema
Use the 15-column **Source extraction sheet** defined in [RESEARCH_PROTOCOL.md](RESEARCH_PROTOCOL.md) so source intake stays aligned with claim ledgers.

## Stop rules
Do not scrape LinkedIn or restricted bank portals. Do not reproduce bank/vendor diagrams or full articles. Original concise summary plus prominent author/source link is default. No bank is credited with a control merely because it sells a relevant product.
