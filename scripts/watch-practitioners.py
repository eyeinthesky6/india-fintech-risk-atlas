#!/usr/bin/env python3
"""
scripts/watch-practitioners.py — Automated Practitioner & Operator Evidence Watcher

Monitors public engineering blogs and publications from Indian fintech infrastructure providers
(PhonePe, Razorpay, Cashfree, Juspay, CRED, NPCI tech) and practitioner communities for payment
engineering, reconciliation, fraud prevention, and UPI telemetry insights.

Features:
- Polls curated engineering RSS/Atom feeds
- Cleans and deduplicates URLs against research/upi/OPERATOR_EVIDENCE.md
- Routes matched posts to canonical risk atlas records (UPI-001 through UPI-017)
- Supports --auto-add to automatically append newly discovered candidate observations to OPERATOR_EVIDENCE.md
- Generates markdown triage reports for manual domain steward review or CI workflows
"""

import sys
import re
import os
import json
import argparse
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime

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
    (re.compile(r"idempotenc?y|webhook|signature|duplicate|tstore", re.I), "UPI-005", "Authentication context & idempotency"),
    (re.compile(r"reconciliation|settlement|pending|out-of-order|refund", re.I), "UPI-015", "Payment status reconciliation"),
    (re.compile(r"dispute|chargeback|udir|urcs", re.I), "UPI-013", "Dispute routing & UDIR"),
    (re.compile(r"mule|kyc|shell|funnel", re.I), "UPI-011", "Mule account funnel"),
    (re.compile(r"emulator|root|rasp|overlay|apk|tampering|sandboxing|isolation", re.I), "UPI-008", "Untrusted app access & RASP"),
    (re.compile(r"velocity|burst|rate limit|spike|fraud|real-time transaction", re.I), "UPI-001", "Unusual outbound velocity & fraud"),
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


def get_max_op_id():
    """Finds the highest existing OP-xxx ID in OPERATOR_EVIDENCE.md."""
    if not os.path.exists(EVIDENCE_FILE):
        return 0
    with open(EVIDENCE_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    ids = [int(m) for m in re.findall(r"OP-(\d+)", content)]
    return max(ids) if ids else 0


def fetch_feed(feed_info, timeout=15):
    """Fetches and parses an RSS or Atom feed."""
    items = []
    req = urllib.request.Request(
        feed_info["url"],
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) India-Fintech-Risk-Atlas/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read()
            root = ET.fromstring(data)
            elements = root.findall(".//item")
            if len(elements) == 0:
                elements = root.findall(".//{http://www.w3.org/2005/Atom}entry")

            for elem in elements:
                title_elem = elem.find("title") if elem.find("title") is not None else elem.find("{http://www.w3.org/2005/Atom}title")
                link_elem = elem.find("link") if elem.find("link") is not None else elem.find("{http://www.w3.org/2005/Atom}link")
                pubdate_elem = elem.find("pubDate") if elem.find("pubDate") is not None else elem.find("{http://www.w3.org/2005/Atom}updated")
                desc_elem = elem.find("description") if elem.find("description") is not None else elem.find("{http://www.w3.org/2005/Atom}summary")

                title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""
                if link_elem is not None:
                    link = link_elem.text.strip() if link_elem.text else link_elem.get("href", "").strip()
                else:
                    link = ""

                pubdate = pubdate_elem.text.strip() if pubdate_elem is not None and pubdate_elem.text else ""
                desc = desc_elem.text.strip() if desc_elem is not None and desc_elem.text else ""

                if not title or not link:
                    continue

                items.append({
                    "title": title,
                    "link": clean_url(link),
                    "pubDate": pubdate,
                    "description": desc,
                    "company": feed_info["company"],
                    "feed": feed_info["name"],
                    "default_layer": feed_info["default_layer"],
                })
    except Exception as e:
        print(f"Notice: Feed {feed_info['name']} ({feed_info['url']}) error: {e}", file=sys.stderr)

    return items


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


def auto_add_to_evidence(new_items):
    """Automatically appends discovered practitioner items into OPERATOR_EVIDENCE.md."""
    if not new_items:
        print("No new items to auto-add.")
        return 0

    if not os.path.exists(EVIDENCE_FILE):
        print(f"Error: {EVIDENCE_FILE} not found.", file=sys.stderr)
        return 0

    max_id = get_max_op_id()
    added_count = 0

    # Build new rows
    new_rows = []
    for item in new_items:
        max_id += 1
        op_id = f"OP-{max_id:03d}"
        pub_date = item.get("pubDate", "")
        # Shorten date if possible
        date_str = ""
        if pub_date:
            try:
                # e.g., Sat, 01 Feb 2025 00:00:00 GMT -> Feb 2025
                date_str = f" ({pub_date.split()[2]} {pub_date.split()[3]})"
            except Exception:
                date_str = ""

        doc_link = f"[{item['title']}]({item['link']}){date_str}"
        layer_str = f"Industry (`company-reported`; {item['company']} tech)" if item["default_layer"] == "industry" else f"Practitioner (`community`; {item['company']})"
        keywords_str = ", ".join(item["matched_keywords"])
        claims = f"Documents {item['company']} engineering patterns for {item['topic_name'].lower()} (matched signals: {keywords_str}). Target record: `{item['candidate_record']}`"
        limitations = f"Automated feed ingestion from {item['feed']}; domain steward verification pending"

        row = f"| `{op_id}` | {item['company']}, {doc_link} | {layer_str} | {claims} | {limitations} |"
        new_rows.append((op_id, row, item))
        added_count += 1

    with open(EVIDENCE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the end of Section 1 table
    # Section 1 starts with '## 1. Company-reported engineering & product practices (Layer 2)'
    sec1_marker = "## 1. Company-reported engineering & product practices (Layer 2)"
    sec2_marker = "## 2. Academic & research paper leads"

    if sec1_marker in content and sec2_marker in content:
        parts = content.split(sec2_marker)
        sec1_content = parts[0].rstrip()
        # Append the new rows to sec1_content
        for op_id, row, item in new_rows:
            sec1_content += f"\n{row}"
            print(f"Auto-added `{op_id}`: {item['title']} -> {item['candidate_record']}")
        
        new_full_content = sec1_content + "\n\n" + sec2_marker + parts[1]
        with open(EVIDENCE_FILE, "w", encoding="utf-8") as f:
            f.write(new_full_content)
        print(f"\nSuccessfully auto-added {added_count} items to {EVIDENCE_FILE}")
    else:
        # Fallback append
        with open(EVIDENCE_FILE, "a", encoding="utf-8") as f:
            f.write("\n\n### Discovered Practitioner Intake\n\n")
            for op_id, row, item in new_rows:
                f.write(f"{row}\n")
        print(f"Appended {added_count} items to {EVIDENCE_FILE}")

    return added_count


def main():
    parser = argparse.ArgumentParser(description="Watch fintech engineering feeds for practitioner observations.")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--output", "-o", type=str, help="Save report to file")
    parser.add_argument("--auto-add", action="store_true", help="Automatically append discovered items to OPERATOR_EVIDENCE.md")
    args = parser.parse_args()

    registered_urls = load_registered_urls()

    all_items = []
    for feed in ENGINEERING_FEEDS:
        items = fetch_feed(feed)
        all_items.extend(items)

    relevant = filter_relevant_posts(all_items, registered_urls)
    new_items = [it for it in relevant if not it["is_registered"]]

    if args.auto_add and new_items:
        auto_add_to_evidence(new_items)
        # Reload registered URLs after auto-add
        registered_urls = load_registered_urls()
        new_items = [it for it in relevant if clean_url(it["link"]) not in registered_urls]

    if args.json:
        result = {
            "timestamp": datetime.now().isoformat(),
            "new_count": len(new_items),
            "new_items": new_items,
        }
        output_str = json.dumps(result, indent=2)
    else:
        output_str = format_markdown_table(new_items)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_str)
        print(f"Report written to {args.output}")
    else:
        if not args.auto_add:
            print(output_str)


if __name__ == "__main__":
    main()
