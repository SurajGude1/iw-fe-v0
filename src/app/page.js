"use client";

import styles from "./styles/page.module.css";
import dynamic from 'next/dynamic';

// Lazy load heavy components
const TopNavigationBar = dynamic(() => import("./components/navigation/top-navigation-bar"));
const Hero = dynamic(() => import("./components/hero/hero"));
const Posters = dynamic(() => import("./components/posters/posters"));
const FiltersCardsChannels = dynamic(() => import("./components/filters-cards-channels/filters-cards-channels"));
const UserReviews = dynamic(() => import("./components/user-reviews/user-reviews"));
const SiteMetadata = dynamic(() => import("./components/site-metadata/site-metadata"));
const Collaborators = dynamic(() => import("./components/collaborators/collaborators"));
const Footer = dynamic(() => import("./components/footer/footer"));
const FadeInSection = dynamic(() => import("./components/global/animations/fade-in"));

// Static array for maintainable section ordering
const sections = [
  { component: Hero, key: 'hero' },
  { component: Posters, key: 'posters' },
  { component: FiltersCardsChannels, key: 'filters' },
  { component: UserReviews, key: 'reviews' },
  { component: SiteMetadata, key: 'metadata' },
  { component: Collaborators, key: 'collaborators' },
  { component: Footer, key: 'footer' }
];

export default function Home() {
  return (
    <div className={styles.MainWrapper}>
      <TopNavigationBar />
      
      {sections.map(({ component: Component, key }) => (
        <FadeInSection key={key}>
          <Component />
        </FadeInSection>
      ))}
    </div>
  );
}