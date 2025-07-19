import React, { useState } from 'react';
import styles from './footer.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedin,
  faTwitter,
  faFacebook
} from "@fortawesome/free-brands-svg-icons";
import Logo from '../../../../public/logo/logo';
import FooterModal from './component/footer-model';
import FooterLinks from './data/footer-links.json';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const handleLinkClick = (section, id, e) => {
    e.preventDefault();
    const linkData = FooterLinks[section].find(item => item.id === id);
    if (linkData) {
      setModalContent({
        title: linkData.title,
        content: linkData.content
      });
      setActiveModal(true);
    }
  };

  const closeModal = () => {
    setActiveModal(false);
  };

  return (
    <footer className={styles.Container}>
      <div className={styles.LinksContainer}>
        {/* About Section (wider) */}
        <div className={styles.AboutSection}>
          <Logo />
          <p className={styles.AboutText}>
            {`"IndianWriters, established in 2025, is committed to fostering
            awareness and driving meaningful conversations across society. Our
            organization serves as a platform for insightful discourse on
            social, political, health, and technology-related topics, empowering
            individuals with knowledge and perspectives that inspire positive
            change."`}
          </p>
          <div className={styles.SocialLinks}>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className={styles.Icon} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} className={styles.Icon} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} className={styles.Icon} />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} className={styles.Icon} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.Icon} />
            </a>
          </div>
          <div className={styles.ContactInfo}>
            <FontAwesomeIcon icon={faPhoneAlt} className={styles.Icon} />
            <span>+91-9172165412</span>
          </div>
        </div>

        {/* Legal Links Column */}
        <div className={styles.LinksColumn}>
          <h3 className={styles.SectionTitle}>Legal and Policy</h3>
          {FooterLinks.legal.map((link) => (
            <a
              key={link.id}
              href="#"
              className={styles.LinkItem}
              onClick={(e) => handleLinkClick('legal', link.id, e)}
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Explore Links Column */}
        <div className={styles.LinksColumn}>
          <h3 className={styles.SectionTitle}>Explore and Connect</h3>
          {FooterLinks.explore.map((link) => (
            <a
              key={link.id}
              href="#"
              className={styles.LinkItem}
              onClick={(e) => handleLinkClick('explore', link.id, e)}
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Subscribe Section */}
        <div className={styles.SubscribeSection}>
          <h3 className={styles.SectionTitle}>Subscribe</h3>
          <p className={styles.SubscribeText}>
            Stay updated with the latest articles and insights.
          </p>
          <div className={styles.SubscribeForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.EmailInput}
            />
            <button className={styles.SubscribeButton}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.Copyright}>
        <p>
          © 2025 IndianWriters. All rights reserved. Unauthorized reproduction
          or distribution is strictly prohibited.
        </p>
      </div>

      {activeModal && (
        <FooterModal
          title={modalContent.title}
          content={modalContent.content}
          onClose={closeModal}
        />
      )}
    </footer>
  );
}