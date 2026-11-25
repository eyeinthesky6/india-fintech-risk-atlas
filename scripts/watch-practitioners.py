#!/usr/bin/env python3
"""
scripts/watch-practitioners.py — Automated Practitioner & Operator Evidence Watcher

Monitors public engineering blogs and publications from Indian fintech infrastructure providers
(PhonePe, Razorpay, Cashfree, Juspay, CRED, NPCI tech) and practitioner communities for payment
engineering, reconciliation, fraud prevention, and UPI telemetry insights.

Features:
- Polls curated engineering RSS/Atom feeds
- Cleans and deduplicates URLs against research/upi/OPERATOR_EVIDENCE.md
- Routes matched posts to canonical risk atlas records (UPI topic records)
- Generates markdown triage reports for manual domain steward review or CI workflows
"""

import sys
import re
import os
import argparse
import urllib.parse
from datetime import datetime

from atlas_feeds import poll_feeds, write_reports

# Curated RSS/Atom feeds of Indian fintech engineering blogs & practitioner platforms
ENGINEERING_FEEDS = [
    {
        "name": "PhonePe Tech Blog",
        "url": "https://tech.phonepe.com/rss.xml",
        "company": "PhonePe",
        "default_layer": "industry",
    },
    {
        "name": "Cashfree Blog",
        "url": "https://www.cashfree.com/blog/feed/",
        "company": "Cashfree",
        "default_layer": "industry",
    },
    {
        "name": "Razorpay Tech Blog",
        "url": "https://razorpay.com/blog/category/technology/feed/",
        "company": "Razorpay",
        "default_layer": "industry",
    },
    {
        "name": "Medium - Indian Fintech Engineering",
        "url": "https://medium.com/feed/tag/upi-payment",
        "company": "Community / Medium",
        "default_layer": "practitioner",
    },
    {
        "name": "Medium - Payment Systems Architecture",
        "url": "https://medium.com/feed/tag/fintech-architecture",
        "company": "Community / Medium",
        "default_layer": "practitioner",
    },
]

TECHNICAL_KEYWORDS = [
    r"idempotenc?y",
    r"reconciliation",
    r"webhook",
    r"state machine",
    r"chargeback",
    r"dispute",
    r"fraud detection",
    r"real-time transaction",
    r"mule account",
    r"device binding",
    r"cooling period",
    r"emulator",
    r"screen overlay",
    r"module sandboxing",
    r"technical decline",
    r"business decline",
    r"retry storm",
    r"tstore",
    r"settlement",
    r"audit trail",
    r"refund",
]

KEYWORDS = [r"\bupi\b"] + TECHNICAL_KEYWORDS

KEYWORD_REGEX = re.compile("|".join(KEYWORDS), re.IGNORECASE)
TECHNICAL_KEYWORD_REGEX = re.compile("|".join(TECHNICAL_KEYWORDS), re.IGNORECASE)

TOPIC_ROUTING = [
    (re.compile(r"idempotenc?y|webhook|signature|duplicate|tstore|reconciliation|pending|out-of-order", re.I), "UPI-005", "Payment status reconciliation & idempotency"),
    (re.compile(r"settlement|urcs", re.I), "UPI-014", "Settlement exceptions & URCS"),
    (re.compile(r"dispute|chargeback|udir", re.I), "UPI-013", "Dispute routing & UDIR"),
    (re.compile(r"mule|funnel|dormancy", re.I), "UPI-002", "Mule-account funnel"),
    (re.compile(r"kyc|shell|laundering", re.I), "UPI-012", "Merchant onboarding & KYC"),
    (re.compile(r"emulator|root|rasp|overlay|apk|tampering|sandboxing|isolation", re.I), "UPI-008", "Untrusted app access & RASP"),
    (re.compile(r"velocity|burst|rate limit|spike|fraud|real-time transaction", re.I), "UPI-001", "Unusual outbound velocity & fraud"),
    (re.compile(r"refund|liability|unauthori[sz]ed", re.I), "UPI-015", "Customer liability & refunds"),
]

EVIDENCE_FILE = "research/upi/OPERATOR_EVIDENCE.md"


def clean_url(url: str) -> str:
    """Strips tracking UTM parameters, anchors, and trailing slashes."""
    if not url:
        return ""
    parsed = urllib.parse.urlparse(url.strip())
    # Strip tracking queries
    query_params = urllib.parse.parse_qsl(parsed.query)
    clean_params = [(k, v) for k, v in query_params if not k.lower().startswith("utm_")]
    new_query = urllib.parse.urlencode(clean_params)
    clean = urllib.parse.urlunparse((
        parsed.scheme,
        parsed.netloc,
        parsed.path.rstrip("/"),
        parsed.params,
        new_query,
        ""  # strip fragment
    ))
    return clean


def load_registered_urls():
    """Extracts existing URLs from OPERATOR_EVIDENCE.md to prevent duplicate ingestion."""
    registered = set()
    if not os.path.exists(EVIDENCE_FILE):
        return registered

    with open(EVIDENCE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Match URLs inside Markdown links [text](url)
    urls = re.findall(r"\[.*?\]\((https?://[^\s\)]+)\)", content)
    for u in urls:
        registered.add(clean_url(u))
    return registered


def route_to_candidate_topic(text):
    """Routes matched text to candidate Risk Atlas UPI record."""
    for pattern, record_id, topic_name in TOPIC_ROUTING:
        if pattern.search(text):
            return record_id, topic_name
    return "UPI-GENERAL", "General UPI Engineering"


def filter_relevant_posts(items, registered_urls):
    """Filters posts matching payment and fintech engineering keywords."""
    matches = []
    seen_links = set()
    for it in items:
        clean_link = it["link"]
        if clean_link in seen_links:
            continue
        seen_links.add(clean_link)

        text_to_search = f"{it['title']} {it['description']}"
        # For community feeds, require specific technical fintech keywords, not just generic 'upi'
        if it["default_layer"] == "practitioner":
            matched_kws = TECHNICAL_KEYWORD_REGEX.findall(text_to_search)
        else:
            matched_kws = KEYWORD_REGEX.findall(text_to_search)

        if matched_kws:
            is_registered = clean_link in registered_urls
            record_id, topic_name = route_to_candidate_topic(text_to_search)
            it["matched_keywords"] = sorted(list(set(k.lower() for k in matched_kws)))
            it["is_registered"] = is_registered
            it["candidate_record"] = record_id
            it["topic_name"] = topic_name
            matches.append(it)
    return matches


def format_markdown_table(new_items):
    lines = [
        f"# Practitioner & Operator Intake Queue — {datetime.now().strftime('%Y-%m-%d')}",
        "",
        f"- **New candidate practitioner/engineering posts found:** {len(new_items)}",
        "",
    ]
    if new_items:
        lines.append("## 🔍 Discovered Practitioner Observations")
        lines.append("")
        lines.append("| Candidate ID | Publisher / Author | Title & URL | Target Record | Key Insight / Match |")
        lines.append("|---|---|---|---|---|")
        for i, item in enumerate(new_items, 1):
            kws = ", ".join(f"`{k}`" for k in item["matched_keywords"][:3])
            lines.append(
                f"| `PRAC-CAND-{i:03d}` | {item['company']} | [{item['title']}]({item['link']}) | `{item['candidate_record']}` ({item['topic_name']}) | Keywords: {kws} |"
            )
        lines.append("")
        lines.append("### Automated Intake Steps:")
        lines.append("1. Verify firsthand authorship and stated practitioner role.")
        lines.append("2. Extract concrete operational mechanisms (avoid marketing fluff).")
        lines.append("3. Auto-add with `--auto-add` or append approved rows to `research/upi/OPERATOR_EVIDENCE.md`.")
        lines.append("4. Link candidate controls in the corresponding `src/content/docs/upi/<record>.md` Ready-Reckoner table.")
    else:
        lines.append("## ✅ No new uncatalogued engineering articles detected.")
        lines.append("All scanned feeds are currently accounted for in `OPERATOR_EVIDENCE.md`.")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Poll the Atlas source feeds for research candidates.")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--output", "-o", help="Write the primary report to a file")
    parser.add_argument("--markdown-output", help="Also write Markdown from the same feed poll")
    args = parser.parse_args()

    all_items, failures = poll_feeds(ENGINEERING_FEEDS, ("company", "default_layer"), clean_url)
    relevant = filter_relevant_posts(all_items, load_registered_urls())
    new_items = [item for item in relevant if not item["is_registered"]]
    report = {
        "timestamp": datetime.now().isoformat(),
        "new_count": len(new_items),
        "new_items": new_items,
    }
    return write_reports(args, report, format_markdown_table(new_items), failures, len(ENGINEERING_FEEDS))


if __name__ == "__main__":
    sys.exit(main())
