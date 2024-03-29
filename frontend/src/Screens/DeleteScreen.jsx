import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/products/');
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products');
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleProductSelection = (productId) => {
    const isSelected = selectedProducts.includes(productId);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteProducts = async () => {
    setLoading(true);
    try {
      setShowConfirmationModal(false);
      for (const productId of selectedProducts) {
        await axios.delete(`/api/products/${productId}/delete/`);
      }
      setProducts(products.filter((product) => !selectedProducts.includes(product._id)));
      setSelectedProducts([]);
    } catch (error) {
      setError('Error deleting products');
    }
    setLoading(false);
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="product-list-container">
      <h1>Uploaded Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={() => handleProductSelection(product._id)}
            />
            {product.name} - {product.brand} - {product.price}
          </li>
        ))}
      </ul>
      <div className="button-container">
        <button className="delete-button" onClick={handleShowConfirmationModal} disabled={selectedProducts.length === 0}>
          Delete Selected Products
        </button>
        {showConfirmationModal && (
          <div className="confirmation-modal">
            <p>Are you sure you want to delete the selected products?</p>
            <button onClick={handleDeleteProducts}>Yes</button>
            <button onClick={handleCloseConfirmationModal}>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
