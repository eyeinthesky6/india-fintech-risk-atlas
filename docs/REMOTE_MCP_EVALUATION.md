# Architecture Decision Record: Remote MCP vs. Local stdio Evaluation & Triggers

**Status:** DECIDED (DEFERRED / TRIGGER-BASED)  
**Date:** 2026-11-25  
**Owner:** India Fintech Risk Atlas Core Engineering  
**Scope:** Model Context Protocol (MCP) deployment topology (Local stdio vs. Remote HTTP/SSE)

---

## 1. Context & Executive Summary

The **India Fintech Risk Atlas** provides two classes of machine consumption:
1. **Local stdio MCP Server:** Packaged under `mcp/` (`india-fintech-risk-atlas-mcp`), exposing 12 deterministic tools and 4 resources directly to local developer IDEs and agents (Claude Desktop, Cursor, Antigravity, OpenCode, VS Code).
2. **Static CDN Endpoints:** Pre-built, machine-readable datasets hosted on GitHub Pages:
   - `/atlas-records.json` (Structured JSON API)
   - `/llms.txt` (Compact LLM reference index)
   - `/llms-full.txt` (Consolidated knowledge pack)

The question addressed by this document: **Should we deploy and maintain a live, public, remote MCP server over HTTP/SSE (e.g. on Cloudflare Workers) right now?**

**Decision:** **NO.** Remote MCP is deferred until specific, measurable ecosystem triggers occur. For general web and chat users (ChatGPT, Gemini Web, Perplexity), the static `/llms.txt` and `/atlas-records.json` endpoints provide identical informational coverage at zero cost, zero maintenance, and infinite scale, while developer IDEs strongly prefer local stdio.

---

## 2. Comparison Matrix: Local stdio vs. Remote HTTP/SSE vs. Static `llms.txt`

| Dimension | Local stdio MCP (`mcp/`) | Static `llms.txt` / JSON | Remote HTTP/SSE MCP (Deferred) |
|---|---|---|---|
| **Primary Audience** | Developers, Risk Engineers, Local IDE Agents | Web Chat users (ChatGPT, Gemini, Perplexity) | Remote Agent Swarms, SaaS integrations |
| **Connection Protocol** | OS pipes (`process.stdin` / `stdout`) | HTTPS GET (HTTP/2, CDN cached) | Server-Sent Events (SSE) / HTTP POST |
| **Hosting & Compute Cost** | **\$0** (runs on client's machine) | **\$0** (served statically via GitHub Pages CDN) | Ongoing Cloudflare Worker request & duration costs |
| **Latency** | **< 2ms** (in-memory IPC) | 50–200ms (CDN fetch) | 150–500ms (network roundtrip + SSE keep-alive) |
| **Offline Support** | **100% Yes** (bundled data) | No | No |
| **Attack Surface** | **Zero** (no open port or network listener) | Zero (read-only static asset) | High (requires rate-limiting, auth, DDoS defense) |
| **Tool Calling Parity** | 12 tools (interactive checklists, graphs) | Context reading only | 12 tools (interactive checklists, graphs) |

---

## 3. Why Remote MCP is Deferred Today

1. **`llms.txt` Solves 90% of Web Chat Queries at Zero Cost:**
   When a user asks ChatGPT or Gemini Web a compliance or risk question, the model does not need interactive tool invocation—it needs accurate, source-cited text. Pointing web models to `https://eyeinthesky6.github.io/india-fintech-risk-atlas/llms.txt` fulfills this without any server infrastructure.
2. **Local stdio is the Gold Standard for Developer Workflows:**
   Engineers writing UPI or Card payment integrations work inside IDEs (Cursor, VS Code, Claude Desktop, Antigravity). Local stdio delivers sub-2ms response times, never fails on network drops, and has no API rate limits.
3. **Premature Security & Compute Overhead:**
   Exposing a remote MCP server over the public internet exposes the backend to automated scrapers, denial-of-wallet attacks, and runaway agent loops. Securing this requires API key issuance, billing, bot challenges, and rate limiting—diverting effort from authoring primary fintech risk intelligence.
4. **Evolving Protocol Standards:**
   The remote MCP transport specification (SSE vs. WebSockets vs. HTTP Stream) and web chat provider integrations (OpenAI Actions vs. Anthropic remote MCP) are actively shifting. Standardizing on local stdio + static CDN avoids technical debt.

---

## 4. Activation Triggers (When to Deploy Remote MCP)

Remote MCP will be implemented **only when at least one of the following triggers fires**:

| Trigger ID | Trigger Description | Verification Metric / Threshold |
|---|---|---|
| **TR-01** | **Consumer Web Chat Remote MCP Marketplace** | OpenAI (ChatGPT) or Google (Gemini Web) officially launches a zero-friction directory allowing free users to add external remote MCP endpoints via single-click URL. |
| **TR-02** | **Enterprise / Institutional Partner Demand** | A bank, fintech aggregator, or audit partner requests a hosted API/SSE endpoint to connect their enterprise agent pipeline without running local Node.js binaries. |
| **TR-03** | **Interactive Web Embed / Playground** | An interactive browser playground is added to the Atlas website requiring client-side LLM tool calls without bundling the dataset into the frontend bundle. |
| **TR-04** | **Real-Time Data Feeds (Dynamic Atlas)** | The Atlas integrates live regulatory circular scrapers or automated RBI Gazette watchers where data updates hourly rather than via git commits. |

---

## 5. Pre-Engineered Blueprint for Remote Deployment (When Triggered)

When a trigger fires, the transition to remote MCP is straightforward because the business logic is already modularized in `mcp/src/server.js`:

```
                                  [Remote Client (ChatGPT / Cloud Agent)]
                                                     |
                                            (HTTPS / SSE Stream)
                                                     v
                                  [Cloudflare Worker: atlas-mcp-remote]
                                  +------------------------------------+
                                  | 1. Cloudflare Turnstile / Bot Mgmt |
                                  | 2. KV Rate Limiting (60 req/min)   |
                                  | 3. Bearer Auth (Optional Partner)  |
                                  | 4. SSEServerTransport Adapter      |
                                  +-----------------+------------------+
                                                    |
                                      [Bundled Atlas Dataset JSON]
                                                    |
                                      [12 MCP Tools & Resources]
```

### Required Security Stack for Remote MCP:
1. **Transport:** `SSEServerTransport` hosted on Cloudflare Workers.
2. **Rate Limiting:** Cloudflare KV rate-limiting bucket (max 60 requests/minute per client IP / API key).
3. **Payload Inspection:** Maximum JSON-RPC body size capped at 16 KB.
4. **Write-Tool Gating:** `submit_correction` requires an authenticated contributor token; anonymous SSE sessions have read-only access (`isReadOnly: true`).
5. **ReDoS / Fuzz Protection:** Already implemented via `escapeRegex()` and property-tested fuzz resilience.
