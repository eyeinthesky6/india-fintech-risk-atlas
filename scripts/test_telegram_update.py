"""Regression checks for release and source notifications."""

import argparse
import html
import importlib.util
import re
import unittest
from pathlib import Path
from unittest.mock import patch


def load_script(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(f'{name}.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


update = load_script('telegram-update')
notify = load_script('notify-telegram')


class NotificationTests(unittest.TestCase):
    def test_release_summary_describes_the_changed_copy_and_links_the_record(self):
        before, after = 'a' * 40, 'b' * 40
        record = 'src/content/docs/upi/authentication-context.md'
        args = argparse.Namespace(
            head=after, previous=before, push_before='c' * 40,
            repo_url='https://github.com/owner/atlas', site_url='https://example.org/atlas/',
        )
        template = '---\ntitle: Authentication\nrecordId: UPI-009\n---\n## What to do\n'

        def repository(*command):
            if command[0] == 'rev-parse':
                return command[-1].split('^')[0]
            if command[0] == 'diff':
                self.assertEqual(command[-3:-1], (before, after))
                return (f'M\0{record}\0M\0public/atlas-records.json\0'
                        'M\0research/evidence/UPI-009.md\0M\0research/attestations/UPI-009.md\0'
                        'M\0mcp/src/server.js\0M\0docs/SECTION_WORKFLOW.md\0')
            if command[0] == 'show':
                return template + (
                    'New consent is required after a device change.' if command[1].startswith(after)
                    else 'Retain a record of the consent for audit purposes.'
                )
            if command[0] == 'log':
                return f'{after}\tUpdate the authentication context\n'
            self.fail(f'Unexpected Git call {command}')

        with patch.object(update, 'git', side_effect=repository):
            summary = update.deployment(args)
        sections = {section['heading']: section['items'] for section in summary['sections']}
        article, evidence, attestation = sections['Content changes']
        self.assertEqual(article['label'], 'Updated UPI-009 Authentication')
        self.assertEqual(article['url'], 'https://example.org/atlas/upi/authentication-context/')
        self.assertIn('What to do', article['detail'])
        self.assertIn('New consent is required', article['detail'])
        self.assertIn('Evidence ledger', evidence['detail'])
        self.assertIn('/research/evidence/UPI-009.md', evidence['url'])
        self.assertIn('/research/attestations/UPI-009.md', attestation['url'])
        self.assertIn('MCP tools and export code', sections['Code changes'][0]['detail'])
        self.assertIn('/mcp/src/server.js', sections['Code changes'][0]['url'])
        self.assertIn('/docs/SECTION_WORKFLOW.md', sections['Project documentation'][0]['url'])
        self.assertEqual(sections['Generated exports'][0]['url'], 'https://example.org/atlas/atlas-records.json')
        self.assertEqual(sections['Release commits'][0]['url'], f'https://github.com/owner/atlas/commit/{after}')
        self.assertIn(['View change diff', f'https://github.com/owner/atlas/compare/{before}..{after}'], summary['links'])

    def test_code_and_generated_outputs_do_not_announce_content_changes(self):
        head, base = 'a' * 40, 'b' * 40
        args = argparse.Namespace(
            head=head, previous=base, push_before='',
            repo_url='https://github.com/owner/atlas', site_url='https://example.org/atlas/',
        )
        with patch.object(update, 'git', side_effect=[head, base, 'M\0workers/report-triage/src/worker.js\0M\0public/llms.txt\0', '']):
            sections = update.deployment(args)['sections']
        self.assertEqual([section['heading'] for section in sections], ['Code changes', 'Generated exports'])
        self.assertIn('Correction reporting code', sections[0]['items'][0]['detail'])
        with patch.object(update, 'git', side_effect=[head, base, 'M\0public/llms.txt\0', '']):
            sections = update.deployment(args)['sections']
        self.assertEqual([section['heading'] for section in sections], ['Generated exports'])

    def test_release_links_every_changed_page_and_keeps_a_removed_page_link(self):
        head, base = 'a' * 40, 'b' * 40
        args = argparse.Namespace(head=head, previous=base, push_before='',
                                  repo_url='https://github.com/owner/atlas', site_url='https://example.org/atlas/')
        paths = [f'src/content/docs/upi/topic-{number}.md' for number in range(6)]
        changes = ''.join(f'A\0{path}\0' for path in paths[:5]) + f'D\0{paths[5]}\0'
        with patch.object(update, 'git', side_effect=[head, base, changes, *(['# Record\n'] * 6), '']):
            items = update.deployment(args)['sections'][0]['items']
        self.assertEqual(len(items), len(paths))
        self.assertEqual(items[4]['url'], 'https://example.org/atlas/upi/topic-4/')
        self.assertEqual(items[5]['url'], f'https://github.com/owner/atlas/blob/{base}/{paths[5]}')

    def test_redeploy_does_not_invent_changes(self):
        head = 'a' * 40
        args = argparse.Namespace(
            head=head, previous=head, push_before='',
            repo_url='https://github.com/owner/atlas', site_url='https://example.org/atlas/',
        )
        with patch.object(update, 'git', side_effect=[head, head, '']):
            self.assertIn('No source changes', update.deployment(args)['message'])

    def test_sender_escapes_labels_and_rejects_non_web_links(self):
        body = notify.format_notification('<Atlas>', 'Control & source', [
            ('Primary <source>', 'https://example.org/?a=1&b=2'),
            ('Unsafe link', 'javascript:invalid'),
        ])
        self.assertIn('&lt;Atlas&gt;', body)
        self.assertIn('Control &amp; source', body)
        self.assertIn('<a href="https://example.org/?a=1&amp;b=2">Primary &lt;source&gt;</a>', body)
        self.assertNotIn('javascript:', body)

    def test_long_release_keeps_links_and_respects_telegram_size(self):
        items = [{'label': f'Topic {index} <&>', 'detail': ' — ' + '🧪 & ' * 95,
                  'url': f'https://example.org/topics/{index}/'} for index in range(32)]
        summary = {'message': 'Changes since the previous deployment',
                   'sections': [{'heading': 'Content changes', 'items': items}]}
        parts = notify.format_notifications('Atlas release', summary, [('View change diff', 'https://example.org/diff')])
        self.assertGreater(len(parts), 1)
        for part in parts:
            visible = html.unescape(re.sub(r'<[^>]+>', '', part))
            self.assertLessEqual(notify.telegram_length(visible), 4096)
            self.assertIn('Content changes', part)
            self.assertIn('https://example.org/diff', part)
        self.assertEqual(sum(part.count('https://example.org/topics/') for part in parts), len(items))


if __name__ == '__main__':
    unittest.main()
