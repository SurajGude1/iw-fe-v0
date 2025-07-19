import styles from './collaborators.module.css';

const BRANDS = [
  "Apple", "Sony", "Google", "Microsoft", "Amazon",
  "Netflix", "Samsung", "Adobe", "Intel", "Nike"
];

export default function Collaborators() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.slider}>
        {BRANDS.map((brand, index) => (
          <div key={index} className={styles.card}>
            <span>{brand}</span>
          </div>
        ))}
        {BRANDS.map((brand, index) => (
          <div key={`dup-${index}`} className={styles.card}>
            <span>{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

