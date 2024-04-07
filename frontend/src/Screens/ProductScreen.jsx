import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { listVideos } from '../actions/videoActions'; // Import listVideos action

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const videos = useSelector((state) => state.videoList.videos); // Access videos from Redux state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useSelector((state) => state.userLogin.userInfo); // Access userInfo from Redux state
  const [userType, setUserType] = useState(null); // State to store user type

  useEffect(() => {
    // console.log('Redux UserInfo:', userInfo);
    if (userInfo) {
      console.log('userInfo:', userInfo);
      const { user_type } = userInfo;
      setUserType(user_type);
    }
  }, [userInfo]);
  
  console.log('User Type:', userType); // Log userType here to check its value

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
    dispatch(listVideos(id)); // Dispatch listVideos action to fetch videos
  }, [dispatch, id]);
  

  const handleAddToCart = () => {
    dispatch(addToCart(id, 1));
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
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditProduct = () => {
    navigate(`/edit`);
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

  console.log('Is userInfo available:', userInfo !== null);


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
            <video controls play style={{ width: '25%' }}>
              <source src={video.video_file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>{video.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductScreen;
