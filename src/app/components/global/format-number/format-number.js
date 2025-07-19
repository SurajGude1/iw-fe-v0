import React from 'react';
import PropTypes from 'prop-types';

const FormatNumber = ({ value, decimalPlaces = 1 }) => {
  const formatCount = (num) => {
    if (typeof num !== 'number') {
      num = Number(num) || 0;
    }

    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(decimalPlaces)}b`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(decimalPlaces)}m`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(decimalPlaces)}k`;
    }
    return num.toString();
  };

  return <span>{formatCount(value)}</span>;
};

FormatNumber.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  decimalPlaces: PropTypes.number
};

export default React.memo(FormatNumber);