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
import json
import os
import sys
import urllib.request
import urllib.error


def send_telegram_notification(token: str, chat_id: str, title: str, message: str, url: str | None = None) -> bool:
    endpoint = f"https://api.telegram.org/bot{token}/sendMessage"

    formatted_text = f"<b>🏛️ India Fintech Risk Atlas</b>\n\n<b>{title}</b>\n\n{message}"
    if url:
        formatted_text += f'\n\n🔗 <a href="{url}">View on Live Website</a>'

    payload = {
        "chat_id": chat_id,
        "text": formatted_text,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,
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
    parser.add_argument("--message", required=True, help="Notification body text")
    parser.add_argument("--url", default=None, help="Optional link for visual inspection")
    args = parser.parse_args()

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

    if not token or not chat_id:
        print("Notice: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in environment. Skipping notification.")
        sys.exit(0)

    success = send_telegram_notification(token, chat_id, args.title, args.message, args.url)
    if not success:
        # Non-zero exit is not triggered to avoid breaking the caller workflow
        print("Warning: Telegram notification failed to deliver.", file=sys.stderr)


if __name__ == "__main__":
    main()
