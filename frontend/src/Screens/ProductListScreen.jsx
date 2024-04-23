import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './productlistscreen.css'; 
import StudentNav from '../Components/StudentNav';
import { Row, Col } from 'react-bootstrap';

const ProductListScreen = () => {
  const [userProducts, setUserProducts] = useState([]);
  const { userInfo } = useSelector(state => state.userLogin);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        if (!userInfo || !userInfo.token || !userInfo.token.id) return;
        const response = await fetch(`https://revil24-15f5d0b1bcb1.herokuapp.com/api/user-products/?user=${userInfo.token.id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token.access}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user products. Status: ${response.status}`);
        }
        const data = await response.json();
        // Sort the products by most recently uploaded
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    <div>
      <StudentNav />
      <Row className="container-flui">
        <Col md={3} className="sidebar">
          <div className="sidebar-header">
            {/* Sidebar header content */}
          </div>
          <div className="sbar-menu">
            <ul>
              <li>
                <Link to="/profile">
                  <i className="fa fa-home"></i>
                  <span>‎ ‎ ‎ Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/statistics">
                  <i className="fas fa-chart-bar"></i>
                  <span>‎ ‎ ‎ Statistics</span>
                </Link>
              </li>
              <li>
                <Link to="/productlist">
                  <i className="fa fa-th-list"></i>
                  <span>‎ ‎ ‎ Product List</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Add scroll to sidebar */}
          <div className="sidebar-content">
            {/* Sidebar content */}
          </div>
        </Col>
        <Col className="product-list-container" style={{marginLeft:'6rem', marginRight:'2rem', paddingTop:'2rem'}}>
          <h2 className="product-list-title">Your Products</h2>
          <Link to="/upload" className="upload-link">Upload New Product</Link>
          <br/><br/>
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
        </Col>
      </Row>
    </div>
  );
};

export default ProductListScreen;
