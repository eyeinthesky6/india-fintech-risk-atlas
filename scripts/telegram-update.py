#!/usr/bin/env python3
"""Build source-backed summaries for Atlas Telegram notifications."""

import argparse
import json
import re
import subprocess
from pathlib import Path, PurePosixPath
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
CONTENT = 'src/content/docs/'
RESEARCH = 'research/'
GENERATED = {
    'public/atlas-records.json', 'mcp/data/atlas-records.json',
    'public/llms.txt', 'public/llms-full.txt',
}
GUIDES = {'index', 'coverage', 'sources', 'glossary', 'operator-insights', 'risk-stack-playbook'}


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT).decode('utf-8', errors='replace')


def revision(value):
    if value and re.fullmatch('[a-f0-9]{40}', value):
        try:
            return git('rev-parse', '--verify', value + '^{commit}').strip()
        except subprocess.CalledProcessError:
            pass
    return ''


def shorten(value, limit=160):
    text = ' '.join(value.split())
    if len(text) <= limit:
        return text
    prefix = text[:limit - 1]
    boundary = prefix.rfind(' ')
    return (prefix[:boundary] if boundary > limit // 2 else prefix).rstrip() + '…'


def article(markdown, fallback):
    match = re.match(r'^---\r?\n(.*?)\r?\n---(?:\r?\n|$)', markdown, re.S)
    frontmatter = match[1] if match else ''
    body = markdown[match.end():] if match else markdown
    metadata = dict(re.findall(r'^(title|recordId|reviewStage):[^\S\r\n]*(.+)$', frontmatter, re.M))
    sections = re.split(r'^## (.+?)\s*$', body, flags=re.M)
    return (
        metadata.get('title', fallback).strip().strip('"\''),
        metadata.get('recordId', '').strip().strip('"\''),
        metadata.get('reviewStage', '').strip().strip('"\''),
        dict(zip(['Introduction', *sections[1::2]], sections[::2])),
    )


def readable_lines(section):
    for line in section.splitlines():
        line = line.strip()
        if line.startswith(('#', '<', 'import ', '```', '| ---', '|---')):
            continue
        if line.startswith('|'):
            line = line.rstrip('|').split('|')[-1].strip()
        line = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', line)
        line = re.sub(r'<[^>]*>|\[\d+\]|\*\*|`', '', line).lstrip('-* ').strip()
        if len(line) >= 35:
            yield line


def describe_article(path, state, previous, current, site_url, repo_url, include_excerpt):
    slug_path = str(PurePosixPath(path.removeprefix(CONTENT)).with_suffix(''))
    slug = '' if slug_path == 'index' else slug_path.removesuffix('/index')
    slug = quote(slug, safe='/')
    before = article(git('show', f'{previous}:{path}'), slug_path) if previous and state != 'A' else None
    after = article(git('show', f'{current}:{path}'), slug_path) if state != 'D' else None
    title, record, _, _ = after or before
    action = {'A': 'Added', 'D': 'Removed'}.get(state, 'Updated')
    label = shorten(f'{action} {record} {title}' if record else f'{action} {title}', 120)
    detail = ''
    if before and after:
        changed = [shorten(heading, 85) for heading, text in after[3].items() if before[3].get(heading) != text]
        if before[3].keys() - after[3].keys():
            changed.append('Removed sections')
        if before[2] != after[2] and after[2]:
            changed.insert(0, f'Review stage → {after[2]}')
        if after[0] != before[0]:
            changed.append('Title')
        if changed:
            detail = ' — ' + ', '.join(changed[:3])
        if include_excerpt:
            for heading in after[3]:
                if not heading.lower().startswith(('what to do', 'common patterns', 'watch-out')):
                    continue
                existing = set(readable_lines(before[3].get(heading, '')))
                excerpt = next((text for text in readable_lines(after[3][heading]) if text not in existing), '')
                if excerpt:
                    detail += f'\n  “{shorten(excerpt, 200)}”'
                    break
    url = (site_url + '/' + (slug + '/' if slug else '') if after else
           f'{repo_url}/blob/{previous}/{quote(path, safe="/")}')
    return {'label': label, 'url': url, 'detail': detail}


def describe_file(state, path, previous, current, repo_url, detail='', url=None):
    action = {'A': 'Added', 'D': 'Removed'}.get(state, 'Updated')
    version = previous if state == 'D' else current
    return {
        'label': f'{action} {shorten(PurePosixPath(path).name, 96)}',
        'url': url or f'{repo_url}/blob/{version}/{quote(path, safe="/")}',
        'detail': detail,
    }


def code_area(path):
    prefix = path.split('/', 1)[0]
    return {
        'mcp': 'MCP tools and export code',
        'scripts': 'Build and research tools',
        'src': 'Website code and metadata',
        'workers': 'Correction reporting code',
        '.github': 'GitHub workflows or forms',
        'public': 'Site assets',
    }.get(prefix, 'Project configuration')


def deployment(args):
    current = revision(args.head)
    if not current:
        raise ValueError('Expected a deployed commit SHA')
    previous = revision(args.previous)
    if previous:
        scope = 'Changes since the previous successful Pages deployment'
    else:
        previous = revision(args.push_before)
        scope = 'Changes in this push' if previous else 'Changes in the deployed commit'
        if not previous:
            parents = git('rev-list', '--parents', '-n', '1', current).split()
            previous = parents[1] if len(parents) > 1 else ''

    if previous:
        entries = git('diff', '--name-status', '--no-renames', '-z', previous, current, '--').rstrip('\0').split('\0')
        changes = list(zip(entries[::2], entries[1::2]))
    else:
        paths = git('ls-tree', '-r', '--name-only', '-z', current).rstrip('\0').split('\0')
        changes = [('A', path) for path in paths if path]

    repo_url = args.repo_url.rstrip('/')
    site_url = args.site_url.rstrip('/')
    sections = {'Content changes': [], 'Code changes': [], 'Project documentation': [], 'Generated exports': []}
    pages = [(state, path) for state, path in changes
             if path.startswith(CONTENT) and path.endswith(('.md', '.mdx'))]
    pages.sort(key=lambda entry: PurePosixPath(entry[1]).stem in GUIDES)
    excerpts = 0
    for state, path in pages:
        item = describe_article(path, state, previous, current, site_url, repo_url, excerpts < 2)
        sections['Content changes'].append(item)
        excerpts += '\n' in item['detail']
    page_paths = {path for _, path in pages}
    for state, path in changes:
        if path in page_paths:
            continue
        url = None
        if path in GENERATED:
            heading, detail = 'Generated exports', ''
            if path.startswith('public/') and state != 'D':
                url = f'{site_url}/{quote(path.removeprefix("public/"), safe="/")}'
        elif path.startswith(RESEARCH):
            heading = 'Content changes'
            area = {'evidence': 'Evidence ledger', 'attestations': 'Attestation'}.get(path.split('/')[1], 'Research notes')
            detail = f' — {area}'
        elif path.startswith(('docs/', 'mcp/README')) or ('/' not in path and path.endswith('.md')):
            heading, detail = 'Project documentation', ''
        else:
            heading, detail = 'Code changes', f' — {code_area(path)}'
        sections[heading].append(describe_file(state, path, previous, current, repo_url, detail, url))
    if previous and changes:
        log = git('log', '--no-merges', '-n', '8', '--format=%H%x09%s', f'{previous}..{current}')
        sections['Release commits'] = [
            {'label': shorten(subject, 140), 'url': f'{repo_url}/commit/{sha}'}
            for sha, subject in (line.split('\t', 1) for line in log.splitlines()) if subject
        ]
    sections = [{'heading': name, 'items': items} for name, items in sections.items() if items]
    if not sections:
        scope += '\n\nNo source changes in this deployment.'
    diff = f'{repo_url}/compare/{previous}..{current}' if previous else f'{repo_url}/commit/{current}'
    return {'message': scope, 'sections': sections, 'links': [['View change diff', diff]]}


def regulatory(args):
    report = json.loads(Path(args.report).read_text(encoding='utf-8'))
    items = report['new_items']
    noun = 'publication' if len(items) == 1 else 'publications'
    lines = [f'{len(items)} new regulatory {noun} for source review']
    links = []
    for number, item in enumerate(items[:5], 1):
        lines.append(f'{number}. {shorten(item["publisher"], 60)} — {shorten(item["title"], 170)}')
        links.append([f'Source {number}', item['link']])
    if len(items) > 5:
        lines.append(f'{len(items) - 5} more in the triage report')
    return {'message': '\n'.join(lines), 'links': links}


def approval(args):
    if not re.fullmatch(r'[1-9][0-9]*', args.run) or not re.fullmatch(r'[a-f0-9]{40}', args.revision):
        raise ValueError('Expected a GitHub run ID and full revision')
    repo = args.repo_url.rstrip('/')
    change = f'Revision {args.revision[:12]}'
    links = []
    if re.fullmatch(r'[1-9][0-9]*', args.pr):
        change = f'PR #{args.pr} ({change})'
        links.append(['Open PR in GitHub', f'{repo}/pull/{args.pr}'])
    message = (f'{change} is waiting for your approval. Open the Actions run in a browser, '
               'then select Review deployments → atlas-content-approval → Approve and deploy.')
    if links and args.comment_approval == 'true':
        message += f'\n\nOr post this exact comment on the PR:\napproved {args.run} {args.revision}'
    links.append(['Approve on GitHub (browser)', f'{repo}/actions/runs/{args.run}'])
    return {'message': message, 'links': links}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    summaries = parser.add_subparsers(dest='mode', required=True)
    deploy = summaries.add_parser('deployment')
    deploy.add_argument('--head', required=True)
    deploy.add_argument('--previous', default='')
    deploy.add_argument('--push-before', default='')
    deploy.add_argument('--site-url', required=True)
    deploy.add_argument('--repo-url', required=True)
    feeds = summaries.add_parser('regulatory')
    feeds.add_argument('--report', required=True)
    review = summaries.add_parser('approval')
    review.add_argument('--repo-url', required=True)
    review.add_argument('--run', required=True)
    review.add_argument('--revision', required=True)
    review.add_argument('--pr', default='')
    review.add_argument('--comment-approval', default='')
    args = parser.parse_args()
    render = {'deployment': deployment, 'regulatory': regulatory, 'approval': approval}[args.mode]
    print(json.dumps(render(args)))


if __name__ == '__main__':
    main()
