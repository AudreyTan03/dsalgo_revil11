import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProduct } from '../actions/uploadAction';
import { Navigate } from 'react-router-dom'; // Import Navigate component
import './UploadScreen.css';

const UploadScreen = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.userLogin);

    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [videoFiles, setVideoFiles] = useState([]);
    const [previewVideoFile, setPreviewVideoFile] = useState(null);
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false); // State to track upload success
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('https://revil24-15f5d0b1bcb1.herokuapp.com/api/categories/');
            const data = await response.json();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    const handleInputChange = (e, setState) => {
        const file = e.target.files[0];
        setState(file);
    };

    const handlePreviewVideoChange = (e) => {
        const file = e.target.files[0];
        setPreviewVideoFile(file);
    };

    const handleTextChange = (e, setState) => {
        const value = e.target.value;
        setState(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', imageFile);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', selectedCategory);
        
        if (previewVideoFile) {
            formData.append('preview_video', previewVideoFile);
        }

        if (videoFiles && videoFiles.length > 0) {
            videoFiles.forEach((video) => {
                formData.append('videos', video);
            });
        }
    
        await dispatch(uploadProduct(formData, userInfo.token));

        setUploadSuccess(true); // Set upload success to true
    };

    const handleAddVideo = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.mp4';
        input.multiple = true;
        input.onchange = (e) => {
            const videos = Array.from(e.target.files);
            setUploadedVideos([...uploadedVideos, ...videos.map(video => ({ title: video.name, file: video }))]);
            setVideoFiles(prevFiles => [...prevFiles, ...videos]);
        };
        input.click();
    };

    // If uploadSuccess is true, navigate to '/products'
    if (uploadSuccess) {    
        return <Navigate to="/productlist" />;
    }

    return (
        <div className="upload-screen" style={{marginTop:'6rem'}}>
            <h2>Upload Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => handleTextChange(e, setName)} required />
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input 
                        type="file" 
                        id="image" 
                        onChange={(e) => handleInputChange(e, setImageFile)} 
                        accept=".jpg, .jpeg, .png" 
                        required 
                        maxSize={5 * 1024 * 1024} 
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => handleTextChange(e, setDescription)} required />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input 
                        type="number" 
                        id="price" 
                        value={price} 
                        onChange={(e) => handleTextChange(e, setPrice)} 
                        onKeyDown={(e) => {
                            if (e.key === '-') {
                                e.preventDefault();
                                alert("You cannot input negative values.");
                            }
                        }}
                        required 
                        className={price < 0 ? "input-error" : ""}
                    />
                    {price < 0 && <p className="error-message">Price cannot be negative</p>}
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="preview_video">Preview Video:</label>
                    <input type="file" id="preview_video" onChange={handlePreviewVideoChange} accept=".mp4" />
                </div>
                <div>
                    <label htmlFor="videos">Videos:</label>
                    <button type="button" onClick={handleAddVideo}>Add Video</button>
                    <ul>
                        {uploadedVideos.map((video, index) => (
                            <li key={index}>{video.title}</li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadScreen;
