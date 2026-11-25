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


def format_notification(title, message, links):
    safe_title = html.escape(title)
    safe_message = html.escape(message)
    formatted_text = f"<b>🏛️ India Fintech Risk Atlas</b>\n\n<b>{safe_title}</b>\n\n{safe_message}"
    visible_links = []
    for label, url in links:
        if not url:
            continue
        try:
            parts = urlsplit(url)
        except ValueError:
            continue
        if parts.scheme in {'http', 'https'} and parts.hostname and parts.username is None:
            visible_links.append(f'<a href="{html.escape(url, quote=True)}">{html.escape(label)}</a>')
    if visible_links:
        formatted_text += '\n\n' + ' · '.join(visible_links)
    return formatted_text


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
    text = format_notification(args.title, summary["message"], links)
    if args.preview:
        print(text)
        return

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

    if not token or not chat_id:
        status = "Skipped because Telegram credentials are missing."
    elif send_telegram_notification(token, chat_id, text):
        status = "Telegram accepted the notification."
    else:
        status = "Telegram did not confirm delivery."

    print(status)
    if summary := os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(summary, "a", encoding="utf-8") as output:
            output.write(f"**Notification** — {status}\n\n")


if __name__ == "__main__":
    main()
