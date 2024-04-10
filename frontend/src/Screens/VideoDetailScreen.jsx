import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoDetails } from '../actions/videoActions';
import Message from '../Components/Message';
import Loader from '../Components/Loader';

const VideoDetailScreen = ({ videoId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVideoDetails(videoId));
  }, [dispatch, videoId]);

  const videoDetails = useSelector((state) => state.videoDetails);
  const { loading, error, video } = videoDetails;

  // Get user subscription status from state
  const { isSubscribed } = useSelector((state) => state.user);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <h1>{video.title}</h1>
          {/* Check subscription status before rendering the video */}
          {isSubscribed ? (
            <video controls autoPlay style={{ width: '50%' }}>
              <source src={video.video_file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Message variant="info">You need to subscribe to view this video.</Message>
          )}
          <p>Description: {video.description}</p>
          <p>Uploaded At: {video.uploadedAt}</p>
        </div>
      )}
    </div>
  );
};

export default VideoDetailScreen;
