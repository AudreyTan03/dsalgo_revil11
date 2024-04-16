import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './productlistscreen.css'; 

const ProductListScreen = () => {
  const [userProducts, setUserProducts] = useState([]);
  const { userInfo } = useSelector(state => state.userLogin);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        if (!userInfo || !userInfo.token || !userInfo.token.id) return;
        const response = await fetch(`http://127.0.0.1:8000/api/user-products/?user=${userInfo.token.id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token.access}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user products. Status: ${response.status}`);
        }
        const data = await response.json();
        setUserProducts(data);
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    };

    if (userInfo) {
      fetchUserProducts();
    }
  }, [userInfo]);

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Your Products</h2>
      <Link to="/upload" className="upload-link">Upload New Product</Link>
      <div className="product-list">
        {userProducts.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListScreen;
