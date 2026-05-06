import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WatchLens',
  tagline: 'A Configurable Platform for Online Video Recommendation Experiments',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://watchlens.github.io',
  baseUrl: '/',

  organizationName: 'WatchLens',
  projectName: 'WatchLens.github.io',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

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
      title: 'WatchLens',
      logo: {
        alt: 'WatchLens',
        src: 'img/logo.svg',
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
            {label: 'Event Schema', to: '/docs/event-schema'},
            {label: 'Adding a Recommender', to: '/docs/adding-a-recommender'},
            {label: 'Adding a UI', to: '/docs/adding-a-ui'},
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
