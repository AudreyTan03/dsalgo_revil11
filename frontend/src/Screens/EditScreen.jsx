import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const userId = JSON.parse(localStorage.getItem('userInfo')).token.id; // Define userId here

  const instance = axios.create({
    baseURL: 'https://revil24-15f5d0b1bcb1.herokuapp.com/', // Set the base URL without "https"
});

  useEffect(() => {
    // Fetch all products
    instance.get('api/products/')
      .then(response => {
        const userProducts = response.data.filter(product => product.user === userId);
        setProducts(userProducts); // Set state with filtered products
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, [userId]);

  const handleSelectProduct = productId => {
    setSelectedProduct(null);
    setEditProductId(productId);
    const product = products.find(product => product._id === productId);
    setSelectedProduct(product);
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'image') {
      setImageFile(file);
    } else if (fileType === 'video') {
      setVideoFile(file);
    }
  };

  const handleChange = e => {
    setSelectedProduct({
      ...selectedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let formData = new FormData();
      formData.append('name', selectedProduct.name);
      formData.append('description', selectedProduct.description);
      formData.append('price', selectedProduct.price);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (videoFile) {
        formData.append('video', videoFile);
      }

      const response = await instance.patch(`api/products/${selectedProduct._id}/edit/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product updated:', response.data);
      // Optionally, you can redirect or show a success message here

    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <input type="checkbox" checked={editProductId === product._id} onChange={() => handleSelectProduct(product._id)} />
            {product.name} - Last Edited: {product.editedAt}
          </li>
        ))}
      </ul>
      {selectedProduct && (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={selectedProduct.name} onChange={handleChange} />
          </label>
          <label>
            Description:
            <textarea name="description" value={selectedProduct.description} onChange={handleChange} />
          </label>
          <label>
            Price:
            <input type="number" name="price" value={selectedProduct.price} onChange={handleChange} />
          </label>
          <label>
            Image:
            <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image')} />
          </label>
          <label>
            Video:
            <input type="file" accept="video/*" onChange={e => handleFileChange(e, 'video')} />
          </label>
          <button type="submit">Update Product</button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
