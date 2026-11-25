# India Fintech Risk Atlas — Model Context Protocol (MCP) Server

Official Model Context Protocol (MCP) server for **India Fintech Risk Atlas**. Provides AI coding assistants, compliance agents, and risk engineering teams (Claude Desktop, Cursor, Antigravity, ChatGPT, OpenCode, Kilo) with a subset of web application capabilities: full-text search, Ready-Reckoner controls, claim-level evidence ledgers, interactive knowledge graph navigation, persona filtering, gap-audit checklists, and private correction submission.

---

## 🚀 Quick Setup

### 1. Claude Desktop (`claude_desktop_config.json`)
Clone the repository and run `npm ci --prefix mcp` from the repository root. The checkout includes the offline dataset. If you edit source records locally, run `npm run data` to regenerate the checked-in exports.

Add to `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "fintech-risk-atlas": {
      "command": "node",
      "args": [
        "C:/Projects/india-fintech-risk-atlas/mcp/bin/cli.js"
      ]
    }
  }
}
```

### 2. Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "fintech-risk-atlas": {
      "command": "node",
      "args": [
        "C:/Projects/india-fintech-risk-atlas/mcp/bin/cli.js"
      ]
    }
  }
}
```

### 3. Antigravity / Gemini CLI (`mcp_config.json`)
```json
{
  "mcpServers": {
    "fintech-risk-atlas": {
      "command": "node",
      "args": [
        "C:/Projects/india-fintech-risk-atlas/mcp/bin/cli.js"
      ]
    }
  }
}
```

---

## 🛠️ Available tools

| Category | Tool | Parameters | Result |
|---|---|---|---|
| **Search & Discovery** | `search_risk_records` | `query`, `product`, `actor`, `evidence_layer`, `limit` | Full-text & faceted search bar (`Ctrl+K` + Pagefind filters) |
| **Record Retrieval** | `get_record` | `record_id` | Ready-Reckoner article view (What it is, Impact, Patterns, Controls, Watch-outs) |
| **Knowledge Graph** | `explore_knowledge_graph` | `record_id`, `relation_type` | Interactive SVG Graph drawer (`> Knowledge graph [Expand]`), theme clusters, and co-cited circulars |
| **Persona Filtering** | `get_persona_controls` | `actor`, `basis` | Role-based table filtering (e.g. view only `TPAP`, `Remitter Bank`, or `Merchant` obligations) |
| **Pre-Audit & Gaps** | `generate_gap_checklist` | `actor`, `product`, `format` | Actionable Markdown/JSON audit checklist matrix for engineering and risk teams |
| **Clean Export** | `get_clean_markdown` | `record_id` | Record Markdown with references, review metadata and the canonical URL |
| **Evidence status** | `mark_record_accurate` | `record_id` | Legacy lookup of the recorded evidence stage and human-check status |
| **Evidence Audit** | `get_evidence_ledger` | `record_id` | Bottom `Record Dossier` & claim-level primary source audit table |
| **Primary Sources** | `list_sources` | `record_id`, `product` | Collapsible `Sources, legal scope & review history` drawer & `sources.md` register |
| **Policies & Guides** | `get_guide_doc` | `doc_id` | Top navigation tabs: `evidence-policy`, `methodology`, `risk-stack-playbook`, `glossary`, `sources`, etc. |
| **Taxonomy** | `list_taxonomy` | *(none)* | 5 evidence layers, themes, actors, products, and review stages |
| **Feedback & Triage** | `submit_correction` | `record_id`, `section`, `reason`, `quote`, `note`, `source_url` | Prepares a draft. Use **Report an error** on the returned page for private reporting after browser verification. |

---

## 📚 Available MCP Resources

| Resource URI | Description |
|---|---|
| `atlas://taxonomy` | Full JSON taxonomy of evidence layers, products, actors, and stages. |
| `atlas://llms-txt` | Clean plain-text Markdown index optimized for LLM context ingestion. |
| `atlas://records/{recordId}` | Direct access to individual record payloads (e.g. `atlas://records/UPI-004`). |
| `atlas://guides/{slug}` | Direct access to guide playbooks (e.g. `atlas://guides/evidence-policy`). |

---

## 🧪 Testing

The MCP server is tested with both unit tests and mathematical **property-based tests** via `fast-check`:

```bash
cd mcp
npm test
```

* **Unit Tests:** Verifies all 12 tools and resource handlers.
* **Property Tests (`fast-check`):**
  1. *Search Invariant & Limit Bounding:* Bounds limits to `[1, 50]` across 100 random runs.
  2. *Structural Conservation:* Verifies 100% of records satisfy 5-layer basis and schema rules.
  3. *Idempotence & Case Invariance:* Ensures case/whitespace permutations return identical records.
  4. *Knowledge Graph Invariants:* Proves no self-loops, union completeness, and referential integrity.
  5. *Fuzzing & Injection Robustness:* Verifies stability under arbitrary strings, Unicode, and SQL/XSS payloads.
  6. *Gap Checklist Invariant:* Guarantees well-formed tables across Markdown and JSON formats.
  7. *Submission Validation Gate:* Enforces required fields before triage forwarding.

---

## 🌐 Remote MCP vs. Local stdio Evaluation

This server is packaged intentionally as a **local stdio process** rather than a publicly exposed remote HTTP/SSE endpoint.
* **Web & Chat Users (ChatGPT, Gemini Web, Perplexity):** Can attempt to retrieve public data via the static CDN index (client-dependent; not automatic discovery or an MCP connection) at [`/llms.txt`](https://eyeinthesky6.github.io/india-fintech-risk-atlas/llms.txt) and [`/atlas-records.json`](https://eyeinthesky6.github.io/india-fintech-risk-atlas/atlas-records.json).
* **Developer & IDE Users (Cursor, Claude Desktop, Antigravity, VS Code):** Local stdio starts with the bundled dataset when the published snapshot and its cache are unavailable. Restart the MCP process to check for updates.

For the full architectural decision record, security requirements, and activation triggers for when to deploy a remote Cloudflare Worker SSE endpoint, see [docs/REMOTE_MCP_EVALUATION.md](../docs/REMOTE_MCP_EVALUATION.md).
  6. *Gap Checklist Invariant:* Guarantees well-formed tables across Markdown and JSON formats.
  7. *Submission Validation Gate:* Enforces required fields before triage forwarding.

## Snapshot freshness

Online startup uses the fixed GitHub Pages feed or its six-hour cache. `--refresh` checks the feed immediately. If the feed fails or returns an incompatible snapshot, the CLI uses the last valid cached release, then the bundle. `--offline` or `ATLAS_OFFLINE=1` disables the dataset request and selects the most recently generated valid local copy. Rebuilding identical content preserves its generation date. Each session uses one snapshot for tools and the LLM index. Private corrections are submitted through the website.
