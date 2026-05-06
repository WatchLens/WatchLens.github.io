import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Manually authored sidebar.
 *
 * Four categories follow the introduction → concepts → guides → reference
 * arc that newcomers (and reviewers) typically read in. Within each
 * category, file order is set by `sidebar_position` in the document's
 * frontmatter; we list ids explicitly here so adding a new doc doesn't
 * silently change the order.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'intro/what-is-watchlens',
        'intro/quick-start',
        'intro/why-watchlens',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        'concepts/architecture',
        'concepts/configurable-execution',
        'concepts/standardized-measurement',
        'concepts/device-routing',
        'concepts/survey-system',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/adding-a-recommender',
        'guides/adding-an-external-recommender',
        'guides/authoring-a-ui',
        'guides/designing-surveys',
        'guides/phase1-verification',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'reference/event-schema',
        'reference/block-reference',
        'reference/device-routing',
      ],
    },
  ],
};

export default sidebars;
