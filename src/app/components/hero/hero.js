import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import dynamic from 'next/dynamic';
import styles from "./hero.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import FormatNumber from '../global/format-number/format-number';
import { fetchPosts, fetchAdvertisements } from '@/app/services/get-apis';

// Lazy load non-critical components
const Button = dynamic(() => import('../global/buttons/button'), {
  loading: () => <button>Loading...</button>,
  ssr: false
});

const OptimizedImage = dynamic(() => import('next/image'), {
  loading: () => <div style={{ width: 320, height: 200, background: '#ddd' }} />,
});

const VideoPlayer = memo(({ src }) => (
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    aria-label="Featured video"
    disablePictureInPicture
    disableRemotePlayback
  >
    <source src={src} type="video/mp4" />
  </video>
));

VideoPlayer.displayName = 'VideoPlayer';

// Skeleton Loader Components
const CardSkeleton = () => (
  <div className={styles.Card}>
    <div className={styles.CardContent}>
      <div className={styles.TopSection}>
        <div className={styles.AuthorSection}>
          <div className={`${styles.Skeleton} ${styles.SkeletonText} ${styles.SkeletonAuthor}`}></div>
          <div className={`${styles.Skeleton} ${styles.SkeletonText} ${styles.SkeletonDate}`}></div>
        </div>
        <div className={`${styles.ImageWrapper} ${styles.Skeleton} ${styles.SkeletonImage}`}></div>
        <div className={`${styles.Skeleton} ${styles.SkeletonText} ${styles.SkeletonTitle}`}></div>
      </div>
      <div className={styles.BottomSection}>
        <div className={styles.Divider} />
        <div className={styles.Actions}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${styles.Skeleton} ${styles.SkeletonButton}`}></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SummarySkeleton = () => (
  <div className={styles.Summary}>
    <div className={styles.SummaryContentContainer}>
      <div className={`${styles.Skeleton} ${styles.SkeletonText} ${styles.SkeletonSummaryTitle}`}></div>
      <div className={styles.SummaryContent}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`${styles.Skeleton} ${styles.SkeletonText} ${styles.SkeletonLine}`}></div>
        ))}
      </div>
      <div className={`${styles.Skeleton} ${styles.SkeletonButton} ${styles.SkeletonReadMore}`}></div>
    </div>
  </div>
);

const VideoAdSkeleton = () => (
  <div className={styles.VideoAds}>
    <h3 className={styles.SummaryTitle}>Featured</h3>
    <div className={styles.VideoContainer}>
      <div className={`${styles.Skeleton} ${styles.SkeletonVideo}`}></div>
      <div className={`${styles.Skeleton} ${styles.SkeletonVideo}`}></div>
    </div>
  </div>
);

function Hero() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [curtainPhase, setCurtainPhase] = useState('open');
  const [sanitizedSummary, setSanitizedSummary] = useState('');
  const [posts, setPosts] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [videoAds, setVideoAds] = useState([]);
  const [currentVideoIndices, setCurrentVideoIndices] = useState([0, 1]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const videoIntervalRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, adsData] = await Promise.all([
          fetchPosts(),
          fetchAdvertisements()
        ]);
        
        setPosts(postsData);
        setAdvertisements(adsData);
        
        // Filter only video type ads
        const videoAds = adsData.filter(ad => ad.advertiseType === 'video');
        setVideoAds(videoAds);
        
        // Initialize video indices
        if (videoAds.length > 0) {
          setCurrentVideoIndices([
            0 % videoAds.length,
            Math.min(1, videoAds.length - 1) % videoAds.length
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Rotate videos every 15 seconds
  useEffect(() => {
    if (videoAds.length > 0) {
      videoIntervalRef.current = setInterval(() => {
        setCurrentVideoIndices(prev => [
          (prev[0] + 2) % videoAds.length,
          (prev[1] + 2) % videoAds.length
        ]);
      }, 15000);
    }

    return () => {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    };
  }, [videoAds]);

  const currentCard = useMemo(() => {
    if (!posts.length) return null;
    return posts[currentCardIndex];
  }, [posts, currentCardIndex]);

  const onClickArrowHandler = useCallback((post) => {
    window.open(
      `/explore-articles/${post.postId}/${encodeURIComponent(post.postTitle)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentCard?.postContent) {
      const DOMPurify = require('dompurify');
      const sanitizeConfig = {
        FORBID_TAGS: [
          'img', 'video', 'iframe', 'picture', 'source', 'svg',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figure', 'header'
        ],
        FORBID_ATTR: ['src', 'poster', 'alt', 'width', 'height'],
        ALLOWED_TAGS: [
          'p', 'br', 'ul', 'ol', 'li',
          'strong', 'em', 'b', 'i', 'u', 'a',
          'span', 'div',
          'table', 'thead', 'tbody', 'tr', 'td', 'th',
          'blockquote', 'code', 'pre'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'style'],
      };
      const sanitized = DOMPurify.sanitize(currentCard.postContent, sanitizeConfig);
      setSanitizedSummary(sanitized);
    }
  }, [currentCard]);

  const handleHover = useCallback(() => {
    setIsHovered(true);
    clearInterval(intervalRef.current);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (!isHovered && posts.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurtainPhase('closing');

        const closeTimer = setTimeout(() => {
          setCurrentCardIndex(prev => (prev + 1) % posts.length);
          setCurtainPhase('opening');

          const openTimer = setTimeout(() => {
            setCurtainPhase('open');
          }, 800);

          return () => clearTimeout(openTimer);
        }, 800);

        return () => clearTimeout(closeTimer);
      }, 10000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, posts.length]);

  useEffect(() => {
    if (posts.length > 0) {
      const nextIndex = (currentCardIndex + 1) % posts.length;
      const nextImage = new Image();
      nextImage.src = posts[nextIndex].thumbnailUrl;
    }
  }, [currentCardIndex, posts]);

  if (loading) {
    return (
      <div className={styles.Hero} role="region" aria-label="Featured content loading">
        <CardSkeleton />
        <SummarySkeleton />
        <VideoAdSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className={styles.Hero}>Error loading featured content</div>;
  }

  if (!currentCard) {
    return <div className={styles.Hero}>No featured content available</div>;
  }

  return (
    <div className={styles.Hero} role="region" aria-label="Featured content">
      {/* Main Card (Left) */}
      <article
        className={styles.Card}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverEnd}
        aria-live="polite"
        itemScope
        itemType="https://schema.org/Article"
      >
        <div className={styles.CardContent}>
          {/* Curtain overlay with animation phases */}
          <div
            className={`
              ${styles.Curtain}
              ${curtainPhase === 'closing' ? styles.curtainClose : ''}
              ${curtainPhase === 'opening' ? styles.curtainOpen : ''}
            `}
            aria-hidden="true"
          />

          {/* Card content */}
          <div className={styles.TopSection}>
            <div className={styles.AuthorSection} itemProp="author">
              <span className={styles.AuthorName} itemProp="name">{currentCard.author}</span>
              <time
                className={styles.DatePosted}
                dateTime={currentCard.postCreatedOn}
                itemProp="datePublished"
              >
                {new Date(currentCard.postCreatedOn).toLocaleDateString()}
              </time>
            </div>

            <div className={styles.ImageWrapper}>
              <OptimizedImage
                src={currentCard.thumbnailUrl}
                alt={currentCard.postTitle}
                width={320}
                height={200}
                priority={currentCardIndex === 0}
                loading={currentCardIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
                itemProp="image"
              />
            </div>

            <h3 className={styles.Title} itemProp="headline">{currentCard.postTitle}</h3>
          </div>

          <div className={styles.BottomSection}>
            <div className={styles.Divider} />
            <div className={styles.Actions}>
              <button aria-label={`View ${currentCard.postTitle}`} itemProp="interactionCount">
                <FontAwesomeIcon icon={faEye} style={{ fontSize: '1.2rem' }} />
                <span><FormatNumber value={currentCard.views || 0} /></span>
              </button>
              <button aria-label={`Like ${currentCard.postTitle}`} itemProp="interactionCount">
                <FontAwesomeIcon icon={faHeart} style={{ fontSize: '1.2rem' }} />
                <span><FormatNumber value={currentCard.likes || 0} /></span>
              </button>
              <button aria-label={`Share ${currentCard.postTitle}`}>
                <FontAwesomeIcon icon={faShare} style={{ fontSize: '1.2rem' }} />
                <span><FormatNumber value={currentCard.shares || 0} /></span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Summary Card (Center) */}
      <summary
        className={styles.Summary}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverEnd}
        itemScope
        itemType="https://schema.org/Article"
      >
        <div className={styles.SummaryContentContainer}>
          {/* Curtain overlay with animation phases */}
          <div
            className={`
              ${styles.Curtain}
              ${curtainPhase === 'closing' ? styles.curtainClose : ''}
              ${curtainPhase === 'opening' ? styles.curtainOpen : ''}
            `}
            aria-hidden="true"
          />

          <h2 className={styles.SummaryTitle} itemProp="headline">{currentCard.postTitle}</h2>
          <div
            className={styles.SummaryContent}
            itemProp="description"
            dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
          />
          <div className={styles.SummaryFooter}>
            <Button
              text="Read More"
              backgroundColor="var(--electric-blue)"
              textColor="var(--rich-black)"
              onClick={() => onClickArrowHandler(currentCard)}
              aria-label={`Read more about ${currentCard.postTitle}`}
            />
          </div>
        </div>
      </summary>

      {/* Video Ads (Right) */}
      <aside className={styles.VideoAds} aria-label="Featured videos">
        <h3 className={styles.SummaryTitle}>Featured</h3>
        <div className={styles.VideoContainer}>
          {videoAds.length > 0 ? (
            <>
              <VideoPlayer src={videoAds[currentVideoIndices[0]]?.videoUrl} />
              <VideoPlayer src={videoAds[currentVideoIndices[1]]?.videoUrl} />
            </>
          ) : (
            <>
              <div className={`${styles.Skeleton} ${styles.SkeletonVideo}`}></div>
              <div className={`${styles.Skeleton} ${styles.SkeletonVideo}`}></div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export default memo(Hero);