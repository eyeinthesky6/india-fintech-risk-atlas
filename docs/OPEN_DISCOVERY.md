# Open discovery and regulatory impact — product decision

Supersedes any proposed mandatory business-profile wizard. Keep the current name and static architecture. The Atlas is a general-purpose research and discovery surface, not a personalized compliance verdict.

## Experience
Homepage: search, explore catalogue, explore relationships, regulatory changes (only when verified change records exist). No required employer, role, login or profile. Optional facets combine across product, actor/entity, function/department, regulator or scheme operator, oversight area, lifecycle, record type, evidence layer and review status. Distinguish a regulated actor from an internal department and a regulator from a scheme operator. Use OR within a facet and AND across facets; empty selection means all. Missing metadata is unknown, not inapplicable. Share filter state in URLs when implemented.

Graph is a complementary view of the same records and filters, not a separate data store. Reuse any existing graph implementation after integration; no second graph library. Show typed, evidence-backed links (issued-by, applies-to, addresses-risk, implements-obligation, amends, supersedes); distinguish editorial topic associations from legal applicability. Selecting a node opens source/record details and optionally narrows the current view. Provide accessible list/table equivalent and bounded neighborhoods rather than a giant hairball.

## Data and integrity
Reuse existing Astro collection, taxonomy, IDs and four evidence layers. Add optional controlled metadata for departments/functions, authorities and oversight areas; populate only with reviewed editorial mappings, not inferred legal responsibility. Preserve actor scope and exact source clauses. Add canonical versioned source/obligation/change records when available; do not duplicate existing article prose. A change view must show old/new clause, publication/effective dates, affected scope, evidence and review status; never substitute last-source-check date for amendment date. An impact view must distinguish explicit applicability, conditional/unknown applicability and editorial relevance. No claim of completeness. Keep current UPI coverage and review blockers visible.

## Delivery
This stacked PR introduces an open discovery view over existing metadata, without modifying research records or attestations. Follow-up: integrate any graph from newer branches, add reviewed authority/function/oversight mappings and structured changes, then expose the same generated index via JSON and optional read-only MCP. No backend, graph database, runtime AI or new dependencies required for this slice.

## Acceptance
- Browse all records without answering questions; optional filters clear independently and combine.
- Search and existing catalogue remain available; direct links respect GitHub Pages base.
- Draft/review status visible; no filtered result implies a legal determination.
- Graph and change views must not claim data that is absent; use the same canonical IDs.
- Before merge run npm ci, npm run build, attestation checks and desktop/mobile smoke checks; verify keyboard access, zero-result/reset behavior and existing links.
