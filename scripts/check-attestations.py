#!/usr/bin/env python3
"""Lightweight content attestation check. Standard library only; not a truth verifier."""
import json
from datetime import date
import pathlib
import re
import subprocess
import sys

from atlas_citations import deprecated_url_reason, missing_evidence_urls, reference_urls

ROOT = pathlib.Path(__file__).resolve().parents[1]
CONTENT_PREFIXES = ('src/content/docs/',)
LEDGER_PREFIXES = ('research/attestations/', 'research/evidence/')
DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
REVIEWER_ID_RE = re.compile(r'^reviewer-[a-f0-9]{12}$')
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


def git_output(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT).decode('utf-8')


class ContentView:
    def __init__(self, staged):
        self.staged = staged
        self.index = (set(git_output('ls-files', '--cached', '-z').split('\0'))
                      if staged else None)

    def read(self, path):
        if self.staged:
            return git_output('show', ':' + path) if path in self.index else None
        file = ROOT / path
        return file.read_text(encoding='utf-8') if file.is_file() else None

    def records(self):
        if self.staged:
            paths = self.index
        else:
            paths = ((path.relative_to(ROOT).as_posix()) for path in
                     (ROOT / CONTENT_PREFIXES[0]).rglob('*') if path.is_file())
        return sorted(path for path in paths
                      if path.startswith(CONTENT_PREFIXES) and path.endswith(('.md', '.mdx'))
                      and path not in EXEMPT)

    def changes(self):
        if self.staged:
            return git_output('diff', '--cached', '--no-renames', '--name-only', '-z').split('\0')
        return git_output('diff', '--no-renames', '--name-only', '-z', 'origin/main...HEAD').split('\0')


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


def record_id_from_frontmatter(fm):
    return fm.get('recordId') or fm.get('id')


def check_duplicate_ids(view, paths):
    seen = {}
    duplicates = []
    for path in paths:
        fm = parse_frontmatter(view.read(path))
        rid = record_id_from_frontmatter(fm)
        if not rid:
            continue
        if rid in seen:
            duplicates.append(f'duplicate record ID {rid}: {seen[rid]} and {path}')
        else:
            seen[rid] = path
    return seen, duplicates


def is_pending(val):
    return not val or val.strip().upper() == 'PENDING'


def same_person(a, b):
    return bool(a and b and a.strip().lower() == b.strip().lower())


def resolve_target_content_files(view, paths, id_map):
    if '--all' in sys.argv:
        return paths

    changed = view.changes()
    if view.staged and any(path.startswith(CONTENT_PREFIXES + LEDGER_PREFIXES) or
                           path == 'src/taxonomy.json' for path in changed):
        return paths
    selected = set()
    available = set(paths)
    for path in changed:
        if path in available:
            selected.add(path)
        elif path.startswith(LEDGER_PREFIXES) and path.endswith('.md'):
            record = id_map.get(pathlib.Path(path).stem)
            if record:
                selected.add(record)
    return sorted(selected)


def main():
    view = ContentView('--staged' in sys.argv)
    taxonomy = json.loads(view.read('src/taxonomy.json'))
    valid_stages = set(taxonomy['reviewStages'])
    record_id_re = re.compile(taxonomy['recordIdPattern'])
    paths = view.records()
    id_map, failures = check_duplicate_ids(view, paths)
    for path in resolve_target_content_files(view, paths, id_map):
        txt = view.read(path)
        fm = parse_frontmatter(txt)
        rid = record_id_from_frontmatter(fm)
        if not rid:
            failures.append(f'{path}: missing frontmatter recordId')
            continue
        if not record_id_re.fullmatch(rid):
            failures.append(f'{path}: invalid frontmatter recordId ({rid})')
            continue

        fm_stage = fm.get('reviewStage', '').strip().lower()
        if fm_stage not in valid_stages:
            failures.append(f'{path}: invalid/missing frontmatter reviewStage ({fm_stage or "MISSING"})')

        att_rel = f'research/attestations/{rid}.md'
        ev_rel = f'research/evidence/{rid}.md'
        body = view.read(att_rel)
        ev_body = view.read(ev_rel)
        if body is None:
            failures.append(f'{path}: missing {att_rel}')
        if ev_body is None:
            failures.append(f'{path}: missing {ev_rel}')
        if body is None or ev_body is None:
            continue

        if not re.search(r'^Record:\s*' + re.escape(rid) + r'\s*$', body, re.M):
            failures.append(f'{att_rel}: wrong Record ID')

        boxes = re.findall(r'^- \[([ xX])\] ', body, re.M)
        if len(boxes) != 12:
            failures.append(f'{att_rel}: expected 12 checklist items, found {len(boxes)}')

        researcher_m = re.search(r'^Researcher:\s*(.*)$', body, re.M)
        reviewer_m = re.search(r'^Independent reviewer:\s*(.*)$', body, re.M)
        researcher = researcher_m.group(1).strip() if researcher_m else ''
        reviewer = reviewer_m.group(1).strip() if reviewer_m else ''

        if not is_pending(reviewer) and same_person(reviewer, researcher):
            failures.append(f'{att_rel}: independent reviewer cannot match researcher ({reviewer})')

        if len(boxes) == 12 and is_pending(reviewer):
            if any(boxes[i].lower() == 'x' for i in (7, 8, 9, 11)):
                failures.append(f'{att_rel}: reviewer/publication declarations checked while Independent reviewer is PENDING')

        last_check = fm.get('lastSourceCheck', '').strip()
        if last_check:
            try:
                if not DATE_RE.fullmatch(last_check):
                    raise ValueError()
                date.fromisoformat(last_check)
            except ValueError:
                failures.append(f'{path}: invalid lastSourceCheck ({last_check}; expected a real YYYY-MM-DD date)')

        stage_m = re.search(r'^Stage:\s*(.+)$', body, re.M)
        stage = stage_m.group(1).strip().lower() if stage_m else ''
        if stage not in valid_stages:
            failures.append(f'{att_rel}: invalid/missing Stage')
        else:
            if fm_stage in valid_stages and fm_stage != stage:
                failures.append(f'{path}: frontmatter reviewStage ({fm_stage}) does not match {att_rel} Stage ({stage})')
            if stage in {'source-checked', 'reviewed', 'published'} and not last_check:
                failures.append(f'{path}: missing lastSourceCheck required for {stage} stage')

            has_refs, ref_urls = reference_urls(txt)
            if stage in {'source-checked', 'reviewed', 'published'} and not has_refs:
                failures.append(f'{path}: missing ## References section required for {stage} stage')
            for url in ref_urls:
                if deprecated_url_reason(url):
                    failures.append(f'{path}: deprecated/retired reference URL: {url}')
            for url in missing_evidence_urls(ref_urls, ev_body):
                failures.append(f'{path}: external reference URL not recorded in {ev_rel}: {url}')

            if stage == 'source-checked':
                if is_pending(researcher):
                    failures.append(f'{att_rel}: source-checked stage requires named Researcher')
                if re.search(r'\|\s*(PENDING|unverified|blocked\b[^|]*)\s*\|', ev_body, re.I):
                    failures.append(f'{ev_rel}: source-checked record cannot contain PENDING/unverified/blocked claims')
            elif stage in {'reviewed', 'published'}:
                if len(boxes) != 12 or any(x == ' ' for x in boxes):
                    failures.append(f'{att_rel}: reviewed/published needs all 12 declarations')
                if is_pending(reviewer) or is_pending(researcher) or same_person(reviewer, researcher):
                    failures.append(f'{att_rel}: distinct researcher and reviewer identifiers required')
                ev_rev_m = re.search(r'^Independent reviewer:\s*(.*)$', ev_body, re.M)
                ev_rev = ev_rev_m.group(1).strip() if ev_rev_m else ''
                if not REVIEWER_ID_RE.fullmatch(reviewer):
                    failures.append(f'{att_rel}: use the stable reviewer identifier recorded with maintainers')
                if ev_rev != reviewer or same_person(ev_rev, researcher):
                    failures.append(f'{ev_rel}: independent reviewer identifier must match the attestation')
                if re.search(r'\|\s*(PENDING|unverified|blocked\b[^|]*)\s*\|', ev_body, re.I):
                    failures.append(f'{ev_rel}: reviewed/published record cannot contain PENDING/unverified/blocked claims')

    if failures:
        print('Attestation check FAILED:\n' + '\n'.join('- ' + f for f in failures))
        return 1
    print('Attestation structure OK (does not prove research truth).')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (subprocess.CalledProcessError, OSError, ValueError, TypeError) as error:
        print(f'Could not validate content: {error}', file=sys.stderr)
        sys.exit(2)
