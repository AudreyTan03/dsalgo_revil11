import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { listVideos, checkSubscription } from '../actions/videoActions';
import '../Screens/productscreen.css';

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const videos = useSelector(state => state.videoList.videos) || [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const userInfo = useSelector(state => state.userLogin.userInfo);
  const userId = userInfo.token.id;
  const isUserSubscribed = useSelector((state) => state.Subscription.subscriptions);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [userType, setUserType] = useState(null); // State to store user type
  const videoRefs = useRef(new Map());

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      const { user_type } = userInfo;
      setUserType(user_type);
    }
  }, []);

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/delete/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product. Status: ${response.status}`);
      }
      navigate('/'); // Navigate back to the home page or any other appropriate page
    } catch (error) {
      setError(error.message);
    }
  };

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

  const handleEditProduct = () => {
    navigate(`/edit/${id}`, { state: { productId: id } }); // Pass the product ID
  };
  

  const handleAddToCart = () => {
    dispatch(addToCart(id, 1));
    navigate('/cart');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewReviews = () => {
    navigate(`/review/${id}`); // Redirect to the review page with the product ID
  };

  const handleScrollToVideo = (videoId) => {
    setSelectedVideoId(videoId);
    videoRefs.current.get(videoId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <div className="App">
      <div className="overlay">
        {product.preview_video && (
          <div className="video-capture">
            <video controls autoPlay style={{ width: '100%', height: '263px', marginTop: "-1px" }}>
              <source src={product.preview_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <div className="product-price-left">
          <p style={{ fontWeight: 'bold', fontSize: '1.5em' }}>$: {product.price}</p>
        </div>
        {userId !== product.user && !isUserSubscribed && ( // Only render the button if the user is not the product owner and is not subscribed
          <div className="ratings">
            <button className="add-to-cart-button bigger-button" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        )}
        {isUserSubscribed && (
          <div className="view-reviews-container">
            <button className="view-reviews-button" onClick={handleViewReviews}>View Reviews</button>
          </div>
        )}
        <div className="dropdown-container">
          <button className="dropdown-btn" onClick={toggleDropdown}>...</button>
          {dropdownVisible && (
            <div className="dropdown-content">
              <button onClick={handleGoBack}>Go Back</button>
              {/* Only instructors who posted the product or admin can edit/delete */}
              {(userId === product.user ) || userType === 'admin' ? (
                <>
                  <button onClick={handleDeleteProduct}>Delete Product</button>
                  <button onClick={() => handleEditProduct(product.id)}>Edit Product</button>
                </>
              ) : (
                <p>You do not have permission to edit or delete this product.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="gray-section">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Uploaded by: {product.user_name}</p>
        <p>Created at: {product.createdAt}</p>
        <p>Edited at: {product.editedAt}</p>
      </div>
      <div className="product-screen-container">
        <div className="video-sidebar">
          <ul className="video-titles">
            {videos.map((video) => (
              <li
                key={video.id}
                className={selectedVideoId === video.id ? 'active' : ''}
                onClick={() => handleScrollToVideo(video.id)}
              >
                {video.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="video-playback-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {videos.map((video) => (
            <div key={video.id} style={{ display: selectedVideoId === video.id ? 'block' : 'none' }}>
              {/* Render only if the video ID matches the selectedVideoId */}
              {((userId === product.user && userType === 'instructor') || userType === 'admin' || isUserSubscribed) ? (
                <a
                  href={`/product/${id}/video/${video.id}`}
                  style={{ color: 'blue', cursor: 'pointer' }}
                >
                  {video.title}
                </a>  
              ) : (
                <div className="row">
                  <div className="col">
                    <p className="text-danger">You need to subscribe to view this video.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
