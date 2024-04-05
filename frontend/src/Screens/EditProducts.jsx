import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProduct } from '../actions/adminActions';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProduct = useSelector(state => state.productReducer.products.find(product => product._id === Number(productId))); 

  const [editedProductData, setEditedProductData] = useState({
    name: '',
    description: '',
    price: '',
    preview_video: '',
    image: null, // Initialize image field
  });

  useEffect(() => {
    if (selectedProduct) {
      setEditedProductData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        preview_video: selectedProduct.preview_video,
        image: null, // Initialize image field
      });
    }
  }, [selectedProduct]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setEditedProductData(prevState => ({
        ...prevState,
        [name]: files[0], // Update for file input
      }));
    } else if (name === 'name' || name === 'description' || name === 'price') {
      // Only update name, description, and price fields
      setEditedProductData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else if (name === 'preview_video') {
      // If only the preview_video is changed, set image to null
      setEditedProductData(prevState => ({
        ...prevState,
        [name]: files[0],
        image: null,
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Submitting form...");
    if (selectedProduct) {
      const formData = new FormData();
      for (const key in editedProductData) {
        if (editedProductData[key] !== null) {
          formData.append(key, editedProductData[key]);
        }
      }
      console.log("Form Data:", formData);
      await dispatch(editProduct(productId, formData));
      console.log("Dispatched editProduct action");
      navigate('/admin/');
    }
  };

  return (
    <div>
      <h2>Edit Product: {selectedProduct ? selectedProduct.name : ''}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data"> {/* Add encType for file upload */}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedProductData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={editedProductData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={editedProductData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="preview_video">Preview Video:</label>
          <input
            type="file"
            id="preview_video"
            name="preview_video"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProduct;
