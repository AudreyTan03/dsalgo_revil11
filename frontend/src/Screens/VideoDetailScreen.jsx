// VideoDetailScreen.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoDetails } from '../actions/videoActions';

const VideoDetailScreen = ({ videoId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVideoDetails(videoId));
  }, [dispatch, videoId]);

  const videoDetails = useSelector((state) => state.videoDetails);
  const { loading, error, video } = videoDetails;

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <h1>{video.title}</h1>
          <video controls autoPlay style={{ width: '50%' }}>
            <source src={video.video_file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>Description: {video.description}</p>
          <p>Uploaded At: {video.uploadedAt}</p>
        </div>
      )}
    </div>
  );
};

export default VideoDetailScreen;
