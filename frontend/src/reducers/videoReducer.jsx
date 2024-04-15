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
} from '../constants/videoConstants';

export const videoListReducer = (state = { videos: [] }, action) => {
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

export const videoDetailsReducer = (state = { video: {} }, action) => {
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

