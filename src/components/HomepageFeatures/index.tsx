import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imgSrc: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Pluggable Recommenders',
    imgSrc: require('@site/static/img/feature-pluggable.png').default,
    description: (
      <>
        Add a recommendation policy as a single Python class, or register
        an externally hosted HTTP service through the admin API. Five
        built-ins ship (random, popularity, recency, similarity, RecBole),
        all behind one dispatcher and one capability contract.
      </>
    ),
  },
  {
    title: 'Standardized Event Schema',
    imgSrc: require('@site/static/img/feature-events.png').default,
    description: (
      <>
        33 events across 6 categories (session, navigation, playback,
        impressions, interactions, browser state) emit automatically
        from every UI track. Recommendation policy and feed position
        attach to every row, so cross-treatment comparison is the default.
      </>
    ),
  },
  {
    title: 'Configurable UI',
    imgSrc: require('@site/static/img/feature-ui.png').default,
    description: (
      <>
        Three authoring tracks share the same event contract. The bundled
        YouTube and TikTok presets, an in-browser TSX code editor compiled
        with sucrase, and a visual block-tree editor with 19 composable
        blocks. Eject from visual to code when you outgrow the library.
      </>
    ),
  },
];

function Feature({title, imgSrc, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={imgSrc} className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
