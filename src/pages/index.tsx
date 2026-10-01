import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

const AUTHORS: {name: string; corresponding?: boolean}[] = [
  {name: 'Deogyong Kim'},
  {name: 'Dongha Lee', corresponding: true},
];
const AFFILIATION = 'Department of Artificial Intelligence, Yonsei University';

const BIBTEX = `@misc{kim2026watchlens,
  title         = {WatchLens: A Configurable Platform for Online Video Recommendation Experiments},
  author        = {Deogyong Kim and Dongha Lee},
  year          = {2026},
  eprint        = {2608.04807},
  archivePrefix = {arXiv},
  primaryClass  = {cs.IR},
  url           = {https://arxiv.org/abs/2608.04807}
}`;

function PaperIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 1.75h5.5l2.75 2.75v9.75H4z" />
      <path d="M9.25 1.75v3h3M6 8h4M6 10.5h4" />
    </svg>
  );
}

function ArxivIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M3.5 2.5l9 11M12.5 2.5l-9 11" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

function DocsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3.5C6.5 2.5 4 2.25 1.75 2.5v10c2.25-.25 4.75 0 6.25 1 1.5-1 4-1.25 6.25-1v-10C12 2.25 9.5 2.5 8 3.5z" />
      <path d="M8 3.5v10" />
    </svg>
  );
}

// `primary` marks the entry point to the user guide, rendered as a
// light pill with an arrow so it stands out from the paper links.
const LINKS: {label: string; href: string; icon: ReactNode; primary?: boolean}[] = [
  {label: 'Paper', href: 'https://arxiv.org/pdf/2608.04807', icon: <PaperIcon />},
  {label: 'arXiv', href: 'https://arxiv.org/abs/2608.04807', icon: <ArxivIcon />},
  {label: 'Code', href: 'https://github.com/WatchLens/WatchLens', icon: <GitHubIcon />},
  {label: 'Docs', href: '/docs/intro/what-is-watchlens', icon: <DocsIcon />, primary: true},
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.title}>
          {siteConfig.title}: {siteConfig.tagline}
        </Heading>
        <p className={styles.authors}>
          {AUTHORS.map(({name, corresponding}, i) => (
            <span key={name}>
              {i > 0 && ', '}
              {name}
              {corresponding && <sup>*</sup>}
            </span>
          ))}
        </p>
        <p className={styles.affiliation}>{AFFILIATION}</p>
        <p className={styles.note}>
          <sup>*</sup>Corresponding author
        </p>
        <div className={styles.buttons}>
          {LINKS.map(({label, href, icon, primary}) => (
            <Link
              key={label}
              className={clsx(styles.linkButton, primary && styles.linkButtonPrimary)}
              to={href}>
              {icon}
              {label}
              {primary && <span aria-hidden="true">→</span>}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.citation}>
          <div className="container">
            <Heading as="h2">BibTeX</Heading>
            <CodeBlock>{BIBTEX}</CodeBlock>
          </div>
        </section>
      </main>
    </Layout>
  );
}
