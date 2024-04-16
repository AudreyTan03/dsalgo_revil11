import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVideoDetails } from '../actions/adminActions';
import { useParams } from 'react-router-dom';

const AdminVideoDetails = () => {
    const dispatch = useDispatch();
    const video = useSelector(state => state.videoReducer.selectedVideo);
    const loading = useSelector((state) => state.videoReducer.loading);
    const { videoId } = useParams(); 
    console.log('Video ID from useParams:', videoId);

    const error = useSelector((state) => state.videoReducer.error);

    useEffect(() => {
        dispatch(getVideoDetails(videoId));
        console.log("Dispatching getVideoDetails action...");
    }, [dispatch, videoId]);

    console.log("Selected video:", video); // Log the selected video here
    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div>
                    {/* Render video details here */}
                    {video && (
                        <div>
                            <h2>{video.title}</h2>
                            <p>{video.description}</p>
                            {/* Construct the video URL */}
                                <video controls width="500">
                                    <source src={video.video_file} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                        </div>
                    )}
                </div>
            )}
        </div>  
    );
};

export default AdminVideoDetails;
