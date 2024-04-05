import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useSelector((state) => state.userInfo); // Assuming userInfo is stored in Redux state
  const [userType, setUserType] = useState(null); // State to store user type

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const { user_type } = userInfo;
        setUserType(user_type);
    }
  }, []);

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

    const fetchVideos = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/videos/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch videos. Status: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchProduct();
    fetchVideos();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(id, 1)); // Assuming quantity is always 1
    navigate('/cart');
  };

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

  const handleEditProduct = () => {
    navigate(`/edit`); // Navigate to the edit screen for the current product
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

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

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
        <button onClick={handleGoBack}>Go Back</button>
  
        {userType === 'instructor' && (
          <>
            <button onClick={handleDeleteProduct}>Delete Product</button>
            <button onClick={handleEditProduct}>Edit Product</button>
          </>
        )}
      </div>

      <h2>Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <a href={`/videos/${video.id}/`}>{video.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductScreen;
