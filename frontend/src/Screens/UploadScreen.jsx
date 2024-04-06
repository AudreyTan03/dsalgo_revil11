import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProduct } from '../actions/uploadAction';
import './UploadScreen.css';

const UploadScreen = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userLogin);

    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/categories/');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleInputChange = (e, setState) => setState(e.target.files[0]);
    const handleTextChange = (e, setState) => setState(e.target.value);
    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        const userId = token.id; 

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', imageFile);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('countInStock', countInStock);
        formData.append('preview_video', videoFile);
        formData.append('user', userId);
        formData.append('category', selectedCategory);

        dispatch(uploadProduct(formData, userInfo.token));
    };

    return (
        <div className="upload-screen">
            <h2>Upload Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => handleTextChange(e, setName)} required />
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input type="file" id="image" onChange={(e) => handleInputChange(e, setImageFile)} accept="image/*" required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => handleTextChange(e, setDescription)} required />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" value={price} onChange={(e) => handleTextChange(e, setPrice)} required />
                </div>
                <div>
                    <label htmlFor="countInStock">Count in Stock:</label>
                    <input type="number" id="countInStock" value={countInStock} onChange={(e) => handleTextChange(e, setCountInStock)} required />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <select id="category" value={selectedCategory} onChange={handleCategoryChange} required>
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="video">Preview Video:</label>
                    <input type="file" id="video" onChange={(e) => handleInputChange(e, setVideoFile)} accept="video/*" required />
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadScreen;
