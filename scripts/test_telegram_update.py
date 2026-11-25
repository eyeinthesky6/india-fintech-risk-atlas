"""Regression checks for release and source notifications."""

import argparse
import importlib.util
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
                return f'M\0{record}\0M\0public/atlas-records.json\0'
            if command[0] == 'show':
                return template + (
                    'New consent is required after a device change.' if command[1].startswith(after)
                    else 'Retain a record of the consent for audit purposes.'
                )
            self.fail(f'Unexpected Git call {command}')

        with patch.object(update, 'git', side_effect=repository):
            summary = update.deployment(args)
        self.assertIn('Updated UPI-009 Authentication — What to do', summary['message'])
        self.assertIn('New consent is required', summary['message'])
        self.assertNotIn('atlas-records.json', summary['message'])
        self.assertIn(['UPI-009 Authentication', 'https://example.org/atlas/upi/authentication-context/'], summary['links'])
        self.assertIn(['View change diff', f'https://github.com/owner/atlas/compare/{before}..{after}'], summary['links'])

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


if __name__ == '__main__':
    unittest.main()
