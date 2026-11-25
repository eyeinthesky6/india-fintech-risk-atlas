#!/usr/bin/env python3
"""Record a maintainer's revision-specific PR comment as a GitHub approval."""

import json
import os
from pathlib import Path
import re
import subprocess


APPROVAL_ENVIRONMENT = 'atlas-content-approval'
VALIDATION_WORKFLOW = '.github/workflows/validate.yml'
COMMAND = re.compile(r'approved ([1-9][0-9]*) ([a-f0-9]{40})', re.IGNORECASE | re.ASCII)


def github_api(path, body=None):
    args = ['gh', 'api', path]
    if body is not None:
        args += ['--method', 'POST', '--input', '-']
    data = json.dumps(body) if body is not None else None
    return json.loads(subprocess.run(args, input=data, text=True, capture_output=True, check=True).stdout)


def is_current_pull_request(pr, revision):
    return (pr['state'] == 'open' and not pr['draft'] and pr['base']['ref'] == 'main'
            and pr['head']['sha'] == revision)


def approve(event, api):
    repo, issue, comment = (event[key] for key in ('repository', 'issue', 'comment'))
    owner = repo['owner']['id']
    if (event['action'] != 'created' or 'pull_request' not in issue or issue['state'] != 'open'
            or comment['user']['type'] != 'User' or comment['user']['id'] != owner
            or event['sender']['id'] != owner):
        return 'Ignored a comment outside the maintainer approval flow.'
    match = COMMAND.fullmatch(comment['body'].strip())
    if not match:
        return 'Use the exact approval comment from Telegram, including its run ID and revision.'
    run_id, revision = match.group(1), match.group(2).lower()
    pr_number = issue['number']
    endpoint = f'repos/{repo["full_name"]}'
    pr_path = f'{endpoint}/pulls/{pr_number}'
    run_path = f'{endpoint}/actions/runs/{run_id}'
    pr = api(pr_path)
    if not is_current_pull_request(pr, revision):
        return 'The comment is for a stale revision or the pull request is unavailable.'
    run = api(run_path)
    if (run['event'] != 'pull_request' or run['path'] != VALIDATION_WORKFLOW
            or run['head_sha'] != revision or run['status'] != 'waiting'
            or run['created_at'] > comment['created_at']):
        return 'The specified run is not waiting for approval on this revision.'
    if not any(item['number'] == pr_number and item['base']['ref'] == 'main'
               for item in run['pull_requests']):
        return 'GitHub does not associate the specified run with this pull request.'
    if api('user')['id'] != owner:
        return 'The configured reviewer credential does not belong to the repository owner.'
    pending_path = f'{run_path}/pending_deployments'
    eligible = [item for item in api(pending_path)
                if item['environment']['name'] == APPROVAL_ENVIRONMENT and item['current_user_can_approve']
                and any(entry['type'] == 'User' and entry['reviewer']['id'] == owner
                        for entry in item['reviewers'])]
    if len(eligible) != 1 or not is_current_pull_request(api(pr_path), revision):
        return 'There is no eligible approval for the current pull request revision.'
    api(pending_path, {
        'environment_ids': [eligible[0]['environment']['id']],
        'state': 'approved',
        'comment': f'Maintainer approval via {repo["html_url"]}/pull/{pr_number}#issuecomment-{comment["id"]}',
    })
    return f'GitHub recorded approval for PR #{pr_number} at {revision[:12]}. Required checks can continue.'


def main():
    token = os.environ.get('GH_TOKEN', '').strip()
    if not token:
        raise SystemExit('Configure ATLAS_APPROVAL_TOKEN in the atlas-comment-approval environment.')
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text(encoding='utf-8'))
    try:
        print(approve(event, github_api))
    except (subprocess.CalledProcessError, OSError, ValueError, KeyError) as error:
        raise SystemExit(f'GitHub did not confirm the comment approval ({type(error).__name__}).') from None


if __name__ == '__main__':
    main()
