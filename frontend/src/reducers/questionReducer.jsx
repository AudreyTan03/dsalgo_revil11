import {
    POST_QUESTION_REQUEST,
    POST_QUESTION_SUCCESS,
    POST_QUESTION_FAIL,
    POST_REPLY_REQUEST,
    POST_REPLY_SUCCESS,
    POST_REPLY_FAIL,
  } from '../constants/questionConstants';
  
  export const postQuestionReducer = (state = { loading: false, error: null, question: null }, action) => {
    switch (action.type) {
      case POST_QUESTION_REQUEST:
        return { ...state, loading: true };
      case POST_QUESTION_SUCCESS:
        return { ...state, loading: false, question: action.payload, error: null };
      case POST_QUESTION_FAIL:
        return { ...state, loading: false, error: action.payload, question: null };
      default:
        return state;
    }
  };
  
  export const postReplyReducer = (state = { loading: false, error: null, reply: null }, action) => {
    switch (action.type) {
      case POST_REPLY_REQUEST:
        return { ...state, loading: true };
      case POST_REPLY_SUCCESS:
        return { ...state, loading: false, reply: action.payload, error: null };
      case POST_REPLY_FAIL:
        return { ...state, loading: false, error: action.payload, reply: null };
      default:
        return state;
    }
  };
  