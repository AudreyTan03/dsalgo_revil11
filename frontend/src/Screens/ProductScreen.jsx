import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { listVideos, checkSubscription } from '../actions/videoActions';

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const videos = useSelector((state) => state.videoList.videos) || [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isUserSubscribed = useSelector((state) => state.Subscription.subscriptions);
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const userId = userInfo.token.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
    dispatch(listVideos(id));
    dispatch(checkSubscription(userId, id)); // Dispatch checkSubscription for the current product
  }, [dispatch, userId, id]);

  const handleAddToCart = () => {
    dispatch(addToCart(id, 1));
    navigate('/cart');
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Uploaded by: {product.user_name}</p>
      {product.preview_video && (
        <video controls autoPlay style={{ width: '25%' }}>
          <source src={product.preview_video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <p>{product.description}</p>
      <p>{product.price}</p>
      <p>Created at: {product.createdAt}</p>
      <p>Edited at: {product.editedAt}</p>

      <div>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <h2>Videos</h2>
      {videos.length > 0 ? (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              {isUserSubscribed ? (
                <a
                  href={`/product/${id}/video/${video.id}`}
                  style={{ color: 'blue', cursor: 'pointer' }}
                >
                  {video.title}
                </a>
              ) : (
                <>
                  <p>You need to subscribe to view this video.</p>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>No videos found</div>
      )}
    </div>
  );
};

export default ProductScreen;
