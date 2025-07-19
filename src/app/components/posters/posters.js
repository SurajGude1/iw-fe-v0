import styles from "./posters.module.css";
import Image from "next/image";
import Button from "../global/buttons/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import { fetchPosts } from '@/app/services/get-apis';

// Skeleton Loader Component
const PosterSkeleton = () => (
  <div className={styles.Poster}>
    <div className={styles.PosterContent}>
      <div className={`${styles.Skeleton} ${styles.SkeletonImage}`}></div>
      <div className={`${styles.Skeleton} ${styles.SkeletonText}`}></div>
      <div className={`${styles.Skeleton} ${styles.SkeletonArrow}`}></div>
    </div>
  </div>
);

export default function Posters() {
  const [postersData, setPostersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Split posters into chunks of 10 for each carousel
  const chunkSize = 10;
  const posterChunks = [];
  const carouselRefs = useRef([]);

  // Fetch data from API
  useEffect(() => {
    const loadPosters = async () => {
      try {
        const data = await fetchPosts();
        setPostersData(data);
      } catch (err) {
        console.error('Failed to fetch posters:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosters();
  }, []);

  // Create chunks only when data is loaded
  if (postersData.length > 0) {
    for (let i = 0; i < postersData.length; i += chunkSize) {
      posterChunks.push(postersData.slice(i, i + chunkSize));
    }
  }

  const [scrollStates, setScrollStates] = useState(
    posterChunks.map(() => ({
      isAtStart: true,
      isAtEnd: false,
    }))
  );

  useEffect(() => {
    const handleScroll = (index) => {
      const element = carouselRefs.current[index];
      if (element) {
        const isAtStart = element.scrollLeft === 0;
        const isAtEnd =
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;

        setScrollStates(prev => {
          const newStates = [...prev];
          newStates[index] = { isAtStart, isAtEnd };
          return newStates;
        });
      }
    };

    // Add scroll event listeners to all carousels
    carouselRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.addEventListener('scroll', () => handleScroll(index));
        // Initial check
        handleScroll(index);
      }
    });

    return () => {
      carouselRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.removeEventListener('scroll', () => handleScroll(index));
        }
      });
    };
  }, [postersData]);

  const scrollCarousel = (index, direction) => {
    const element = carouselRefs.current[index];
    if (element) {
      const scrollAmount = direction === 'left' ? -element.clientWidth : element.clientWidth;
      element.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const onClickArrowHandler = (poster) => {
    window.open(
      `/explore-articles/${poster.postId}/${encodeURIComponent(poster.postTitle)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (loading) {
    return (
      <div className={styles.PostersWrapper}>
        <p className={styles.SectionTitle}>Trending now</p>
        <div className={styles.CarouselContainer}>
          <div className={styles.Carousel}>
            {[...Array(10)].map((_, i) => (
              <PosterSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.PostersWrapper}>Error loading posters</div>;
  }

  if (postersData.length === 0) {
    return <div className={styles.PostersWrapper}>No posters available</div>;
  }

  return (
    <div className={styles.PostersWrapper}>
      <p className={styles.SectionTitle}>Trending now</p>

      {posterChunks.map((chunk, index) => (
        <div key={`carousel-${index}`} className={styles.CarouselContainer}>
          {!scrollStates[index]?.isAtStart && (
            <button
              className={`${styles.NavButton} ${styles.LeftButton}`}
              onClick={() => scrollCarousel(index, 'left')}
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faCircleChevronLeft} />
            </button>
          )}

          <div
            ref={el => carouselRefs.current[index] = el}
            className={styles.Carousel}
          >
            {chunk.map((poster) => (
              <div key={poster.postId} className={styles.Poster}>
                <div className={styles.PosterContent}>
                  {poster.thumbnailUrl ? (
                    <Image
                      src={poster.thumbnailUrl}
                      alt={poster.postTitle || "Poster"}
                      fill
                      className={styles.PosterImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : null}

                  <div className={styles.PosterText}>{poster.postTitle}</div>
                  <div className={styles.ForwardArrow}>
                    <FontAwesomeIcon 
                      icon={faArrowRight} 
                      onClick={() => onClickArrowHandler(poster)}
                      aria-label={`Read more about ${poster.postTitle}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!scrollStates[index]?.isAtEnd && (
            <button
              className={`${styles.NavButton} ${styles.RightButton}`}
              onClick={() => scrollCarousel(index, 'right')}
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faCircleChevronRight} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}