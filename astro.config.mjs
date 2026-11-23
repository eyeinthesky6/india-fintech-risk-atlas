import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://eyeinthesky6.github.io',
  base: '/india-fintech-risk-atlas',
  integrations: [starlight({
    title: 'India Fintech Risk Atlas',
    description: 'An open, source-cited reference for Indian fintech fraud and risk patterns.',
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/eyeinthesky6/india-fintech-risk-atlas' }],
    editLink: { baseUrl: 'https://github.com/eyeinthesky6/india-fintech-risk-atlas/edit/main/' },
    sidebar: [
      {
        label: 'Start here',
        items: [
          { label: 'Overview', link: '/' },
          { label: 'Methodology', slug: 'methodology' },
          { label: 'Evidence policy', slug: 'evidence-policy' },
          { label: 'Licensing', slug: 'licensing' },
          { label: 'Contribute', slug: 'contribute' },
        ],
      },
      {
        label: 'UPI',
        items: [
          {
            label: 'Overview & playbooks',
            items: [
              { label: 'UPI overview', slug: 'upi' },
              { label: 'UPI ecosystem', slug: 'upi/upi-ecosystem' },
              { label: 'Risk-stack playbook', slug: 'upi/risk-stack-playbook' },
              { label: 'Operator insights', slug: 'upi/operator-insights' },
              { label: 'Coverage & review status', slug: 'upi/coverage' },
            ],
          },
          {
            label: 'Social engineering & scams',
            items: [
              { label: 'Collect-request deception', slug: 'upi/collect-request-deception' },
              { label: 'QR and cashback deception', slug: 'upi/qr-cashback-deception' },
              { label: 'Fake support impersonation', slug: 'upi/fake-support-impersonation' },
            ],
          },
          {
            label: 'Identity, access & authentication',
            items: [
              { label: 'Account takeover', slug: 'upi/account-takeover' },
              { label: 'Untrusted apps', slug: 'upi/untrusted-app-access' },
              { label: 'Authentication context', slug: 'upi/authentication-context' },
              { label: 'Failed authentication', slug: 'upi/failed-authentication' },
            ],
          },
          {
            label: 'Monitoring, mules & merchants',
            items: [
              { label: 'Unusual outbound velocity', slug: 'upi/unusual-outbound-velocity' },
              { label: 'Transaction velocity', slug: 'upi/transaction-velocity' },
              { label: 'Mule-account funnel', slug: 'upi/mule-account-funnel' },
              { label: 'Merchant onboarding', slug: 'upi/merchant-onboarding' },
            ],
          },
          {
            label: 'Reconciliation, disputes & protection',
            items: [
              { label: 'Payment status and reconciliation', slug: 'upi/payment-status-reconciliation' },
              { label: 'Settlement exceptions', slug: 'upi/settlement-exceptions' },
              { label: 'Dispute routing', slug: 'upi/dispute-routing' },
              { label: 'Customer protection', slug: 'upi/customer-liability' },
            ],
          },
          {
            label: 'Policy & references',
            items: [
              { label: 'Policy discussion', slug: 'upi/risk-discussion' },
              { label: 'UPI sources', slug: 'upi/sources' },
              { label: 'Glossary', slug: 'upi/glossary' },
            ],
          },
        ],
      },
    ],
  })]
});
