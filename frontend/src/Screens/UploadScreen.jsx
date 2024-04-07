import React, { useState } from 'react';
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
    const [videoFiles, setVideoFiles] = useState([]);
    const [previewVideoFile, setPreviewVideoFile] = useState(null);
    const [uploadedVideos, setUploadedVideos] = useState([]);

    const handleInputChange = (e, setState) => {
        const file = e.target.files[0]; // Get the first file from the FileList
        setState(file);
    };

    const handlePreviewVideoChange = (e) => {
        const file = e.target.files[0];
        setPreviewVideoFile(file);
    };

    const handleTextChange = (e, setState) => setState(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', imageFile);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('countInStock', countInStock);
        
        if (previewVideoFile) {
            formData.append('preview_video', previewVideoFile);
        }

        if (videoFiles && videoFiles.length > 0) {
            videoFiles.forEach((video) => {
                formData.append('videos', video);
            });
        }
    
        dispatch(uploadProduct(formData, userInfo.token));
    };

    const handleAddVideo = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.multiple = true;
        input.onchange = (e) => {
            const videos = Array.from(e.target.files);
            setUploadedVideos([...uploadedVideos, ...videos.map(video => ({ title: video.name, file: video }))]);
            setVideoFiles(prevFiles => [...prevFiles, ...videos]);
        };
        input.click();
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
                    <label htmlFor="preview_video">Preview Video:</label>
                    <input type="file" id="preview_video" onChange={handlePreviewVideoChange} accept="video/*" />
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
