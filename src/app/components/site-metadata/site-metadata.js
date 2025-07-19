import { useEffect, useState } from 'react';
import styles from "./site-metadata.module.css";

const SiteMetadataJson = [
  { id: 1, value: 60000, label: "Daily readers" },
  { id: 2, value: 15000, label: "Total visitors" },
  { id: 3, value: 9000, label: "Advertisers" },
  { id: 4, value: 5000, label: "Live readers" }
];

export default function SiteMetadata() {
  const [counts, setCounts] = useState(
    SiteMetadataJson.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {})
  );

  useEffect(() => {
    const speed = 200; // Lower is slower

    const animateCounters = () => {
      let allCompleted = true;

      const newCounts = { ...counts };
      SiteMetadataJson.forEach(item => {
        if (newCounts[item.id] < item.value) {
          allCompleted = false;
          const increment = item.value / speed;
          newCounts[item.id] = Math.min(
            newCounts[item.id] + increment,
            item.value
          );
        }
      });

      setCounts(newCounts);

      if (!allCompleted) {
        requestAnimationFrame(animateCounters);
      }
    };

    const animationFrame = requestAnimationFrame(animateCounters);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className={styles.SiteMetadata}>
      <div className={styles.MetadataContainer}>
        <div className={styles.MetadataGrid}>
          {SiteMetadataJson.map(item => (
            <div key={item.id} className={styles.MetadataItem}>
              <div className={styles.MetadataValue}>
                {Math.floor(counts[item.id]).toLocaleString()}
              </div>
              <div className={styles.MetadataLabel}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}