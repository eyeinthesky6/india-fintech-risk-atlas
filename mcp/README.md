# India Fintech Risk Atlas — Model Context Protocol (MCP) Server

Official Model Context Protocol (MCP) server for **India Fintech Risk Atlas**. Provides AI coding assistants, compliance agents, and risk engineering teams (Claude Desktop, Cursor, Antigravity, ChatGPT, OpenCode, Kilo) with 100% feature parity with the web application: full-text search, Ready-Reckoner controls, claim-level evidence ledgers, interactive knowledge graph navigation, persona filtering, gap-audit checklists, and private correction submission.

---

## 🚀 Quick Setup

### 1. Claude Desktop (`claude_desktop_config.json`)
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

## 🛠️ Complete Toolset (100% Parity with Web UI)

| Category | Tool | Parameters | UI Feature Parity |
|---|---|---|---|
| **Search & Discovery** | `search_risk_records` | `query`, `product`, `actor`, `evidence_layer`, `limit` | Full-text & faceted search bar (`Ctrl+K` + Pagefind filters) |
| **Record Retrieval** | `get_record` | `record_id` | Ready-Reckoner article view (What it is, Impact, Patterns, Controls, Watch-outs) |
| **Knowledge Graph** | `explore_knowledge_graph` | `record_id`, `relation_type` | Interactive SVG Graph drawer (`> Knowledge graph [Expand]`), theme clusters, and co-cited circulars |
| **Persona Filtering** | `get_persona_controls` | `actor`, `basis` | Role-based table filtering (e.g. view only `TPAP`, `Remitter Bank`, or `Merchant` obligations) |
| **Pre-Audit & Gaps** | `generate_gap_checklist` | `actor`, `product`, `format` | Actionable Markdown/JSON audit checklist matrix for engineering and risk teams |
| **Clean Export** | `get_clean_markdown` | `record_id` | `[Copy]` button parity — extracts clean markdown stripped of UI widgets + canonical source citation |
| **Verification & Trust**| `mark_record_accurate` | `record_id` | `[✓ Looks accurate]` button parity — attests record validity |
| **Evidence Audit** | `get_evidence_ledger` | `record_id` | Bottom `Record Dossier` & claim-level primary source audit table |
| **Primary Sources** | `list_sources` | `record_id`, `product` | Collapsible `Sources, legal scope & review history` drawer & `sources.md` register |
| **Policies & Guides** | `get_guide_doc` | `doc_id` | Top navigation tabs: `evidence-policy`, `methodology`, `risk-stack-playbook`, `glossary`, `sources`, etc. |
| **Taxonomy** | `list_taxonomy` | *(none)* | 5 evidence layers, themes, actors, products, and review stages |
| **Feedback & Triage** | `submit_correction` | `record_id`, `section`, `reason`, `quote`, `note`, `source_url` | Guided Selection & `[Report an error]` dialog -> routes to Cloudflare Worker & private triage queue |

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
