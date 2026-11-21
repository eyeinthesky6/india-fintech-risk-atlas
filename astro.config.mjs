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
      { label: 'Start here', items: [{ label: 'Overview', slug: '' }, { label: 'Methodology', slug: 'methodology' }, { label: 'Contribute', slug: 'contribute' }] },
      { label: 'UPI', items: [{ label: 'UPI overview', slug: 'upi' }, { label: 'Unusual outbound velocity', slug: 'upi/unusual-outbound-velocity' }, { label: 'Mule-account funnel', slug: 'upi/mule-account-funnel' }, { label: 'Account takeover', slug: 'upi/account-takeover' }, { label: 'Collect-request deception', slug: 'upi/collect-request-deception' }, { label: 'Payment status and reconciliation', slug: 'upi/payment-status-reconciliation' }, { label: 'UPI sources', slug: 'upi/sources' }] }
    ]
  })]
});
