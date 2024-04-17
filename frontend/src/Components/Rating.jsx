import React from 'react';

const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star" style={{ color: 'yellow' }}></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt" style={{ color: 'yellow' }}></i>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={i + fullStars + 1} className="far fa-star" style={{ color: 'yellow' }}></i>);
    }
    return stars;
  };

  return <div className="rating">{renderStars()}</div>;
};

export default Rating;
