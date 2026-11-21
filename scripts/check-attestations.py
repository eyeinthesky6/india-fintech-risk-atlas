#!/usr/bin/env python3
"""Lightweight content attestation check. Standard library only; not a truth verifier."""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONTENT_PREFIXES = ('content/', 'data/', 'src/content/docs/')
EXEMPT = {'src/content/docs/index.mdx', 'src/content/docs/methodology.md', 'src/content/docs/contribute.md', 'src/content/docs/upi/index.md', 'src/content/docs/upi/sources.md'}

def changed_files():
    args = ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACMR'] if '--staged' in sys.argv else ['git', 'diff', '--name-only', '--diff-filter=ACMR', 'origin/main...HEAD']
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

def main():
    failures=[]
    for path in changed_files():
        if path in EXEMPT or not path.startswith(CONTENT_PREFIXES) or not path.endswith(('.md','.mdx')):
            continue
        if not (ROOT/path).exists():
            continue
        rid=record_id(path)
        if not rid:
            failures.append(f'{path}: missing record ID (frontmatter id: or **ID:**)')
            continue
        att=ROOT/'research'/'attestations'/f'{rid}.md'
        if not att.exists():
            failures.append(f'{path}: missing {att.relative_to(ROOT)}')
            continue
        body=att.read_text(encoding='utf-8')
        if not re.search(r'^Record:\s*'+re.escape(rid)+r'\s*$',body,re.M):
            failures.append(f'{att.relative_to(ROOT)}: wrong Record ID')
        boxes=re.findall(r'^- \[([ xX])\] ',body,re.M)
        if len(boxes)!=12:
            failures.append(f'{att.relative_to(ROOT)}: expected 12 checklist items, found {len(boxes)}')
        stage=re.search(r'^Stage:\s*(.+)$',body,re.M)
        if not stage or stage.group(1).strip().lower() not in {'draft','researching','source-checked','reviewed','published'}:
            failures.append(f'{att.relative_to(ROOT)}: invalid/missing Stage')
        elif stage.group(1).strip().lower() in {'reviewed','published'}:
            if len(boxes)!=12 or any(x==' ' for x in boxes):
                failures.append(f'{att.relative_to(ROOT)}: reviewed/published needs all 12 declarations')
            reviewer=re.search(r'^Independent reviewer:\s*(.+)$',body,re.M)
            researcher=re.search(r'^Researcher:\s*(.+)$',body,re.M)
            if not reviewer or not researcher or reviewer.group(1).strip() in {'','PENDING'} or researcher.group(1).strip() in {'','PENDING'} or reviewer.group(1).strip()==researcher.group(1).strip():
                failures.append(f'{att.relative_to(ROOT)}: distinct named researcher/reviewer required')
            if not (ROOT/'research'/'evidence'/f'{rid}.md').exists():
                failures.append(f'{att.relative_to(ROOT)}: evidence ledger missing')
    if failures:
        print('Attestation check FAILED:\n'+'\n'.join('- '+f for f in failures))
        return 1
    print('Attestation structure OK (does not prove research truth).')
    return 0

if __name__=='__main__':
    sys.exit(main())
