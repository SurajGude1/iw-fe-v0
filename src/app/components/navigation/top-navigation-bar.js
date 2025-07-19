"use client";

import { memo, useCallback, useReducer, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./top-navigation-bar.module.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Button from "../global/buttons/button";
import SignIn from "../global/forms/sign-in";
import EarnForm from "../global/forms/earn";
import ContactForm from "../global/forms/contact";
import Drawer from "./drawer";

// Avoid adding FontAwesome CSS multiple times
config.autoAddCss = false;

const Logo = dynamic(() => import("../../../../public/logo/logo"), {
  loading: () => <div className="LogoPlaceholder" aria-hidden="true" />,
  ssr: false,
});

const initialState = {
  showSignIn: false,
  showEarnForm: false,
  showContactForm: false,
  isDrawerOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_DRAWER":
      return { ...state, isDrawerOpen: !state.isDrawerOpen };
    case "OPEN_SIGNIN":
      return { ...state, showSignIn: true };
    case "CLOSE_SIGNIN":
      return { ...state, showSignIn: false };
    case "OPEN_EARN":
      return { ...state, showEarnForm: true };
    case "CLOSE_EARN":
      return { ...state, showEarnForm: false };
    case "OPEN_CONTACT":
      return { ...state, showContactForm: true };
    case "CLOSE_CONTACT":
      return { ...state, showContactForm: false };
    default:
      return state;
  }
}

function TopNavigationBar() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const userInitials = "SG"; // Replace with dynamic initials

  const toggleDrawer = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), []);
  const openSignIn = useCallback(() => dispatch({ type: "OPEN_SIGNIN" }), []);
  const closeSignIn = useCallback(() => dispatch({ type: "CLOSE_SIGNIN" }), []);
  const openEarnForm = useCallback(() => dispatch({ type: "OPEN_EARN" }), []);
  const closeEarnForm = useCallback(() => dispatch({ type: "CLOSE_EARN" }), []);
  const openContactForm = useCallback(() => dispatch({ type: "OPEN_CONTACT" }), []);
  const closeContactForm = useCallback(() => dispatch({ type: "CLOSE_CONTACT" }), []);
  const toggleProfileDropdown = useCallback(() => setShowProfileDropdown(prev => !prev), []);

  return (
    <>
      <nav className={styles.TopBar} role="navigation" aria-label="Main navigation">
        <Logo />
        <div className={styles.ButtonGroup}>
          <Button
            text="Contact"
            backgroundColor="#36454F"
            textColor="#ffffff"
            hoverEffect={false}
            onClick={openContactForm}
            aria-label="Open contact form"
          />
          <Button
            text="Earn"
            backgroundColor="#ffd700"
            textColor="#001011"
            hoverEffect={false}
            onClick={openEarnForm}
            aria-label="Open earn form"
          />
          <Button
            text="Sign-in"
            backgroundColor="#36454F"
            textColor="#ffffff"
            hoverEffect={false}
            onClick={openSignIn}
            aria-label="Open sign-in form"
          />
          <div className={styles.ProfileContainer}>
            <button
              className={styles.ProfileCircle}
              onClick={toggleProfileDropdown}
              aria-label="User profile menu"
              aria-expanded={showProfileDropdown}
            >
              {userInitials}
            </button>
            {showProfileDropdown && (
              <div className={styles.ProfileDropdown}>
                <button className={styles.DropdownItem}>
                  <FontAwesomeIcon icon={faUser} className={styles.DropdownIcon} />
                  <span>Profile</span>
                </button>
                <button className={styles.DropdownItem}>
                  <FontAwesomeIcon icon={faCog} className={styles.DropdownIcon} />
                  <span>Settings</span>
                </button>
                <button className={styles.DropdownItem}>
                  <FontAwesomeIcon icon={faSignOutAlt} className={styles.DropdownIcon} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Open menu"
            className={styles.FaBars}
            onClick={toggleDrawer}
          >
            <FontAwesomeIcon icon={faBars} color="#f9f6ee" />
          </button>
        </div>
      </nav>

      {/* Lazy forms */}
      {state.showSignIn && <SignIn onClose={closeSignIn} />}
      {state.showEarnForm && <EarnForm onClose={closeEarnForm} />}
      {state.showContactForm && <ContactForm onClose={closeContactForm} />}

      <Drawer isOpen={state.isDrawerOpen} onClose={toggleDrawer} />
    </>
  );
}

export default memo(TopNavigationBar);