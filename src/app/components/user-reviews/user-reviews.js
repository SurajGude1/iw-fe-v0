'use client';

import styles from "./user-reviews.module.css";
import { useMemo, useRef, useEffect, useState } from "react";
import ReviewsData from "../../data/user-reviews.json";

export default function UserReviews() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollingReviews = useMemo(() => [...ReviewsData, ...ReviewsData], []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.UserReviewsSection} ${isVisible ? styles.Animate : styles.Pause}`}
      aria-label="Customer testimonials"
    >
      <h2 className={styles.SectionTitle}>Shared experiences</h2>
      <div className={styles.CarouselWrapper}>
        <div className={styles.CarouselTrack}>
          {scrollingReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <article className={styles.ReviewCard}>
      <img
        src={review.userImage}
        alt={`${review.userName}'s profile`}
        className={styles.UserImage}
        width="70"
        height="70"
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/70';
          e.target.alt = 'Default profile image';
        }}
      />
      <h3 className={styles.UserName}>{review.userName}</h3>
      <p className={styles.ReviewSummary}>{review.reviewSummary}</p>
    </article>
  );
}
