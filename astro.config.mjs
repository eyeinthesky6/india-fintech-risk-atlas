import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeSix from '@six-tech/starlight-theme-six';
import starlightLinksValidator from 'starlight-links-validator';
import { siteBase, siteOrigin } from './src/site-config.js';

const atlasComponents = {
  name: 'atlas-components',
  hooks: {
    'config:setup': ({ config, updateConfig }) => {
      updateConfig({
        components: {
          ...config.components,
          Banner: './src/components/AtlasSearchPanel.astro',
          MarkdownContent: './src/components/AtlasMarkdownContent.astro',
          PageSidebar: './src/components/AtlasPageSidebar.astro',
          PageTitle: './src/components/AtlasPageTitle.astro',
          Sidebar: './src/components/AtlasSidebar.astro',
          ThemeSelect: './src/components/AtlasThemeSelect.astro',
        },
      });
    },
  },
};

export default defineConfig({
  site: siteOrigin,
  base: siteBase,
  integrations: [starlight({
    title: 'India Fintech Risk Atlas',
    description: 'An open, source-cited reference for Indian fintech fraud and risk patterns.',
    logo: { src: './public/favicon.svg', alt: 'India Risk Atlas' },
    plugins: [
      starlightThemeSix({
        navLinks: [
          { label: 'UPI Atlas', link: '/upi/' },
          { label: 'Coverage', link: '/upi/coverage/' },
          { label: 'Sources', link: '/upi/sources/' },
          { label: 'Methodology', link: '/methodology/' },
          { label: 'Join & Contribute', link: '/contribute/' },
        ],
        footerText: 'India Risk Atlas — Open, source-cited fintech risk reference (CC BY 4.0 content, MIT code).',
      }),
      atlasComponents,
      starlightLinksValidator(),
    ],
    customCss: ['./src/styles/atlas-custom.css'],
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
      {
        label: 'Cards',
        items: [
          { label: 'Card ecosystem', slug: 'cards/card-ecosystem' },
        ],
      },
    ],
  })],
  vite: {
    plugins: [
      {
        // Work around upstream CSS reset typo & removed StarlightThemeProvider in @six-tech/starlight-theme-six
        name: 'fix-theme-six-compat',
        enforce: 'pre',
        resolveId(source, importer) {
          if (importer && importer.includes('starlight-theme-six')) {
            // Theme Six imports its Search directly instead of using the Starlight override.
            if (source === './Search.astro' && /[\\/]overrides[\\/]Header\.astro$/.test(importer)) {
              return fileURLToPath(new URL('./src/components/AtlasSearchButton.astro', import.meta.url));
            }
            if (
              source === './ThemeSelect.astro' ||
              source.endsWith('/ThemeSelect.astro') ||
              source.endsWith('\\ThemeSelect.astro')
            ) {
              return fileURLToPath(new URL('./src/components/AtlasThemeSelect.astro', import.meta.url));
            }
            if (
              source === '../components/Drawer.astro' ||
              source.endsWith('/Drawer.astro') ||
              source.endsWith('\\Drawer.astro')
            ) {
              return fileURLToPath(new URL('./src/components/AtlasDrawer.astro', import.meta.url));
            }
          }
        },
        transform(code, id) {
          if (id.includes('starlight-theme-six') && id.endsWith('base.css')) {
            return code.replace(':after :before', '::after, ::before');
          }
        },
      },
    ],
  },
});
