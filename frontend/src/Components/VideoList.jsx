import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos, deleteVideo } from '../actions/adminActions';
import { Link } from 'react-router-dom';

const VideoList = () => {
    const dispatch = useDispatch();
    const videos = useSelector(state => state.videoReducer.videos);

    useEffect(() => {
        dispatch(getVideos());
    }, [dispatch]);

    const handleDelete = (videoId) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            dispatch(deleteVideo(videoId));
        }
    };

    return (
        <div>
            <h2>Video List</h2>
            <ul>
                {videos && videos.map(video => (
                    <li key={video.id}>
                        <span>Name: <Link to={`/admin/video-details/${video.id}`} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>{video.title}</Link></span>
                        <button onClick={() => handleDelete(video.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VideoList;
