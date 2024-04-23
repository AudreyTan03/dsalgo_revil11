import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const Feedback = () => {
  const { id } = useParams();
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/reviews/?product=${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews. Status: ${response.status}`);
        }
        const data = await response.json();
        const filteredReviews = data.filter((review) => review.product === parseInt(id));
        setProductReviews(filteredReviews);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="review-screen-container">
      <h1>Reviews for Product ID: {id}</h1>
      {loading && <p>Loading reviews...</p>}
      {error && <p>Error: {error}</p>}
      {productReviews.length === 0 && !loading && !error && <p>No reviews found for this product.</p>}
      {productReviews.length > 0 && (
        <ul>
          {productReviews.map((review) => (
            <li key={review.id}>
              <p>Rating: {Array.from({ length: 5 }, (_, index) => (
                <span className="star" key={index}>{index < review.rating ? '★' : '☆'}</span>
              ))}</p>
              <p>Comment by {review.name}: {review.comment}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default Feedback;
