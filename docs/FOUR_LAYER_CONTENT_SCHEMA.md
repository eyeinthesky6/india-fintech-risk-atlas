# Four-layer content schema extension

Keep the canonical Product, Pattern, Control, Gap, Source, Claim, Evaluation and Case entities. Do not duplicate a control four times: attach **evidence assertions** with different provenance layers to the same canonical control.

## Source fields
```yaml
id: SRC-EXAMPLE
layer: industry # official | industry | practitioner | atlas
source_type: company-blog # regulation | circular | technical-doc | company-blog | linkedin-post | paper | case-study | atlas-analysis
publisher: Example Bank
author: null
title: Example article
canonical_url: https://example.org/article
published_on: null
accessed_on: null
license: unknown
reuse_mode: link-and-original-summary
firsthand: unknown
company_endorsement: false
```

## Assertion fields
```yaml
id: CLM-EXAMPLE
record_id: CTRL-0001
layer: industry
statement: A named company publicly describes this approach.
source_ids: [SRC-EXAMPLE]
locators: [section-name]
evidence_class: company-reported # binding | official-guidance | company-reported | practitioner-observation | vendor-reported | independently-evaluated | atlas-hypothesis
actor_scope: []
verified_by: null
verified_on: null
status: draft
```

## Article sections
At a glance; risk/gap; official requirements (if applicable); what operators report doing; practitioner observations; Atlas interpretation; proposed controls and data prerequisites; false positives; validation methods; references and review history. Omit empty sections; never imply absence of published evidence means a control is unnecessary.

## Search facets
Product, lifecycle, pattern, control type, actor, **evidence layer**, evidence strength, review status. Keep static-site generation and existing templates. Source metadata drives filter labels; no database.
