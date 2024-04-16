import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { videoDetailView } from '../actions/videoActions';

const VideoDetailViewScreen = () => { // Detailview sa card shit
  const { productId, videoId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const video = useSelector((state) => state.videoDetailViewReducer.video);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        dispatch(videoDetailView(productId, videoId));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [dispatch, productId, videoId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!video) {
    return <div>No video found</div>;
  }

  return (
    <div>
      <h1>Video Details</h1>
      <p>Title: {video.title}</p>
      <p>Description: {video.description}</p>
      <video controls autoPlay style={{ width: '50%' }}>
        <source src={video.video_file} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoDetailViewScreen;
