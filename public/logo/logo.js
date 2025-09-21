'use client';

import { memo, useLayoutEffect, useState, useRef, useCallback } from 'react';
import styles from './logo.module.css';

// Constants moved outside component to prevent recreation
const LUMINANCE_THRESHOLD = 0.7;
const DEBOUNCE_DELAY_MS = 100;
const RGB_WEIGHTS = { r: 0.299, g: 0.587, b: 0.114 };

const Logo = memo(() => {
  const logoRef = useRef(null);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const observerRef = useRef(null);

  // Memoized luminance calculation
  const calculateLuminance = useCallback((r, g, b) => {
    return (RGB_WEIGHTS.r * r + RGB_WEIGHTS.g * g + RGB_WEIGHTS.b * b) / 255;
  }, []);

  // Debounced background check with requestAnimationFrame
  const checkBackground = useCallback(() => {
    if (!logoRef.current) return;

    requestAnimationFrame(() => {
      try {
        const bgColor = getComputedStyle(logoRef.current).backgroundColor;
        const rgbMatch = bgColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+\.?\d*)?\)$/);
        
        if (rgbMatch) {
          const [r, g, b] = rgbMatch.slice(1, 4).map(Number);
          const luminance = calculateLuminance(r, g, b);
          setIsLightBackground(luminance > LUMINANCE_THRESHOLD);
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Background detection error:', e);
        }
      }
    });
  }, [calculateLuminance]);

  // Optimized observer setup
  useLayoutEffect(() => {
    const observer = new ResizeObserver(checkBackground);
    observerRef.current = observer;

    if (logoRef.current) {
      checkBackground();
      observer.observe(logoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [checkBackground]);

  return (
    <header
      ref={logoRef}
      className={`${styles.Logo} ${isLightBackground ? styles.lightBackground : ''}`}
      role="img"
      aria-label="ReadinSpeed - Timeless Voices"
    >
      <h1 className={styles.Header}>
        Readin
        <span 
          className={isLightBackground ? styles.lightBackgroundSpan : ''}
          aria-hidden="true"
        >
          Speed
        </span>
      </h1>
      <span className={styles.SubHeader} aria-hidden="true">
        TIMELESS VOICES
      </span>
    </header>
  );
});

Logo.displayName = 'Logo';
export default Logo;