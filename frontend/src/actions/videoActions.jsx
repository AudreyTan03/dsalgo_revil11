// actions/videoActions.js

import axios from 'axios';
import {
  VIDEO_LIST_REQUEST,
  VIDEO_LIST_SUCCESS,
  VIDEO_LIST_FAIL,
  VIDEO_DETAILS_REQUEST,
  VIDEO_DETAILS_SUCCESS,
  VIDEO_DETAILS_FAIL,
  VIDEO_SUBSCRIBE_REQUEST,
  VIDEO_SUBSCRIBE_SUCCESS,
  VIDEO_SUBSCRIBE_FAIL,
} from '../constants/videoConstants';

export const listVideos = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: VIDEO_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    console.log('User Info:', userInfo); // Log userInfo here


    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    console.log('Request Config:', config); // Log request config here

    const { data } = await axios.get(`/api/products/${productId}/videos/`, config);
    console.log('Video Data:', data); // Log video data here


    dispatch({
      type: VIDEO_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: VIDEO_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getVideoDetails = (videoId) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/videos/${videoId}/`);

    dispatch({
      type: VIDEO_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: VIDEO_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const subscribeToVideo = (productId, videoId) => async (dispatch, getState) => {
  try {
    dispatch({ type: VIDEO_SUBSCRIBE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    // Make API call to subscribe to the video
    await axios.post(`/api/products/${productId}/videos/${videoId}/subscribe/`, {}, config);

    dispatch({ type: VIDEO_SUBSCRIBE_SUCCESS });
  } catch (error) {
    dispatch({
      type: VIDEO_SUBSCRIBE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};