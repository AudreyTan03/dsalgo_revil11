import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../actions/editActions'; // Import the updateProduct action

const EditProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Initialize the navigate function
  const dispatch = useDispatch(); // Initialize the dispatch function

  // Redux state
  const { loading, error } = useSelector(state => state.updateProduct);

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'image') {
      setImageFile(file);
    } else if (fileType === 'video') {
      setVideoFile(file);
    }
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    // Create form data
    const updatedFormData = new FormData();
    updatedFormData.append('name', formData.name);
    updatedFormData.append('description', formData.description);
    updatedFormData.append('price', formData.price);
    if (imageFile !== null) {
      updatedFormData.append('image', imageFile);
    }
    if (videoFile !== null) {
      updatedFormData.append('video', videoFile);
    }
  
    // Dispatch updateProduct action
    dispatch(updateProduct(id, updatedFormData));
  
    // Redirect to the previous page if update is successful
    if (!loading && !error) {
      navigate(-1);
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
        </label>
        <label>
          Image:
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image')} />
        </label>
        <label>
          Preview Video:
          <input type="file" accept="video/*" onChange={e => handleFileChange(e, 'video')} />
        </label>
        <button type="submit" disabled={loading}>Update Product</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
};

export default EditProduct;
