import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Manually authored sidebar.
 *
 * Categories follow the platform's domains rather than the
 * Diátaxis intro / concepts / guides / reference split. Each domain
 * collects the concept page, the how-to guide, and the reference for
 * that area into one sidebar group, so a reader who wants to know
 * "how do recommenders work" can stay in one place from concept to
 * walk-through to API.
 *
 * Doc ids are listed explicitly so adding a new file does not silently
 * change the order.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Get Started',
      collapsed: false,
      items: [
        'intro/what-is-watchlens',
        'intro/system-requirements',
        'intro/quick-start',
        'intro/why-watchlens',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'concepts/architecture',
        'concepts/configurable-execution',
        'concepts/device-routing',
        'reference/device-routing',
      ],
    },
    {
      type: 'category',
      label: 'Admin Console',
      collapsed: false,
      items: [
        'admin/overview',
        'admin/running-an-experiment',
        'admin/stats-tab',
        'admin/recbole-tab',
      ],
    },
    {
      type: 'category',
      label: 'Recommenders',
      collapsed: false,
      items: [
        'guides/adding-a-recommender',
        'guides/adding-an-external-recommender',
      ],
    },
    {
      type: 'category',
      label: 'UI Authoring',
      collapsed: false,
      items: [
        'guides/authoring-a-ui',
        'guides/admin-visual-editor',
        'guides/admin-code-editor',
        'reference/block-reference',
      ],
    },
    {
      type: 'category',
      label: 'Events',
      collapsed: false,
      items: [
        'concepts/standardized-measurement',
        'reference/event-schema',
        'guides/phase1-verification',
      ],
    },
    {
      type: 'category',
      label: 'Surveys',
      collapsed: false,
      items: [
        'concepts/survey-system',
        'guides/designing-surveys',
      ],
    },
  ],
};

export default sidebars;
