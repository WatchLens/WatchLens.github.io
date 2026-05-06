import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WatchLens',
  tagline: 'A Configurable Platform for Online Video Recommendation Experiments',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://watchlens.github.io',
  baseUrl: '/',

  organizationName: 'WatchLens',
  projectName: 'WatchLens.github.io',

  onBrokenLinks: 'warn',

  // .md = plain markdown (no JSX in `{...}` expressions); .mdx = MDX.
  // Docusaurus v4's default is 'mdx' for both extensions, which makes
  // raw markdown that contains `{...}` blow up the build.
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/WatchLens/WatchLens.github.io/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      // Title intentionally omitted — the logo image is a wordmark, so
      // showing "WatchLens" beside it would duplicate the brand.
      title: '',
      logo: {
        alt: 'WatchLens',
        src: 'img/watchlens-logo.png',
        // Keep the wordmark on a fixed visual height so the navbar
        // doesn't grow with the asset's intrinsic resolution.
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/WatchLens/WatchLens',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'What is WatchLens', to: '/docs/intro/what-is-watchlens'},
            {label: 'Quick Start', to: '/docs/intro/quick-start'},
            {label: 'Architecture', to: '/docs/concepts/architecture'},
            {label: 'Event Schema', to: '/docs/reference/event-schema'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'GitHub', href: 'https://github.com/WatchLens/WatchLens'},
            {label: 'License', href: 'https://github.com/WatchLens/WatchLens/blob/main/LICENSE'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WatchLens contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
