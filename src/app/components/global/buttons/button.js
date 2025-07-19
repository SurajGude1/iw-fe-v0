import React, { memo } from "react";
import PropTypes from "prop-types";
import styles from "./button.module.css";

const Button = memo(({ 
  text, 
  backgroundColor = "#6200ee", 
  textColor = "#ffffff", 
  hoverEffect = true, 
  onClick 
}) => (
  <button
    type="button"
    className={`${styles.Button} ${hoverEffect ? styles.HoverEffect : ""}`}
    style={{ backgroundColor, color: textColor }}
    onClick={onClick}
  >
    {text}
  </button>
));

Button.displayName = "Button";

Button.propTypes = {
  text: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  hoverEffect: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
