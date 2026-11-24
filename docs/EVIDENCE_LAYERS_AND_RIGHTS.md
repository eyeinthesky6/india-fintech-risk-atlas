# Evidence layers, attribution and reuse policy

Status: v1 editorial policy | 2026-11-21

## Five distinct evidence layers
1. **Regulatory (`official`)**: binding regulations, circulars, scheme rules and official guidance. Record issuer, exact provision, actor applicability, version, effective period, amendments and binding/guidance distinction.
2. **Industry practice (`industry`)**: banks, fintechs, PSPs, vendors, company blogs and public case studies. Record who claims what, whether implementation is described, and whether performance is vendor-reported or independently assessed. Do not fold academic papers under Industry practice.
3. **Community insight (`practitioner`)**: named professionals' public articles, LinkedIn posts, talks and firsthand technical observations. Preserve attribution, original URL, date, role as stated, first-hand vs second-hand status, and limitations. Never imply employer endorsement, and do not place academic papers here.
4. **Research & academic (`research`)**: published empirical benchmarks and academic papers (`arXiv`, workshop studies, Google Scholar, SSRN). Keep academic studies in their own layer—separate from Industry practice, Community insight, and Atlas guidance—with explicit dataset, time-window, sample, and jurisdiction caveats rather than treating narrow benchmarks as ready-to-use rules.
5. **Atlas guidance (`atlas`)**: editorial synthesis, operational gap framing, candidate controls, telemetry prerequisites, and validation hypotheses. Never mix with source assertions or auto-promote to validated control or binding fact.

**Product priority:** Reference platform first; candidate solutions come second preference.

## Citation presentation
Every record should visibly separate **Official requirement / Industry implementation / Practitioner observation / Atlas interpretation**. Put inline citations next to specific claims and a consolidated bibliography at the bottom. Each source displays publisher/author, title, date, URL, accessed date and claim-level locator when available. An external source link is not permission to reproduce its content.

## Reuse and copyright
- Use original short summaries and links. Attribute accurately. Attribution alone does not license copying; copyright can apply to public pages and posts.
- Do not mirror full LinkedIn posts, articles, bank manuals, vendor rule sets, screenshots, proprietary charts, datasets or PDFs without an appropriate license/permission.
- Do not scrape gated or login-only content, bypass access restrictions, ignore robots or terms, or collect personal data beyond what is necessary for accurate attribution.
- Public source does not equal public domain. Do not claim ownership of third-party materials.
- Original Atlas writing is licensed under [CC BY 4.0](../LICENSE.md); original source code uses the [MIT License](../LICENSE-CODE). Open source does not automatically mean no copyright: a license grants permissions while preserving third-party rights.
- If a source author requests correction or removal, investigate and document the decision promptly.
- This is an editorial risk policy, not legal advice; obtain legal review before high-volume automated harvesting or extensive reproduction.

## Discovery without scraping infrastructure
V1: targeted web searches, public source links, RSS/sitemaps where permitted, manual/agent extraction of metadata and concise original summaries. Track query, retrieval date and source. V2: optional feed/API watcher only when volume justifies it. No generic LinkedIn scraper or crawler in v1.

## Source quality
- Official obligation: exact operative provision, actor and effective period required.
- Company practice: describe as **company-reported**, not universally adopted.
- Practitioner: describe as **author-observed** unless independently corroborated.
- Vendor performance: label **vendor-reported**, with methodology/limitations.
- Research & academic paper (`research`): describe as **Research & academic lead (idea only)**, with dataset, period, and sample/jurisdiction limitations; never treat narrow paper metrics as turnkey rules.
- Atlas guidance (`atlas`): clearly **Atlas synthesis / hypothesis**, never a verified statutory obligation or advisory opinion without separate primary evidence.

## Non-goals
No live scraping service, browser automation backend, vector database, AI inference on visitor requests, copyrighted source mirroring, or automatic AI publication.
