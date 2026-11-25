#!/usr/bin/env python3
"""
scripts/notify-telegram.py

Sends formatted notification alerts to a Telegram chat or channel.
Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from environment variables.
Fails softly if variables are not configured.

Usage:
    python scripts/notify-telegram.py --title "New Regulatory Alert" --message "RBI published circular X" --url "https://..."
"""

import argparse
import html
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path
from urllib.parse import urlsplit


def linked_label(label, url):
    if not url:
        return None
    try:
        parts = urlsplit(url)
    except ValueError:
        return None
    if parts.scheme in {'http', 'https'} and parts.hostname and parts.username is None:
        return f'<a href="{html.escape(url, quote=True)}">{html.escape(label)}</a>'
    return None


def format_notification(title, message, links):
    safe_title = html.escape(title)
    safe_message = html.escape(message)
    formatted_text = f"<b>🏛️ India Fintech Risk Atlas</b>\n\n<b>{safe_title}</b>\n\n{safe_message}"
    visible_links = [link for label, url in links if (link := linked_label(label, url))]
    if visible_links:
        formatted_text += '\n\n' + ' · '.join(visible_links)
    return formatted_text


def telegram_length(visible_text):
    return len(visible_text.encode('utf-16-le')) // 2


def format_notifications(title, summary, links):
    sections = summary.get('sections')
    if not sections:
        return [format_notification(title, summary['message'], links)]
    header = format_notification(title, summary['message'], [])
    footer = format_notification(title, summary['message'], links)[len(header):]
    limit = 4096 - telegram_length(f'🏛️ India Fintech Risk Atlas\n\n{title}\n\n{summary["message"]}')
    if footer:
        limit -= telegram_length('\n\n' + ' · '.join(label for label, url in links if linked_label(label, url)))
    parts = []
    body = ''
    length = 0
    for section in sections:
        heading = section['heading']
        heading_size = telegram_length(f'\n\n{heading}')
        heading_html = f'\n\n<b>{html.escape(heading)}</b>'
        next_heading = heading_html
        for item in section['items']:
            label, detail = item['label'], item.get('detail', '')
            row_size = telegram_length(f'\n• {label}{detail}')
            if length + row_size + (heading_size if next_heading else 0) > limit and body:
                parts.append(header + body + footer)
                body, length, next_heading = '', 0, heading_html
            if next_heading:
                body += next_heading
                length += heading_size
                next_heading = ''
            link = linked_label(label, item.get('url')) or html.escape(label)
            body += f'\n• {link}{html.escape(detail)}'
            length += row_size
    parts.append(header + body + footer)
    return parts


def send_telegram_notification(token: str, chat_id: str, text: str) -> bool:
    endpoint = f"https://api.telegram.org/bot{token}/sendMessage"

    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "link_preview_options": {"is_disabled": True},
    }

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                print("Telegram notification sent successfully.")
                return True
            else:
                print(f"Failed to send Telegram notification: HTTP {resp.status}", file=sys.stderr)
                return False
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        print(f"Telegram API HTTP error {e.code}: {err_body}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Error sending Telegram notification: {e}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description="Send alert to Telegram")
    parser.add_argument("--title", required=True, help="Notification title")
    body = parser.add_mutually_exclusive_group(required=True)
    body.add_argument("--message", help="Notification body text")
    body.add_argument("--summary-file", type=Path, help="JSON summary with message and links")
    parser.add_argument("--url", default=None, help="Optional link for visual inspection")
    parser.add_argument("--url-label", default="Open details", help="Text for the optional link")
    parser.add_argument("--preview", action="store_true", help="Print the notification locally")
    args = parser.parse_args()
    summary = json.loads(args.summary_file.read_text(encoding="utf-8")) if args.summary_file else {
        "message": args.message.replace("\\n", "\n"), "links": [],
    }
    links = list(summary["links"])
    if args.url:
        links.append((args.url_label, args.url))
    parts = format_notifications(args.title, summary, links)
    if args.preview:
        print('\n\n'.join(parts))
        return

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

    if not token or not chat_id:
        status = "Skipped because Telegram credentials are missing."
    else:
        sent = sum(send_telegram_notification(token, chat_id, part) for part in parts)
        if sent == len(parts):
            status = 'Telegram accepted the notification.'
        elif sent:
            status = f'Telegram accepted {sent} of {len(parts)} notification parts.'
        else:
            status = 'Telegram did not confirm delivery.'

    print(status)
    if summary := os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(summary, "a", encoding="utf-8") as output:
            output.write(f"**Notification** — {status}\n\n")


if __name__ == "__main__":
    main()
