import React, { useEffect, useState } from 'react';
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="AdminProduct-list-container">
      <div className="AdminProduct-list-header">
        <div className="AdminProduct-header-item">ID</div>
        <div className="AdminProduct-header-item">Name</div>
        <div className="AdminProduct-header-item">Edit</div>
        <div className="AdminProduct-header-item">Delete</div>
      </div>
      <ul className="AdminProduct-list">
        {currentProducts.map(product => (
          <li key={product._id} className="AdminProduct-list-item">
            <span>{product._id}</span>
            <span>
              <Link to={`/admin/product-details/${product._id}`} className="AdminProduct-product-link">{product.name}</Link>
            </span>
            {/* <Link to={`/admin/edit-product/${product._id}`} className="AdminProduct-edit-link">Edit</Link> */}
            <button onClick={() => handleDelete(product._id)} className="AdminProduct-delete-button">Delete</button>
          </li>
        ))}
      </ul>
      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(products.length / productsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
