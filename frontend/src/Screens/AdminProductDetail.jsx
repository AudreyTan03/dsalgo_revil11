// components/ProductDetails.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetails } from '../actions/adminActions';
import { useParams } from 'react-router-dom';

const AdminProductDetail = () => {
  const dispatch = useDispatch();
  const { productId } = useParams(); 
  const product = useSelector(state => state.productReducer.selectedProduct);
  const loading = useSelector((state) => state.productReducer.loading);
  const error = useSelector((state) => state.productReducer.error);

  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("Product in component:", product);

  return (
    <div>
      {product && (
        <div>
          <h2>{product.name}</h2>
          <p>ID: {product._id}</p>
          <p>Price: {product.price}</p>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Number of Reviews: {product.numReviews}</p>
          <p>Created By: {product.user_name}</p>
          <video controls>
            <source src={product.preview_video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h3>Videos:</h3>
          <ul>
            {product.product_videos.map(video => (
              <li key={video.id}>
                <video controls>
                  <source src={video.video_file} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p>{video.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetail;
