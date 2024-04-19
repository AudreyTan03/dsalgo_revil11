// ProductHome.js

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../Components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { search } from '../actions/productActions';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Navbar from '../Components/Navbar';

function ProductHome() {
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  const { error, loading, products } = productList;

  const searchResults = useSelector(state => state.searchResults);
  const { loading: searchLoading, results, error: searchError } = searchResults;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(listProducts());
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      dispatch(search(searchTerm));
    }
  }, [dispatch, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('api/categories/');
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

  const filteredProducts = searchTerm.trim() === '' ? products.filter(product =>
    (selectedCategory === '' || product.category === parseInt(selectedCategory))
  ) : results;

  return (
    <div>
      <Navbar
        handleSearch={(e) => setSearchTerm(e.target.value)}
        searchTerm={searchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      {searchLoading ? (
        <Loader />
      ) : searchError ? (
        <Message variant="danger">{searchError}</Message>
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
