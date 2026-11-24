#!/usr/bin/env python3
"""Tiered citation, deprecation, and freshness verifier for India Fintech Risk Atlas.

Standard library only (Python 3.8+). Does not bypass WAFs, auth walls, or CAPTCHAs:
inaccessible/WAF/JS-SPA sources are queued for manual in-browser computer-use verification.
"""
import argparse
import datetime
import html
import json
import pathlib
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
TAXONOMY = json.loads((ROOT / 'src' / 'taxonomy.json').read_text(encoding='utf-8'))
DOCS_ROOT = ROOT / 'src' / 'content' / 'docs'
LYCHEEIGNORE_PATH = ROOT / '.lycheeignore'
USER_AGENT = 'IndiaFintechRiskAtlas-CitationCheck/1.0 (+https://github.com/eyeinthesky6/india-fintech-risk-atlas)'
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
URL_RE = re.compile(r'https?://[^\s\)\]>"]+')
SOFT_404_RE = re.compile(r'\b(?:404|page\s+not\s+found|error\s+404|cannot\s+be\s+found)\b', re.I)

EXEMPT = {
    'src/content/docs/404.md',
    'src/content/docs/index.mdx',
    'src/content/docs/methodology.md',
    'src/content/docs/contribute.md',
    'src/content/docs/evidence-policy.md',
    'src/content/docs/licensing.md',
    'src/content/docs/upi/index.mdx',
    'src/content/docs/upi/sources.md',
    'src/content/docs/upi/operator-insights.md',
    'src/content/docs/upi/risk-stack-playbook.md',
    'src/content/docs/upi/coverage.mdx',
    'src/content/docs/upi/glossary.md',
}

DEPRECATED_URL_PATTERNS = [
    (
        re.compile(r'https?://(?:www\.)?npci\.org\.in/what-we-do/upi/', re.I),
        'Retired NPCI SPA route; replace with canonical /product/upi/* or /faqs/upi URLs',
    ),
]


def configure_stdio():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')


def unquote(val):
    val = val.strip()
    if len(val) >= 2 and ((val[0] == val[-1] == '"') or (val[0] == val[-1] == "'")):
        return val[1:-1].strip()
    return val


def parse_record_frontmatter(txt):
    normalized = txt.replace('\r\n', '\n')
    if not normalized.startswith('---\n'):
        return {}, []
    end = normalized.find('\n---\n', 4)
    if end == -1:
        end = len(normalized) - 4 if normalized.endswith('\n---') else -1
    if end == -1:
        return {}, []

    scalars = {}
    lists = {}
    current_list_key = None
    for line in normalized[4:end].splitlines():
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        list_item = re.match(r'^\s+-\s+(.+?)\s*$', line)
        if list_item and current_list_key:
            lists.setdefault(current_list_key, []).append(unquote(list_item.group(1)))
            continue
        kv = re.match(r'^([A-Za-z][A-Za-z0-9_]*):\s*(.*?)\s*$', line)
        if not kv:
            current_list_key = None
            continue
        key, raw_val = kv.group(1), kv.group(2)
        if not raw_val:
            current_list_key = key
            lists.setdefault(key, [])
        elif raw_val.startswith('[') and raw_val.endswith(']'):
            current_list_key = None
            items = [unquote(x) for x in raw_val[1:-1].split(',') if x.strip()]
            lists[key] = items
        else:
            current_list_key = None
            scalars[key] = unquote(raw_val)
    return scalars, lists.get('evidenceLayers', [])


def clean_url(url):
    return url.rstrip('.,;\'"`')


def extract_reference_urls(txt):
    normalized = txt.replace('\r\n', '\n')
    m = re.search(r'^##\s+References\b[^\n]*\n(.*?)(?=^##\s+|\Z)', normalized, re.M | re.S | re.I)
    if not m:
        return []
    return sorted({clean_url(u) for u in URL_RE.findall(m.group(1))})


def extract_all_external_urls(txt):
    return sorted({clean_url(u) for u in URL_RE.findall(txt)})


def load_lycheeignore_url_patterns():
    if not LYCHEEIGNORE_PATH.exists():
        return []
    patterns = []
    for raw in LYCHEEIGNORE_PATH.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        if 'http' not in line and r'npci\.org\.in' not in line:
            continue
        try:
            patterns.append(re.compile(line))
        except re.error:
            continue
    return patterns


def collect_target_files(args):
    if args.files:
        files = []
        for raw in args.files:
            p = pathlib.Path(raw)
            if not p.is_absolute():
                p = (ROOT / p).resolve()
            else:
                p = p.resolve()
            if not p.exists():
                raise FileNotFoundError(f'File not found: {raw}')
            files.append(p.relative_to(ROOT).as_posix())
        return sorted(dict.fromkeys(files))

    files = []
    if DOCS_ROOT.exists():
        for p in sorted(DOCS_ROOT.rglob('*')):
            if p.is_file() and p.suffix in {'.md', '.mdx'}:
                rel = p.relative_to(ROOT).as_posix()
                if rel not in EXEMPT:
                    files.append(rel)
    return files


def extract_html_signals(raw_bytes):
    text = raw_bytes.decode('utf-8', errors='ignore')
    title_m = re.search(r'<title[^>]*>(.*?)</title>', text, re.I | re.S)
    title = html.unescape(re.sub(r'\s+', ' ', title_m.group(1))).strip() if title_m else ''
    h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', text, re.I | re.S)
    h1 = html.unescape(re.sub(r'<[^>]+>', ' ', h1_m.group(1))).strip() if h1_m else ''
    body = re.sub(r'<(script|style|noscript)[^>]*>.*?</\1>', ' ', text, flags=re.I | re.S)
    visible = html.unescape(re.sub(r'<[^>]+>', ' ', body))
    visible = re.sub(r'\s+', ' ', visible).strip()
    return text.lower(), title, h1, visible


def is_material_redirect(orig_url, final_url):
    o = urllib.parse.urlsplit(orig_url)
    f = urllib.parse.urlsplit(final_url)
    return (
        o.netloc.lower() != f.netloc.lower()
        or o.path.rstrip('/') != f.path.rstrip('/')
        or o.query != f.query
    )


def probe_url(url, ignore_patterns, offline):
    for pat, reason in DEPRECATED_URL_PATTERNS:
        if pat.search(url):
            return {'status': 'BROKEN_OR_DEPRECATED', 'reason': reason, 'redirected_to': None}

    for pat in ignore_patterns:
        if pat.search(url):
            return {
                'status': 'NEEDS_BROWSER_FALLBACK',
                'reason': 'WAF/CLI-excluded in .lycheeignore; verify via browser computer-use',
                'redirected_to': None,
            }

    if offline:
        return {'status': 'SKIPPED_OFFLINE', 'reason': 'Offline mode (--offline)', 'redirected_to': None}

    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/pdf,application/xhtml+xml;q=0.9,*/*;q=0.8',
        },
        method='GET',
    )
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            code = getattr(resp, 'status', 200)
            final_url = resp.geturl()
            redir = final_url if is_material_redirect(url, final_url) else None
            content_type = (resp.headers.get('Content-Type') or '').lower()
            raw = resp.read(65536)

            if code != 200:
                return {'status': 'NEEDS_BROWSER_FALLBACK', 'reason': f'HTTP {code}', 'redirected_to': redir}

            if 'application/pdf' in content_type or raw.startswith(b'%PDF-'):
                return {'status': 'OK_HTTP', 'reason': 'HTTP 200 PDF', 'redirected_to': redir}

            lower_raw, title, h1, visible = extract_html_signals(raw)
            if SOFT_404_RE.search(title) or SOFT_404_RE.search(h1):
                return {
                    'status': 'BROKEN_OR_DEPRECATED',
                    'reason': f'Soft-404 detected in page title/h1 ({title or h1})',
                    'redirected_to': redir,
                }

            spa_markers = ('<app-root', 'id="root"', "id='root'", 'id="__next"', 'enable javascript')
            if len(visible) < 200 and any(m in lower_raw for m in spa_markers):
                return {
                    'status': 'NEEDS_BROWSER_FALLBACK',
                    'reason': 'JS SPA shell with minimal rendered HTML text; verify in browser',
                    'redirected_to': redir,
                }

            return {'status': 'OK_HTTP', 'reason': 'HTTP 200 HTML', 'redirected_to': redir}

    except urllib.error.HTTPError as err:
        if err.code in {401, 403, 429, 503}:
            return {
                'status': 'NEEDS_BROWSER_FALLBACK',
                'reason': f'HTTP {err.code} (WAF, auth, or rate-limit); verify via browser computer-use',
                'redirected_to': None,
            }
        if err.code in {404, 410}:
            return {
                'status': 'BROKEN_OR_DEPRECATED',
                'reason': f'HTTP {err.code} Not Found/Gone',
                'redirected_to': None,
            }
        return {'status': 'BROKEN_OR_DEPRECATED', 'reason': f'HTTP {err.code}', 'redirected_to': None}

    except (urllib.error.URLError, OSError, ssl.SSLError) as err:
        reason_str = str(getattr(err, 'reason', err))
        lower_err = reason_str.lower()
        if any(tok in lower_err for tok in ('getaddrinfo', 'nameresolutionerror', 'name or service not known', 'nodename')):
            return {'status': 'BROKEN_OR_DEPRECATED', 'reason': f'DNS failure: {reason_str}', 'redirected_to': None}
        return {
            'status': 'NEEDS_BROWSER_FALLBACK',
            'reason': f'Connection/TLS/timeout blocker ({reason_str}); verify via browser computer-use',
            'redirected_to': None,
        }


def analyze(args):
    as_of = datetime.date.fromisoformat(args.as_of) if args.as_of else datetime.date.today()
    ignore_patterns = load_lycheeignore_url_patterns()
    target_files = collect_target_files(args)

    records = []
    url_refs = {}
    missing_ledger_urls = []
    invalid_dates = []
    stale_records = []

    for rel in target_files:
        full_path = ROOT / rel
        txt = full_path.read_text(encoding='utf-8')
        fm, layers = parse_record_frontmatter(txt)
        rid = fm.get('recordId') or fm.get('id')
        if not rid:
            continue

        stage = fm.get('reviewStage', '').strip().lower()
        last_check = fm.get('lastSourceCheck', '').strip()
        threshold = args.max_age_days if args.max_age_days is not None else (90 if 'official' in layers else 180)

        if not last_check:
            if stage in {'source-checked', 'reviewed', 'published'}:
                invalid_dates.append({'recordId': rid, 'file': rel, 'reason': f'Missing lastSourceCheck on {stage} record'})
        elif not DATE_RE.match(last_check):
            invalid_dates.append({'recordId': rid, 'file': rel, 'reason': f'Invalid lastSourceCheck format: {last_check}'})
        else:
            checked_dt = datetime.date.fromisoformat(last_check)
            age_days = (as_of - checked_dt).days
            if age_days > threshold:
                stale_records.append({
                    'recordId': rid,
                    'stage': stage or 'unknown',
                    'lastSourceCheck': last_check,
                    'ageDays': age_days,
                    'thresholdDays': threshold,
                    'file': rel,
                })

        ref_urls = extract_reference_urls(txt)
        ev_path = ROOT / 'research' / 'evidence' / f'{rid}.md'
        ev_urls = []
        if ev_path.exists():
            ev_txt = ev_path.read_text(encoding='utf-8')
            ev_urls = extract_all_external_urls(ev_txt)
            for url in ref_urls:
                if url not in ev_txt:
                    missing_ledger_urls.append({'recordId': rid, 'file': rel, 'url': url})

        combined_urls = sorted(set(ref_urls) | set(ev_urls))
        for url in combined_urls:
            url_refs.setdefault(url, set()).add(rid)

        records.append({'recordId': rid, 'stage': stage, 'lastSourceCheck': last_check, 'file': rel})

    url_results = {}
    for url in sorted(url_refs):
        res = probe_url(url, ignore_patterns, args.offline)
        url_results[url] = {
            **res,
            'url': url,
            'records': sorted(url_refs[url]),
        }

    broken = [v for v in url_results.values() if v['status'] == 'BROKEN_OR_DEPRECATED']
    browser_queue = [v for v in url_results.values() if v['status'] == 'NEEDS_BROWSER_FALLBACK']
    ok_http = [v for v in url_results.values() if v['status'] == 'OK_HTTP']
    skipped_offline = [v for v in url_results.values() if v['status'] == 'SKIPPED_OFFLINE']

    return {
        'mode': 'offline' if args.offline else 'online',
        'as_of': as_of.isoformat(),
        'summary': {
            'records': len(records),
            'unique_urls': len(url_results),
            'ok_http': len(ok_http),
            'skipped_offline': len(skipped_offline),
            'needs_browser_fallback': len(browser_queue),
            'broken_or_deprecated': len(broken),
            'missing_ledger_urls': len(missing_ledger_urls),
            'invalid_dates': len(invalid_dates),
            'stale_records': len(stale_records),
        },
        'stale_records': stale_records,
        'broken_or_deprecated': broken,
        'missing_ledger_urls': missing_ledger_urls,
        'invalid_dates': invalid_dates,
        'browser_queue': browser_queue,
        'ok_http': ok_http,
    }


def render_markdown(report):
    s = report['summary']
    lines = [
        f"# Citation & Freshness Triage Report ({report['mode']}, as-of `{report['as_of']}`)",
        '',
        f"- **Records scanned:** {s['records']}",
        f"- **Unique citation URLs:** {s['unique_urls']} (`{s['ok_http']}` OK HTTP, `{s['skipped_offline']}` skipped offline, `{s['needs_browser_fallback']}` queued for browser check, `{s['broken_or_deprecated']}` broken/deprecated)",
        f"- **Metadata & parity issues:** `{s['invalid_dates']}` invalid/missing `lastSourceCheck`, `{s['missing_ledger_urls']}` reference URLs missing in evidence ledger",
        f"- **Stale records (90d `official` / 180d non-official SLA):** {s['stale_records']}",
        '',
        '## Stale records',
        '',
    ]
    if not report['stale_records']:
        lines.append('None.')
    else:
        lines.extend([
            '| Record | Stage | Last Checked | Age (days) | SLA (days) | File |',
            '|---|---|---|---:|---:|---|',
        ])
        for item in report['stale_records']:
            lines.append(
                f"| `{item['recordId']}` | `{item['stage']}` | `{item['lastSourceCheck']}` | {item['ageDays']} | {item['thresholdDays']} | `{item['file']}` |"
            )

    lines.extend(['', '## Broken / deprecated citations & metadata errors', ''])
    if not (report['broken_or_deprecated'] or report['missing_ledger_urls'] or report['invalid_dates']):
        lines.append('None.')
    else:
        if report['invalid_dates']:
            for item in report['invalid_dates']:
                lines.append(f"- **`{item['recordId']}` (`{item['file']}`):** {item['reason']}")
        if report['missing_ledger_urls']:
            for item in report['missing_ledger_urls']:
                lines.append(f"- **`{item['recordId']}` (`{item['file']}`):** External reference URL missing from evidence ledger: `{item['url']}`")
        if report['broken_or_deprecated']:
            lines.extend([
                '',
                '| URL | Affected Records | Reason |',
                '|---|---|---|',
            ])
            for item in report['broken_or_deprecated']:
                recs = ', '.join(f'`{r}`' for r in item['records'])
                lines.append(f"| `{item['url']}` | {recs} | {item['reason']} |")

    lines.extend(['', '## Manual browser verification queue', ''])
    if not report['browser_queue']:
        lines.append('None.')
    else:
        lines.extend([
            '| URL | Affected Records | Reason |',
            '|---|---|---|',
        ])
        for item in report['browser_queue']:
            recs = ', '.join(f'`{r}`' for r in item['records'])
            lines.append(f"| `{item['url']}` | {recs} | {item['reason']} |")

    redirected = [x for x in report['ok_http'] if x.get('redirected_to')]
    if redirected:
        lines.extend(['', '## Redirected HTTP URLs (review canonical URL)', ''])
        for item in redirected:
            recs = ', '.join(f'`{r}`' for r in item['records'])
            lines.append(f"- `{item['url']}` -> `{item['redirected_to']}` ({recs})")

    return '\n'.join(lines) + '\n'


def parse_args():
    parser = argparse.ArgumentParser(description='Verify citations, deprecations, browser fallback queue, and freshness SLAs.')
    scope = parser.add_mutually_exclusive_group()
    scope.add_argument('--all', action='store_true', help='Scan all canonical records under src/content/docs/ (default)')
    scope.add_argument('--files', nargs='+', help='Scan specific markdown/mdx article files')
    parser.add_argument('--offline', action='store_true', help='Skip live HTTP probes; run offline deprecation, parity, .lycheeignore queue, and freshness checks')
    parser.add_argument('--max-age-days', type=int, default=None, help='Override staleness threshold in days (default: 90 with official layer, 180 otherwise)')
    parser.add_argument('--as-of', default=None, help='Reference date YYYY-MM-DD for freshness calculation (default: today)')
    parser.add_argument('--fail-on-stale', action='store_true', help='Exit 1 if any record exceeds the freshness SLA')
    parser.add_argument('--no-fail-on-broken', action='store_true', help='Do not exit 1 on broken/deprecated URLs or invalid metadata')
    parser.add_argument('--json', action='store_true', help='Output structured JSON instead of Markdown')
    return parser.parse_args()


def main():
    configure_stdio()
    args = parse_args()
    report = analyze(args)
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(render_markdown(report), end='')

    s = report['summary']
    has_broken = bool(s['broken_or_deprecated'] or s['missing_ledger_urls'] or s['invalid_dates'])
    has_stale = bool(s['stale_records'])
    if has_broken and not args.no_fail_on_broken:
        return 1
    if args.fail_on_stale and has_stale:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
