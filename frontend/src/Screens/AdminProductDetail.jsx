import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './adminproduct.css'
import { getProductDetails } from '../actions/adminActions';

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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const videos = product?.product_videos || [];

  return (
    <div className="admin-product-detail">
      {product && (
        <div className="product-container">
          <h2 className="product-name">{product.name}</h2>
          <div className="product-info">
            <p><strong>ID:</strong> {product._id}</p>
            <p><strong>Price:</strong> {product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Number of Reviews:</strong> {product.numReviews}</p>
            <p><strong>Created By:</strong> {product.user_name}</p>
          </div>
          <div className="videos-container">
            <video className="preview-video" controls>
              <source src={product.preview_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h3 className="video-heading">Videos:</h3>
            <ul className="video-list">
              {videos.map(video => (
                <li key={video.id} className="video-item">
                  <video controls>
                    <source src={video.video_file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p className="video-title">{video.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetail;
