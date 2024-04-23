// actions/videoActions.js

import axios from 'axios';
import {
  VIDEO_LIST_REQUEST,
  VIDEO_LIST_SUCCESS,
  VIDEO_LIST_FAIL,
  VIDEO_DETAILS_REQUEST,
  VIDEO_DETAILS_SUCCESS,
  VIDEO_DETAILS_FAIL,
  SUBSCRIPTION_REQUEST,
  SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_FAIL,
  GET_VIDEO_DETAILS_REQUEST,
  GET_VIDEO_DETAILS_SUCCESS,
  GET_VIDEO_DETAILS_FAIL,
  UPDATE_USER_INFO,
} from '../constants/videoConstants';

const instance = axios.create({
  baseURL: 'https://revil24-15f5d0b1bcb1.herokuapp.com/',
});

export const listVideos = (productId) => async (dispatch, getState) => { //admin
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

    const { data } = await instance.get(`api/products/${productId}/videos/`, config);
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

export const getVideoDetails = (videoId) => async (dispatch) => { // listvid but for regular
  try {
    dispatch({ type: VIDEO_DETAILS_REQUEST });

    const { data } = await instance.get(`api/videos/${videoId}/`);

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



export const videoDetailView = (id, videoId) => async (dispatch, getState) => { // regulardetailview
  try {
    dispatch({ type: GET_VIDEO_DETAILS_REQUEST });
    
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    const { data } = await instance.get(`api/products/${id}/videos/${videoId}/`, config);

    dispatch({
      type: GET_VIDEO_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_VIDEO_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const checkSubscription = (userId, productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: SUBSCRIPTION_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    // Fetch subscription status for the specific product
    const { data } = await instance.get(`api/check-subscription/${userId}/${productId}/`, config);

    dispatch({
      type: SUBSCRIPTION_SUCCESS,
      payload: { productId, isUserSubscribed: data.isUserSubscribed },
    });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

