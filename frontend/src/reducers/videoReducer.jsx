// reducers/videoReducers.js

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
  UPDATE_USER_INFO,
  GET_VIDEO_DETAILS_REQUEST,
  GET_VIDEO_DETAILS_SUCCESS,
  GET_VIDEO_DETAILS_FAIL,
} from '../constants/videoConstants';

export const videoListReducer = (state = { videos: [] }, action) => { //admin
  switch (action.type) {
    case VIDEO_LIST_REQUEST:
      return { loading: true, videos: [] };
    case VIDEO_LIST_SUCCESS:
      return { loading: false, videos: action.payload };
    case VIDEO_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const videoDetailsReducer = (state = { video: {} }, action) => { //listvids reg
  switch (action.type) {
    case VIDEO_DETAILS_REQUEST:
      return { loading: true, ...state };
    case VIDEO_DETAILS_SUCCESS:
      return { loading: false, video: action.payload };
    case VIDEO_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const subscriptionReducers = (state = { loading: false, subscriptions: {}, error: null }, action) => {
  switch (action.type) {
    case SUBSCRIPTION_REQUEST:
      return { ...state, loading: true };
    case SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptions: 
          action.payload.isUserSubscribed,
        error: null
      };
    case SUBSCRIPTION_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const videoDetailViewReducer = (state = { video: null, loading: false, error: null }, action) => {// regular
  switch (action.type) {
    case GET_VIDEO_DETAILS_REQUEST:
      return { loading: true, video: null, error: null };
    case GET_VIDEO_DETAILS_SUCCESS:
      return { loading: false, video: action.payload, error: null };
    case GET_VIDEO_DETAILS_FAIL:
      return { loading: false, video: null, error: action.payload };
    default:
      return state;
  }
};