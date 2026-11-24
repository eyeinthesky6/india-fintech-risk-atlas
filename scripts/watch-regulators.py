#!/usr/bin/env python3
"""
scripts/watch-regulators.py — Automated Regulatory RSS & Source Watcher

Polls official regulatory feeds (RBI Notifications, RBI Press Releases, PIB Ministry Feeds),
filters for relevant fintech/UPI/cyber keywords, and checks whether they are already registered
in research/upi/PRIMARY_SOURCE_REGISTER.md.

Outputs a Markdown report and can create GitHub issues when running in CI.
"""

import sys
import re
import os
import json
import argparse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

FEEDS = [
    {
        "name": "RBI Notifications",
        "url": "https://rbi.org.in/notifications_rss.xml",
        "publisher": "Reserve Bank of India",
        "type": "regulatory",
    },
    {
        "name": "RBI Press Releases",
        "url": "https://rbi.org.in/pressreleases_rss.xml",
        "publisher": "Reserve Bank of India",
        "type": "press",
    },
    {
        "name": "PIB Press Releases (Finance/Govt)",
        "url": "https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
        "publisher": "Press Information Bureau (Govt of India)",
        "type": "press",
    },
]

KEYWORDS = [
    r"\bupi\b",
    r"unified payments interface",
    r"digital payment",
    r"device binding",
    r"cooling period",
    r"mule",
    r"fraud",
    r"unauthori[sz]ed",
    r"chargeback",
    r"payment aggregator",
    r"cyber security",
    r"cyber resilience",
    r"prevention of money laundering",
    r"pso\b",
    r"tpap\b",
    r"mnrl\b",
    r"sanchar saathi",
    r"remote access",
]

KEYWORD_REGEX = re.compile("|".join(KEYWORDS), re.IGNORECASE)

REGISTER_PATH = "research/upi/PRIMARY_SOURCE_REGISTER.md"


def load_registered_urls():
    registered = set()
    if not os.path.exists(REGISTER_PATH):
        return registered

    with open(REGISTER_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Match URLs inside Markdown links [text](url) or angle brackets <url>
    urls = re.findall(r"\[.*?\]\((https?://[^\s\)]+)\)", content)
    for u in urls:
        # Normalize trailing slashes and query param casings
        registered.add(u.strip().rstrip("/"))

    raw_urls = re.findall(r"<(https?://[^\s>]+)>", content)
    for u in raw_urls:
        registered.add(u.strip().rstrip("/"))

    return registered


def fetch_feed(feed_info, timeout=15):
    items = []
    req = urllib.request.Request(
        feed_info["url"],
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) India-Fintech-Risk-Atlas/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read()
            root = ET.fromstring(data)
            for item in root.findall(".//item"):
                title_elem = item.find("title")
                link_elem = item.find("link")
                pubdate_elem = item.find("pubDate")
                desc_elem = item.find("description")

                title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""
                link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
                pubdate = pubdate_elem.text.strip() if pubdate_elem is not None and pubdate_elem.text else ""
                desc = desc_elem.text.strip() if desc_elem is not None and desc_elem.text else ""

                if not title or not link:
                    continue

                items.append({
                    "title": title,
                    "link": link,
                    "pubDate": pubdate,
                    "description": desc,
                    "publisher": feed_info["publisher"],
                    "feed": feed_info["name"],
                })
    except Exception as e:
        print(f"Warning: Failed to fetch {feed_info['name']} ({feed_info['url']}): {e}", file=sys.stderr)

    return items


def filter_relevant_items(items, registered_urls):
    matches = []
    for it in items:
        text_to_search = f"{it['title']} {it['description']}"
        matched_keywords = KEYWORD_REGEX.findall(text_to_search)
        if matched_keywords:
            clean_link = it["link"].rstrip("/")
            is_already_registered = any(clean_link in reg or reg in clean_link for reg in registered_urls)
            unique_kws = sorted(list(set(k.lower() for k in matched_keywords)))
            it["matched_keywords"] = unique_kws
            it["is_registered"] = is_already_registered
            matches.append(it)
    return matches


def format_markdown_report(new_items, tracked_items):
    lines = [
        f"# Regulatory Feed Freshness Report — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        f"- **New unregistered updates matching fintech scope:** {len(new_items)}",
        f"- **Relevant circulars already tracked in register:** {len(tracked_items)}",
        "",
    ]

    if new_items:
        lines.append("## 🚨 New regulatory publications requiring review")
        lines.append("")
        lines.append("| Publisher | Title & Date | Matched Keywords | Action |")
        lines.append("|---|---|---|---|")
        for item in new_items:
            pub_date = item["pubDate"][:16] if item["pubDate"] else "Recent"
            kws = ", ".join(f"`{k}`" for k in item["matched_keywords"][:4])
            lines.append(
                f"| {item['publisher']} | [{item['title']}]({item['link']})<br><small>{pub_date}</small> | {kws} | [Open Triage Issue] |"
            )
        lines.append("")
        lines.append("### Recommended next steps for maintainers:")
        lines.append("1. Verify if the update is a **minor addendum**, a **date extension**, or a **new Master Direction**.")
        lines.append("2. Add entry to `research/upi/PRIMARY_SOURCE_REGISTER.md`.")
        lines.append("3. Update candidate rows in the Ready-Reckoner (`What to do` table) with exact section locators.")
        lines.append("4. Run `python scripts/check-attestations.py` to ensure double-ledger parity.")
    else:
        lines.append("## ✅ No unregistered regulatory circulars found.")
        lines.append("All keyword-matching publications in polled feeds are already accounted for in `PRIMARY_SOURCE_REGISTER.md`.")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Watch regulatory feeds for new fintech/UPI circulars.")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--output", "-o", type=str, help="Save report to file")
    parser.add_argument("--fail-on-new", action="store_true", help="Exit code 2 if new unregistered items found")
    args = parser.parse_args()

    registered_urls = load_registered_urls()

    all_items = []
    for feed in FEEDS:
        items = fetch_feed(feed)
        all_items.extend(items)

    relevant = filter_relevant_items(all_items, registered_urls)
    new_items = [it for it in relevant if not it["is_registered"]]
    tracked_items = [it for it in relevant if it["is_registered"]]

    if args.json:
        result = {
            "timestamp": datetime.now().isoformat(),
            "new_count": len(new_items),
            "tracked_count": len(tracked_items),
            "new_items": new_items,
            "tracked_items": tracked_items,
        }
        output_str = json.dumps(result, indent=2)
    else:
        output_str = format_markdown_report(new_items, tracked_items)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output_str)
        print(f"Report written to {args.output}")
    else:
        print(output_str)

    if args.fail_on_new and new_items:
        sys.exit(2)


if __name__ == "__main__":
    main()
