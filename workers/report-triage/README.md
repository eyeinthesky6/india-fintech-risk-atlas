# Atlas Private Factual-Error Triage Worker

This standalone Cloudflare Worker lets readers on the public GitHub Pages site flag an inaccurate section without a GitHub account, while routing every unverified report into a **private triage repository** for maintainer verification. Nothing goes live on the site automatically.

## Built-in anti-abuse protections

- **Origin allowlist (`ALLOWED_ORIGINS`):** Rejects `POST` requests from unknown origins.
- **No public spam:** Issues are created in a *private* repo (`eyeinthesky6/atlas-triage-private`), never the public Atlas repo.
- **Least-privilege token:** Uses a fine-grained GitHub PAT scoped **only** to `Issues: Write` on that single private repo.
- **Turnstile + honeypot + dwell check:** Blocks bots cleanly without annoying real readers.
- **Hashed rate limits (`RATE_LIMIT_KV`):** Caps anonymous reports to 3 per hashed IP per hour and 30 per day site-wide (`429` falls back to GitHub login link).
- **Strict payload sanitization:** Caps sizes (`8 KB` body, `300` char quote, `500` char note), requires valid Atlas UPI paths and `https://` source links, strips HTML/Markdown image embeds, and wraps reader text in plain-text fences.

## 5-step deployment (free tier)

1. **Create a private triage repo** on GitHub (e.g., `eyeinthesky6/atlas-triage-private`).
2. **Mint a fine-grained PAT** limited solely to that private repo with `Issues: Read and write`.
3. **Create a Turnstile widget + KV namespace** in Cloudflare (free tier), then fill `ALLOWED_ORIGINS`, `TRIAGE_GITHUB_REPO`, and `[[kv_namespaces]]` in `wrangler.toml`.
4. **Store secrets & deploy:**
   ```bash
   cd workers/report-triage
   npx wrangler secret put GITHUB_TRIAGE_TOKEN
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put IP_HASH_SALT
   npx wrangler deploy
   ```
5. **Wire the Astro Pages build** by setting two public GitHub Actions variables (not secrets):
   - `PUBLIC_REPORT_ENDPOINT=https://atlas-report-triage.<your-subdomain>.workers.dev`
   - `PUBLIC_TURNSTILE_SITE_KEY=<your-turnstile-site-key>`
