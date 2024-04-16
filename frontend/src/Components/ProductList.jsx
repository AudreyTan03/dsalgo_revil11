import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../actions/adminActions';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { useNavigate } from 'react-router-dom';


const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.productReducer.products);
  const navigate = useNavigate();

  
  console.log("Rendering ProductList component...");
  console.log("Products in Redux Store:", products); // Add this line

  useEffect(() => {
    console.log("Dispatching getProducts action...");
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = productId => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteProduct(productId));
      navigate('/admin/');
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products && products.map(product => (
          <li key={product._id}>
            <span>ID: {product._id} </span>
            <span>Name: <Link to={`/admin/product-details/${product._id}`} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>{product.name}</Link></span>
            <Link to={`/admin/edit-product/${product._id}`} style= {{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>Edit</Link>
            <button onClick={() => handleDelete(product._id)}>Delete</button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
