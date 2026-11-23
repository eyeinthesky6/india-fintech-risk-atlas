#!/usr/bin/env python3
"""Lightweight content attestation check. Standard library only; not a truth verifier."""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONTENT_PREFIXES = ('content/', 'data/', 'src/content/docs/')
EXEMPT = {
    'src/content/docs/index.mdx',
    'src/content/docs/methodology.md',
    'src/content/docs/contribute.md',
    'src/content/docs/evidence-policy.md',
    'src/content/docs/licensing.md',
    'src/content/docs/upi/index.md',
    'src/content/docs/upi/sources.md',
    'src/content/docs/upi/operator-insights.md',
    'src/content/docs/upi/risk-stack-playbook.md',
    'src/content/docs/upi/coverage.md',
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


def record_id(path):
    txt = (ROOT / path).read_text(encoding='utf-8')
    match = re.search(r'^id:\s*([A-Za-z0-9_-]+)\s*$', txt, re.M)
    if match:
        return match.group(1)
    match = re.search(r'\*\*ID:\*\*\s*([A-Za-z0-9_-]+)', txt)
    return match.group(1) if match else None


def check_duplicate_ids():
    seen = {}
    duplicates = []
    for path in all_content_files():
        if path in EXEMPT:
            continue
        rid = record_id(path)
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
        rid = record_id(path)
        if not rid:
            failures.append(f'{path}: missing record ID (frontmatter id: or **ID:**)')
            continue

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

        stage_m = re.search(r'^Stage:\s*(.+)$', body, re.M)
        stage = stage_m.group(1).strip().lower() if stage_m else ''
        if stage not in {'draft', 'researching', 'source-checked', 'reviewed', 'published'}:
            failures.append(f'{att_rel}: invalid/missing Stage')
        elif stage == 'source-checked':
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
