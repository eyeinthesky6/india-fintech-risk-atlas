"""Shared RSS/Atom collection and reporting for the Atlas watchers."""

import json
import os
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


ATOM = "{http://www.w3.org/2005/Atom}"


def fetch_entries(url, timeout=15):
    request = urllib.request.Request(url, headers={"User-Agent": "India-Fintech-Risk-Atlas/1.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        root = ET.fromstring(response.read())
    if root.tag.rsplit('}', 1)[-1].lower() not in ('rss', 'feed'):
        raise ValueError("Unexpected feed format")

    entries = root.findall(".//item") or root.findall(f".//{ATOM}entry")
    results = []
    for entry in entries:
        atom = entry.tag == f"{ATOM}entry"
        prefix = ATOM if atom else ""
        title = (entry.findtext(f"{prefix}title") or "").strip()
        link = entry.find(f"{prefix}link")
        url = ((link.text or link.get("href") or "").strip()) if link is not None else ""
        if title and url.startswith(("https://", "http://")):
            results.append({
                "title": title,
                "link": url,
                "pubDate": (entry.findtext(f"{ATOM}updated" if atom else "pubDate") or "").strip(),
                "description": (entry.findtext(f"{ATOM}summary" if atom else "description") or "").strip(),
            })
    return results


def poll_feeds(feeds, fields, normalize_url=lambda url: url):
    items = []
    failures = []
    for feed in feeds:
        try:
            entries = fetch_entries(feed["url"])
        except (OSError, ValueError, ET.ParseError) as error:
            print(f"Feed unavailable: {feed['name']} ({type(error).__name__})", file=sys.stderr)
            failures.append(feed["name"])
            continue
        for entry in entries:
            entry["link"] = normalize_url(entry["link"])
            items.append({**entry, "feed": feed["name"], **{key: feed[key] for key in fields}})
    return items, failures


def write_reports(args, report, markdown, failures, feed_count):
    report["feeds_checked"] = feed_count - len(failures)
    report["failed_feeds"] = failures
    all_failed = len(failures) == feed_count
    if all_failed:
        markdown = f"{markdown.splitlines()[0]}\n\nNo feeds were reachable. Unavailable feeds: {', '.join(failures)}.\n"
    elif failures:
        markdown = f"> Some feeds were unavailable: {', '.join(failures)}.\n\n{markdown}"
    output = json.dumps(report, indent=2) if args.json else markdown
    if args.output:
        Path(args.output).write_text(output, encoding="utf-8")
    else:
        print(output)
    if args.markdown_output:
        Path(args.markdown_output).write_text(markdown, encoding="utf-8")
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as summary:
            summary.write(
                f"Feed poll checked {report['feeds_checked']} of {feed_count} feeds "
                f"and found {report['new_count']} candidates.\n\n"
            )
            if failures:
                summary.write(f"Unavailable feeds: {', '.join(failures)}.\n\n")
    return 1 if all_failed else 0
