import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ReviewScreen.css'; // Import the CSS file

const ReviewScreen = () => {
  const { id } = useParams();
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const submitReview = async () => {
    try {
      setSubmitting(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await axios.post('http://127.0.0.1:8000/api/post-reviews/', {
        product: parseInt(id),
        rating,
        comment,
        user: userInfo.name,
      });
      // Assuming the API returns the newly created review
      const newReview = response.data;
      newReview.id = response.data._id; // Adding review.id from the API response
      setProductReviews([...productReviews, newReview]);
      setRating(0);
      setComment('');
      setSubmitting(false);
      alert('Review submitted successfully!');
    } catch (error) {
      setSubmitError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="review-screen-container">
      <h1>Reviews for Product ID: {id}</h1>
      {productReviews.length === 0 && <p>No reviews found for this product.</p>}
      {productReviews.length > 0 && (
        <ul>
          {productReviews.map((review) => (
            <li key={review.id}>
              <p>Rating: {Array.from({ length: 5 }, (_, index) => (
                <span className="star" key={index}>{index < review.rating ? '★' : '☆'}</span>
              ))}</p>
              <p>Comment: {review.comment}</p>
            </li>
          ))}
        </ul>
      )}
      <h2>Submit a Review</h2>
      <label>
        Rating:
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        />
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      {submitError && <div>Error submitting review: {submitError}</div>}
      <button onClick={submitReview} disabled={submitting || rating === 0 || comment.trim() === ''}>Submit Review</button>
    </div>
  );
};

export default ReviewScreen;
