# India Fintech Risk Atlas — Model Context Protocol (MCP) Server

Official Model Context Protocol (MCP) server for **India Fintech Risk Atlas**. Enables AI coding assistants, risk intelligence agents, and developers (Claude Desktop, Cursor, Antigravity, ChatGPT, OpenCode, Kilo) to query authoritative, source-cited fintech fraud patterns, statutory RBI/NPCI directions, and candidate controls.

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

## 🛠️ Available MCP Tools

| Tool | Parameters | Description |
|---|---|---|
| `search_risk_records` | `query`, `product`, `actor`, `evidence_layer`, `limit` | Full-text and faceted search across all canonical risk topics, candidate controls, and impact assessments. |
| `get_record` | `record_id` (e.g. `UPI-004`) | Fetch the complete Ready-Reckoner record, including What it is, Impact, Common patterns, What to do (rules/mitigations table), and Watch-outs. |
| `get_evidence_ledger` | `record_id` | Retrieve claim-level primary source verification, section locators, entity scopes, and effective dates. |
| `list_sources` | `record_id`, `product` | Extract browser-verified RBI Master Directions, NPCI circulars, and academic preprints. |
| `list_taxonomy` | *(none)* | Retrieve classification schema (5 evidence layers, products, themes, actors, review stages). |
| `submit_correction` | `record_id`, `reason`, `quote`, `note`, `source_url` | Safely route suggested factual corrections or circular updates into the private triage queue via Cloudflare Worker. |

---

## 📚 Available MCP Resources

| Resource URI | Description |
|---|---|
| `atlas://taxonomy` | Full JSON taxonomy of evidence layers, products, actors, and stages. |
| `atlas://llms-txt` | Clean plain-text Markdown index optimized for LLM context ingestion. |
| `atlas://records/{recordId}` | Direct access to individual record payloads (e.g. `atlas://records/UPI-004`). |

---

## 🧪 Testing

Run the in-memory test suite:
```bash
npm test
```
