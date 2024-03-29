import React, { useState } from 'react';
import { connect } from 'react-redux';
import { uploadProduct } from '../actions/uploadAction'; // Adjust the import path as needed
import './UploadScreen.css'; // Import your CSS file

const UploadScreen = ({ uploadProduct }) => {
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleCountInStockChange = (e) => {
        setCountInStock(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('image', imageFile);
        formData.append('video', videoFile);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('countInStock', countInStock);

        // Dispatch the uploadProduct action
        uploadProduct(formData);

        // Reset form fields
        setImageFile(null);
        setVideoFile(null);
        setName('');
        setDescription('');
        setPrice('');
        setCountInStock('');
    };

    return (
        <div className="upload-screen">
            <h2>Upload Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input type="file" id="image" onChange={handleImageChange} accept="image/*" required />
                </div>
                <div>
                    <label htmlFor="video">Video:</label>
                    <input type="file" id="video" onChange={handleVideoChange} accept="video/*" required />
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={handleNameChange} required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={handleDescriptionChange} required />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" value={price} onChange={handlePriceChange} required />
                </div>
                <div>
                    <label htmlFor="countInStock">Count in Stock:</label>
                    <input type="number" id="countInStock" value={countInStock} onChange={handleCountInStockChange} required />
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default connect(null, { uploadProduct })(UploadScreen);
