"use client"; //  Enables client-side rendering for interactivity and animations

//  Scoped CSS module for layout styling
import styles from "./styles/page.module.css";

//  Top-level reusable UI components
import TopNavigationBar from "./components/navigation/top-navigation-bar";
import Hero from "./components/hero/hero";
import Posters from "./components/posters/posters";
import FiltersCardsChannels from "./components/filters-cards-channels/filters-cards-channels";
import UserReviews from "./components/user-reviews/user-reviews";
import SiteMetadata from "./components/site-metadata/site-metadata";
import Collaborators from "./components/collaborators/collaborators";
import Footer from "./components/footer/footer";

//  Wrapper for scroll-based fade-in animation (UX enhancement)
import FadeInSection from "./components/global/animations/fade-in";

export default function Home() {
  return (
    //  Root layout container using module-scoped styles for isolation
    <div className={styles.MainWrapper}>

      {/*  Sticky top navigation bar */}
      <TopNavigationBar />

      {/*  Hero section with entry animation */}
      <FadeInSection><Hero /></FadeInSection>

      {/*  Featured posters/cards */}
      <FadeInSection><Posters /></FadeInSection>

      {/*  Filters and content discovery section */}
      <FadeInSection><FiltersCardsChannels /></FadeInSection>

      {/*  User testimonials and reviews */}
      <FadeInSection><UserReviews /></FadeInSection>

      {/*  SEO and platform-related metadata display */}
      <FadeInSection><SiteMetadata /></FadeInSection>

      {/*  Partner/collaborator highlights */}
      <FadeInSection><Collaborators /></FadeInSection>

      {/*  Footer with site-wide links, social, and credits */}
      <FadeInSection><Footer /></FadeInSection>
    </div>
  );
}
