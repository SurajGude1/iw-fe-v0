import React, { useEffect } from 'react';
import styles from './footer-model.module.css';

const FooterModal = ({ title, content, onClose }) => {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div
          className={styles.modalContent}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default FooterModal;

