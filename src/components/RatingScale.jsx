import React from 'react';
import PropTypes from 'prop-types';
import '../styles/main.scss';

const RatingScale = ({ value, fillColor }) => {
    return (
      <div className="rating-scale">
        {[1, 2, 3, 4, 5].map((number) => (
          <div
            key={number}
            style={{ backgroundColor: value >= number ? fillColor : 'transparent' }}
            className="scale-point"
          ></div>
        ))}
      </div>
    );
  };
  
  RatingScale.propTypes = {
    value: PropTypes.number.isRequired,
    fillColor: PropTypes.string.isRequired
  };

export default RatingScale;