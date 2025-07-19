import { useState } from "react";
import styles from "./drawer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUser,
  faCoins,
  faCog,
  faSignOutAlt,
  faUserPlus,
  faIdCardClip,
} from "@fortawesome/free-solid-svg-icons";
import EarnForm from "../global/forms/earn";
import ContactForm from "../global/forms/contact";
import SignIn from "../global/forms/sign-in";

const Drawer = ({ isOpen, onClose }) => {
  const [showEarnForm, setShowEarnForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleOpenModal = (type) => {
    onClose();
    if (type === "earn") setShowEarnForm(true);
    else if (type === "contact") setShowContactForm(true);
    else if (type === "signin") setShowSignIn(true);
  };

  return (
    <>
      <div
        className={`${styles.DrawerOverlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
      />
      <div className={`${styles.Drawer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.DrawerHeader}>
          <p className={styles.UserName}>your name</p>
          <button className={styles.DrawerCloseButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className={styles.DrawerContent}>
          <nav className={styles.DrawerNav}>
            <a
              href="#sign-in"
              className={styles.DrawerItem}
              onClick={(e) => {
                e.preventDefault();
                handleOpenModal("signin");
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} />
              <span className={styles.Span}>Sign-in</span>
            </a>
            <a href="#profile" className={styles.DrawerItem}>
              <FontAwesomeIcon icon={faUser} />
              <span className={styles.Span}>Profile</span>
            </a>
            <a
              href="#earn"
              className={styles.DrawerItem}
              onClick={(e) => {
                e.preventDefault();
                handleOpenModal("earn");
              }}
            >
              <FontAwesomeIcon icon={faCoins} />
              <span className={styles.Span}>Earn</span>
            </a>
            {/* Will bw added in second version */}
            {/* <a href="#settings" className={styles.DrawerItem}>
              <FontAwesomeIcon icon={faCog} />
              <span className={styles.Span}>Settings</span>
            </a> */}
            <a
              href="#contact"
              className={styles.DrawerItem}
              onClick={(e) => {
                e.preventDefault();
                handleOpenModal("contact");
              }}
            >
              <FontAwesomeIcon icon={faIdCardClip} />
              <span className={styles.Span}>Contact-us</span>
            </a>
            <a href="#signout" className={styles.DrawerItem}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className={styles.Span}>Sign Out</span>
            </a>
          </nav>
        </div>
      </div>

      {showEarnForm && <EarnForm onClose={() => setShowEarnForm(false)} />}
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
    </>
  );
};

export default Drawer;
