'use client';

/**
 * Optimized Logo Component
 * 
 * A high-performance logo component that dynamically adapts to background contrast
 * while maintaining all original styling and functionality.
 * 
 * Key Optimizations:
 * - Memoized all calculations and handlers
 * - Proper cleanup of all observers and timers
 * - Added debouncing for performance
 * - Enhanced null safety
 * - Better code organization
 * - Added performance comments
 * 
 * Note: All styling remains exactly as original
 */

import { memo, useLayoutEffect, useState, useRef, useCallback } from 'react';
import styles from './logo.module.css';

// Performance Constants
const LUMINANCE_THRESHOLD = 0.7;
const DEBOUNCE_DELAY_MS = 100; // Optimal for visual changes
const RGB_WEIGHTS = Object.freeze({ r: 0.299, g: 0.587, b: 0.114 }); // Freeze for safety

const Logo = memo(() => {
  // Refs
  const logoRef = useRef(null);
  const mutationObserverRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // State
  const [isLightBackground, setIsLightBackground] = useState(false);

  /**
   * Memoized luminance calculation
   * Uses pre-calculated weights for performance
   */
  const calculateLuminance = useCallback((r, g, b) => {
    return (RGB_WEIGHTS.r * r + RGB_WEIGHTS.g * g + RGB_WEIGHTS.b * b) / 255;
  }, []);

  /**
   * Debounced background check
   * - Prevents layout thrashing
   * - Null-safe DOM operations
   * - Clean color parsing
   */
  const checkBackground = useCallback(() => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual check
    debounceTimerRef.current = setTimeout(() => {
      const node = logoRef.current;
      if (!node) return;

      try {
        const bgColor = getComputedStyle(node).backgroundColor;
        const rgbMatch = bgColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        if (rgbMatch) {
          const [r, g, b] = rgbMatch.slice(1).map(Number);
          const luminance = calculateLuminance(r, g, b);
          setIsLightBackground(luminance > LUMINANCE_THRESHOLD);
        }
      } catch (e) {
        console.error('Background check failed:', e);
      }
    }, DEBOUNCE_DELAY_MS);
  }, [calculateLuminance]);

  /**
   * Effect for setting up observers
   * - Handles initial check
   * - Sets up mutation and resize observers
   * - Comprehensive cleanup
   */
  useLayoutEffect(() => {
    // Initial check
    checkBackground();

    // Mutation Observer for style/class changes
    mutationObserverRef.current = new MutationObserver(checkBackground);
    if (logoRef.current) {
      mutationObserverRef.current.observe(logoRef.current, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    // Resize Observer for layout changes
    resizeObserverRef.current = new ResizeObserver(checkBackground);
    if (logoRef.current) {
      resizeObserverRef.current.observe(logoRef.current);
    }

    // Cleanup function
    return () => {
      mutationObserverRef.current?.disconnect();
      resizeObserverRef.current?.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [checkBackground]);

  // Render - identical to original
  return (
    <header
      ref={logoRef}
      className={`${styles.Logo} ${isLightBackground ? styles.lightBackground : ''}`}
      role="img"
      aria-label="ReadinSpeed - Timeless Voices"
    >
      <p className={styles.Header}>
        Readin
        <span 
          className={isLightBackground ? styles.lightBackgroundSpan : ''}
          aria-hidden="true"
        >
          Speed
        </span>
      </p>
      <span className={styles.SubHeader} aria-hidden="true">
        TIMELESS VOICES
      </span>
    </header>
  );
});

Logo.displayName = 'Logo';
export default Logo;