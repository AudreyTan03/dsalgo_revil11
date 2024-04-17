import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../actions/adminActions';
import { Link, useNavigate } from 'react-router-dom';
import './productlist.css'; // Ensure CSS is imported

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.productReducer.products);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = productId => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId));
      navigate('/admin/');
    }
  };

  return (
    <div className="AdminProduct-list-container">
      <div className="AdminProduct-list-header">
        <div className="AdminProduct-header-item">ID</div>
        <div className="AdminProduct-header-item">Name</div>
        <div className="AdminProduct-header-item">Edit</div>
        <div className="AdminProduct-header-item">Delete</div>
      </div>
      <ul className="AdminProduct-list">
        {products.map(product => (
          <li key={product._id} className="AdminProduct-list-item">
            <span>{product._id}</span>
            <span>
              <Link to={`/admin/product-details/${product._id}`} className="AdminProduct-product-link">{product.name}</Link>
            </span>
            <Link to={`/admin/edit-product/${product._id}`} className="AdminProduct-edit-link">Edit</Link>
            <button onClick={() => handleDelete(product._id)} className="AdminProduct-delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
