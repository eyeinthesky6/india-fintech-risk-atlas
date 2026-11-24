#!/usr/bin/env python3
"""Lightweight content attestation check. Standard library only; not a truth verifier."""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
TAXONOMY = json.loads((ROOT / 'src' / 'taxonomy.json').read_text(encoding='utf-8'))
CONTENT_PREFIXES = ('src/content/docs/',)
VALID_STAGES = set(TAXONOMY['reviewStages'])
RECORD_ID_RE = re.compile(TAXONOMY['recordIdPattern'])
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
DEPRECATED_REF_URL_RES = [
    re.compile(r'https?://(?:www\.)?npci\.org\.in/what-we-do/upi/', re.I),
]
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


def all_content_files():
    files = []
    for prefix in CONTENT_PREFIXES:
        base = ROOT / prefix
        if not base.exists():
            continue
        for p in sorted(base.rglob('*')):
            if p.is_file() and p.suffix in {'.md', '.mdx'}:
                files.append(p.relative_to(ROOT).as_posix())
    return files


def target_files():
    if '--all' in sys.argv:
        return all_content_files()
    args = (
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACMR']
        if '--staged' in sys.argv
        else ['git', 'diff', '--name-only', '--diff-filter=ACMR', 'origin/main...HEAD']
    )
    try:
        return subprocess.check_output(args, cwd=ROOT, text=True).splitlines()
    except subprocess.CalledProcessError:
        print('Cannot determine changed files; refusing to claim validation.', file=sys.stderr)
        sys.exit(2)


def parse_frontmatter(txt):
    normalized = txt.replace('\r\n', '\n')
    if not normalized.startswith('---\n'):
        return {}
    end = normalized.find('\n---\n', 4)
    if end == -1:
        if normalized.endswith('\n---'):
            end = len(normalized) - 4
        else:
            return {}
    block = normalized[4:end]
    scalars = {}
    for line in block.splitlines():
        m = re.match(r'^([A-Za-z][A-Za-z0-9_]*):\s*(.+?)\s*$', line)
        if not m:
            continue
        key, val = m.group(1), m.group(2)
        if len(val) >= 2 and ((val[0] == val[-1] == '"') or (val[0] == val[-1] == "'")):
            val = val[1:-1]
        scalars[key] = val
    return scalars


def extract_reference_urls(txt):
    normalized = txt.replace('\r\n', '\n')
    m = re.search(r'^##\s+References\b[^\n]*\n(.*?)(?=^##\s+|\Z)', normalized, re.M | re.S | re.I)
    if not m:
        return False, []
    urls = sorted({u.rstrip('.,;\'"`') for u in re.findall(r'https?://[^\s\)\]>"]+', m.group(1))})
    return True, urls


def record_id_from_frontmatter(fm):
    return fm.get('recordId') or fm.get('id')


def check_duplicate_ids():
    seen = {}
    duplicates = []
    for path in all_content_files():
        if path in EXEMPT:
            continue
        fm = parse_frontmatter((ROOT / path).read_text(encoding='utf-8'))
        rid = record_id_from_frontmatter(fm)
        if not rid:
            continue
        if rid in seen:
            duplicates.append(f'duplicate record ID {rid}: {seen[rid]} and {path}')
        else:
            seen[rid] = path
    return duplicates


def is_pending(val):
    return not val or val.strip().upper() == 'PENDING'


def main():
    failures = check_duplicate_ids()
    for path in target_files():
        if path in EXEMPT or not path.startswith(CONTENT_PREFIXES) or not path.endswith(('.md', '.mdx')):
            continue
        if not (ROOT / path).exists():
            continue

        txt = (ROOT / path).read_text(encoding='utf-8')
        fm = parse_frontmatter(txt)
        rid = record_id_from_frontmatter(fm)
        if not rid:
            failures.append(f'{path}: missing frontmatter recordId')
            continue
        if not RECORD_ID_RE.match(rid):
            failures.append(f'{path}: invalid frontmatter recordId ({rid})')
            continue

        fm_stage = fm.get('reviewStage', '').strip().lower()
        if fm_stage not in VALID_STAGES:
            failures.append(f'{path}: invalid/missing frontmatter reviewStage ({fm_stage or "MISSING"})')

        att = ROOT / 'research' / 'attestations' / f'{rid}.md'
        if not att.exists():
            failures.append(f'{path}: missing {att.relative_to(ROOT).as_posix()}')
            continue

        ev = ROOT / 'research' / 'evidence' / f'{rid}.md'
        if not ev.exists():
            failures.append(f'{path}: missing {ev.relative_to(ROOT).as_posix()}')
            continue

        body = att.read_text(encoding='utf-8')
        ev_body = ev.read_text(encoding='utf-8')
        att_rel = att.relative_to(ROOT).as_posix()
        ev_rel = ev.relative_to(ROOT).as_posix()

        if not re.search(r'^Record:\s*' + re.escape(rid) + r'\s*$', body, re.M):
            failures.append(f'{att_rel}: wrong Record ID')

        boxes = re.findall(r'^- \[([ xX])\] ', body, re.M)
        if len(boxes) != 12:
            failures.append(f'{att_rel}: expected 12 checklist items, found {len(boxes)}')

        researcher_m = re.search(r'^Researcher:\s*(.*)$', body, re.M)
        reviewer_m = re.search(r'^Independent reviewer:\s*(.*)$', body, re.M)
        researcher = researcher_m.group(1).strip() if researcher_m else ''
        reviewer = reviewer_m.group(1).strip() if reviewer_m else ''

        if not is_pending(reviewer) and reviewer == researcher:
            failures.append(f'{att_rel}: independent reviewer cannot match researcher ({reviewer})')

        if len(boxes) == 12 and is_pending(reviewer):
            if any(boxes[i].lower() == 'x' for i in (7, 8, 9, 11)):
                failures.append(f'{att_rel}: reviewer/publication declarations checked while Independent reviewer is PENDING')

        last_check = fm.get('lastSourceCheck', '').strip()
        if last_check and not DATE_RE.match(last_check):
            failures.append(f'{path}: invalid lastSourceCheck format ({last_check}; expected YYYY-MM-DD)')

        stage_m = re.search(r'^Stage:\s*(.+)$', body, re.M)
        stage = stage_m.group(1).strip().lower() if stage_m else ''
        if stage not in VALID_STAGES:
            failures.append(f'{att_rel}: invalid/missing Stage')
        else:
            if fm_stage in VALID_STAGES and fm_stage != stage:
                failures.append(f'{path}: frontmatter reviewStage ({fm_stage}) does not match {att_rel} Stage ({stage})')
            if stage in {'source-checked', 'reviewed', 'published'} and not last_check:
                failures.append(f'{path}: missing lastSourceCheck required for {stage} stage')

            has_refs, ref_urls = extract_reference_urls(txt)
            if stage in {'source-checked', 'reviewed', 'published'} and not has_refs:
                failures.append(f'{path}: missing ## References section required for {stage} stage')
            for url in ref_urls:
                if any(p.search(url) for p in DEPRECATED_REF_URL_RES):
                    failures.append(f'{path}: deprecated/retired reference URL: {url}')
                if url not in ev_body:
                    failures.append(f'{path}: external reference URL not recorded in {ev_rel}: {url}')

            if stage == 'source-checked':
                if is_pending(researcher):
                    failures.append(f'{att_rel}: source-checked stage requires named Researcher')
                if re.search(r'\|\s*(PENDING|unverified|blocked\b[^|]*)\s*\|', ev_body, re.I):
                    failures.append(f'{ev_rel}: source-checked record cannot contain PENDING/unverified/blocked claims')
            elif stage in {'reviewed', 'published'}:
                if len(boxes) != 12 or any(x == ' ' for x in boxes):
                    failures.append(f'{att_rel}: reviewed/published needs all 12 declarations')
                if is_pending(reviewer) or is_pending(researcher) or reviewer == researcher:
                    failures.append(f'{att_rel}: distinct named researcher/reviewer required')
                ev_rev_m = re.search(r'^Independent reviewer:\s*(.*)$', ev_body, re.M)
                ev_rev = ev_rev_m.group(1).strip() if ev_rev_m else ''
                if is_pending(ev_rev) or ev_rev == researcher:
                    failures.append(f'{ev_rel}: distinct named Independent reviewer required in evidence ledger')
                if re.search(r'\|\s*(PENDING|unverified|blocked\b[^|]*)\s*\|', ev_body, re.I):
                    failures.append(f'{ev_rel}: reviewed/published record cannot contain PENDING/unverified/blocked claims')

    if failures:
        print('Attestation check FAILED:\n' + '\n'.join('- ' + f for f in failures))
        return 1
    print('Attestation structure OK (does not prove research truth).')
    return 0


if __name__ == '__main__':
    sys.exit(main())
