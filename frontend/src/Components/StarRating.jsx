import React, { useState } from 'react';

const StarRating = ({ onStarClick }) => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
    onStarClick(value);
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? 'star filled' : 'star'}
          onClick={() => handleStarClick(index + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
