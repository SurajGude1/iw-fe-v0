"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./loader.module.css";
import Logo from "../../../../public/logo/logo";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const lineRef = useRef(null);

  useEffect(() => {
    // Handwriting animation
    const duration = 3000;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Line animation
    const lineAnimation = () => {
      if (lineRef.current) {
        const line = lineRef.current;
        line.style.transform = 'translateX(-100%)';
        line.style.transition = 'none';
        
        setTimeout(() => {
          line.style.transform = 'translateX(100%)';
          line.style.transition = 'transform 1s linear';
        }, 10);
      }
    };

    const lineInterval = setInterval(lineAnimation, 1000);
    lineAnimation(); // Initial call

    // Hide loader after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3800);

    return () => {
      clearTimeout(timer);
      clearInterval(lineInterval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.LoaderWrapper}>
      <div className={styles.LogoContainer}>
        <Logo className={styles.Logo} animationProgress={animationProgress} />
        <div className={styles.LineContainer}>
          <div ref={lineRef} className={styles.AnimatedLine} />
        </div>
      </div>
    </div>
  );
}