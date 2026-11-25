"""Regression checks for recording a maintainer's revision-specific approval."""

import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('approve_atlas_pr', Path(__file__).with_name('approve-atlas-pr.py'))
approval = importlib.util.module_from_spec(spec)
spec.loader.exec_module(approval)


class CommentApprovalTests(unittest.TestCase):
    def setUp(self):
        self.revision = 'a' * 40
        self.event = {
            'action': 'created', 'sender': {'id': 123},
            'repository': {'owner': {'id': 123}, 'full_name': 'owner/atlas', 'html_url': 'https://github.com/owner/atlas'},
            'issue': {'number': 20, 'state': 'open', 'pull_request': {}},
            'comment': {'id': 55, 'body': f'approved 1234 {self.revision}', 'created_at': '2026-11-25T10:00:00Z',
                        'user': {'id': 123, 'type': 'User'}},
        }
        self.pr = {'state': 'open', 'draft': False, 'base': {'ref': 'main'}, 'head': {'sha': self.revision}}
        self.run = {'head_sha': self.revision, 'status': 'waiting', 'event': 'pull_request',
                    'path': '.github/workflows/validate.yml', 'created_at': '2026-11-25T09:00:00Z',
                    'pull_requests': [{'number': 20, 'base': {'ref': 'main'}}]}
        self.owner = {'id': 123}
        self.pending = [{'environment': {'id': 7, 'name': 'atlas-content-approval'}, 'current_user_can_approve': True,
                         'reviewers': [{'type': 'User', 'reviewer': {'id': 123}}]}]
        self.writes = []
        self.reads = []

    def api(self, path, body=None):
        if body is not None:
            self.writes.append((path, body))
            return []
        self.reads.append(path)
        return {
            'repos/owner/atlas/pulls/20': self.pr,
            'repos/owner/atlas/actions/runs/1234': self.run,
            'repos/owner/atlas/actions/runs/1234/pending_deployments': self.pending,
            'user': self.owner,
        }[path]

    def test_owner_comment_records_only_the_matching_pending_environment(self):
        self.pending.insert(0, {'environment': {'id': 6, 'name': 'github-pages'}})
        self.assertIn('GitHub recorded approval', approval.approve(self.event, self.api))
        self.assertEqual(self.writes, [('repos/owner/atlas/actions/runs/1234/pending_deployments', {
            'environment_ids': [7], 'state': 'approved',
            'comment': 'Maintainer approval via https://github.com/owner/atlas/pull/20#issuecomment-55',
        })])

    def test_plain_or_third_party_comments_have_no_api_effect(self):
        self.event['comment']['body'] = 'approved'
        self.assertIn('exact approval comment', approval.approve(self.event, self.api))
        self.event['comment']['body'] = f'approved 1234 {self.revision}'
        self.event['comment']['user']['id'] = 99
        self.assertIn('Ignored', approval.approve(self.event, self.api))
        self.assertEqual(self.reads, [])
        self.assertEqual(self.writes, [])

    def test_stale_revision_or_a_run_for_another_pr_is_rejected(self):
        self.pr['head']['sha'] = 'b' * 40
        self.assertIn('stale revision', approval.approve(self.event, self.api))
        self.pr['head']['sha'] = self.revision
        self.run['pull_requests'][0]['number'] = 21
        self.assertIn('does not associate', approval.approve(self.event, self.api))
        self.assertEqual(self.writes, [])

    def test_wrong_credential_or_expired_approval_request_cannot_write(self):
        self.owner['id'] = 99
        self.assertIn('does not belong', approval.approve(self.event, self.api))
        self.owner['id'] = 123
        self.pending[0]['current_user_can_approve'] = False
        self.assertIn('no eligible approval', approval.approve(self.event, self.api))
        self.assertEqual(self.writes, [])

    def test_revision_changed_during_approval_is_rejected(self):
        def api(path, body=None):
            if path.endswith('/pending_deployments') and body is None:
                self.pr['head']['sha'] = 'b' * 40
            return self.api(path, body)

        self.assertIn('no eligible approval', approval.approve(self.event, api))
        self.assertEqual(self.writes, [])


if __name__ == '__main__':
    unittest.main()
