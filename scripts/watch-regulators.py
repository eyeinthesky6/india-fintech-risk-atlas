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
import argparse
from datetime import datetime

from atlas_feeds import poll_feeds, write_reports

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

import glob

REGISTER_GLOB = "research/*/PRIMARY_SOURCE_REGISTER.md"


def normalize_url(url):
    return url.strip().rstrip("/").lower()


def load_registered_urls():
    registered = set()
    for reg_path in sorted(glob.glob(REGISTER_GLOB)):
        with open(reg_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Match URLs inside Markdown links [text](url) or angle brackets <url>
        urls = re.findall(r"\[.*?\]\((https?://[^\s\)]+)\)", content)
        for u in urls:
            registered.add(normalize_url(u))

        raw_urls = re.findall(r"<(https?://[^\s>]+)>", content)
        for u in raw_urls:
            registered.add(normalize_url(u))

    return registered


def filter_relevant_items(items, registered_urls):
    matches = []
    for it in items:
        text_to_search = f"{it['title']} {it['description']}"
        matched_keywords = KEYWORD_REGEX.findall(text_to_search)
        if matched_keywords:
            clean_link = normalize_url(it["link"])
            is_already_registered = clean_link in registered_urls
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
    parser = argparse.ArgumentParser(description="Poll the Atlas source feeds for research candidates.")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument("--output", "-o", help="Write the primary report to a file")
    parser.add_argument("--markdown-output", help="Also write Markdown from the same feed poll")
    parser.add_argument("--fail-on-new", action="store_true", help="Exit code 2 if new items are found")
    args = parser.parse_args()

    all_items, failures = poll_feeds(FEEDS, ("publisher",))
    relevant = filter_relevant_items(all_items, load_registered_urls())
    new_items = [item for item in relevant if not item["is_registered"]]
    tracked_items = [item for item in relevant if item["is_registered"]]
    report = {
        "timestamp": datetime.now().isoformat(),
        "new_count": len(new_items),
        "tracked_count": len(tracked_items),
        "new_items": new_items,
        "tracked_items": tracked_items,
    }
    result = write_reports(args, report, format_markdown_report(new_items, tracked_items), failures, len(FEEDS))
    return result or (2 if args.fail_on_new and new_items else 0)


if __name__ == "__main__":
    sys.exit(main())
