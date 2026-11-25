# Contributing to India Fintech Risk Atlas

Thank you for your interest in contributing to the **India Fintech Risk Atlas**! We are an open, source-cited public-good platform cataloging fraud patterns, risk checks, and operational failures in Indian financial products.

---

## 🧭 Choose Your Contribution Track

### Track A: Domain Experts, Banking Officers & Risk Leads (Zero-GitHub)
You do **not** need a GitHub account or technical Git knowledge to contribute:
- **No Git / Code Required:** Review 3-bullet operational summaries when circulars change (~2 minutes).
- **Signup:** Register your domain on our [Domain Expert Signup Form](https://eyeinthesky6.github.io/india-fintech-risk-atlas/contribute/) or open an issue using the [Domain Expert Registration Template](https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=domain-expert-signup.yml).

### Track B: Code & Content Contributors (GitHub & Pull Requests)
For engineers, data analysts, and researchers contributing via Git:
1. Check the [Product Expansion Task Board](docs/PRODUCT_EXPANSION_TASKBOARD.md) to pick an open, single-record work unit.
2. Adhere to the [Content Schema](docs/CONTENT_SCHEMA.md) and [Research Protocol](docs/RESEARCH_PROTOCOL.md).
3. **Double-Ledger Requirement:** Every new or modified claim in `src/content/docs/<product>/<ID>.md` must have matching entries in:
   - `research/evidence/<ID>.md` (Assertion ledger)
   - `research/attestations/<ID>.md` (12-item declaration)
4. **Hard Gates vs. Soft Gates:** Contributors and authoring agents **cannot** self-certify independent reviewer boxes (`8–10, 12` in attestations). An independent human domain reviewer must sign off before publication.

---

## 🛠️ Local Development & Verification

Before submitting a Pull Request, run the required verification suite:

```powershell
# 1. Enable repository hooks
git config core.hooksPath .githooks

# 2. Verify attestation ledgers and stage parity
python scripts/check-attestations.py --all

# 3. Verify citation freshness, deprecations, and offline queue
python scripts/verify-citations.py --offline --all

# 4. Build static site & validate internal links
npm run build
```

---

## 📜 Licensing

By contributing, you agree that:
- Your original editorial content is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.
- Your code is licensed under the **MIT License**.

See [LICENSE.md](LICENSE.md) and [LICENSE-CODE](LICENSE-CODE) for details.
