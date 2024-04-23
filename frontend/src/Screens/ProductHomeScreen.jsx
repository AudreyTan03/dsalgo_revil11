import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormControl, Button } from 'react-bootstrap';
import Product from '../Components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Navbar from '../Components/Navbar';

function ProductHome() {
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  const { error, loading, products } = productList;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(listProducts());
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const filteredProducts = products.filter(product =>
      ((product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.user && product.user.name && product.user.name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedCategory === '' || product.category === parseInt(selectedCategory))
    );
    setFilteredProducts(filteredProducts);
  }, [searchTerm, selectedCategory, products]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <div className="search-bar">
        <Form inline={true.toString()}>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <h1>Course Product</h1>
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