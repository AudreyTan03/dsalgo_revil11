import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import '../Screens/ProductScreen.css';

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
  const userId = JSON.parse(localStorage.getItem('userInfo')).token.id;
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
    navigate(`/edit/${id}`); // Navigate to the edit screen for the current product
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
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
        {/* Video capture */}
        {product.preview_video && (
          <div className="video-capture">
            {/* You can embed your video here */}
            <video controls autoPlay style={{ width: '100%', height: '263px', marginTop: "-1px" }}>
              <source src={product.preview_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Product price */}
        <div className="product-price-left">
          <p style={{ fontWeight: 'bold', fontSize: '1.5em' }}>$: {product.price}</p>
        </div>

        {/* Add to Cart button */}
        {userId !== product.user && (
          <div className="ratings">
            <button className="add-to-cart-button bigger-button" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        )}

        {/* Dropdown */}
        <div className="dropdown-container">
          <button className="dropdown-btn" onClick={toggleDropdown}>...</button>
          {dropdownVisible && (
            <div className="dropdown-content">
              {userId === product.user && userType === 'instructor' && (
                <>
                  <button onClick={handleDeleteProduct}>Delete Product</button>
                  <button onClick={handleEditProduct}>Edit Product</button>
                </>
              )}
              <button onClick={handleGoBack}>Go Back</button>
            </div>
          )}
        </div>

      </div>

      {/* Product details */}
      <div className="gray-section">
        <h2 style={{ color: 'white', marginRight: '700px', fontSize: '20px', marginTop: '-31px' }}>
          {product.name}
        </h2>
        <p style={{ color: 'white', marginRight: '700px', fontSize: '15px' }}>
          {product.description}
        </p>
        <div className="best-seller-box" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="star-rating">
            {/* Star rating */}
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </div>
          {/* Best Seller or any other label */}
          <div className="new-box-gray" style={{ '--box-padding': '-22px', '--box-width': '101px', '--box-height': '22px' }}>
            Best Seller
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" style={{ width: '100%' }}>
        <p>pages</p>
      </footer>
    </div>
  );
};

export default ProductScreen;
