import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Product from '../Components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Navbar from '../Components/Navbar'; // Import the Navbar component

function ProductHome() {
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  const { error, loading, products } = productList;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(listProducts());
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/categories/');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || product.category === parseInt(selectedCategory))
  );
  
  
  
  

  return (
    <div>
      <Navbar handleSearch={handleSearch} searchTerm={searchTerm} /> {/* Pass handleSearch and searchTerm as props */}
      <Form.Group controlId='category'>
        <Form.Label>Category</Form.Label>
        <Form.Control as='select' value={selectedCategory} onChange={handleCategoryChange}>
          <option value=''>All</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <h1>Latest Products</h1>
          <Row>
            {filteredProducts.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductHome;
