import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVideoDetails } from '../actions/adminActions';
import { useParams, Link } from 'react-router-dom';
import './adminvideo.css'; // Import CSS for styling

const AdminVideoDetails = () => {
    const dispatch = useDispatch();
    const video = useSelector(state => state.videoReducer.selectedVideo);
    const loading = useSelector(state => state.videoReducer.loading);
    const { videoId } = useParams(); 
    const error = useSelector(state => state.videoReducer.error);

    useEffect(() => {
        dispatch(getVideoDetails(videoId));
    }, [dispatch, videoId]);

    return (
        <div className="admin-video-box">
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div className="video-container">
                    {video && (
                        <div className="video-details">
                            <video className="video-player" controls>
                                <source src={video.video_file} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-footer">
                                <h2 className="video-title">{video.title}</h2>
                                <Link to="/admin" className="go-back-link">Go Back</Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>  
    );
};

export default AdminVideoDetails;
