// actions/videoActions.js

import axios from 'axios';
import {
  VIDEO_LIST_REQUEST,
  VIDEO_LIST_SUCCESS,
  VIDEO_LIST_FAIL,
  VIDEO_DETAILS_REQUEST,
  VIDEO_DETAILS_SUCCESS,
  VIDEO_DETAILS_FAIL,
} from '../constants/videoConstants';

export const listVideos = (productId) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_LIST_REQUEST });

    const { data } = await axios.get(`/api/products/${productId}/videos/`);

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
