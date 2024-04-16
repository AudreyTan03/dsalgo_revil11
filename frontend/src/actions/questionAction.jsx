import axios from 'axios';
import {
  POST_QUESTION_REQUEST,
  POST_QUESTION_SUCCESS,
  POST_QUESTION_FAIL,
  POST_REPLY_REQUEST,
  POST_REPLY_SUCCESS,
  POST_REPLY_FAIL,
} from '../constants/questionConstants';   

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Replace this with your API base URL
  });
  

export const postQuestion = (videoId, questionData) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_QUESTION_REQUEST });
  
      const { userInfo } = getState().userLogin;
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token.access}`,
        },
      };
  
      const { data } = await instance.post(`products/${videoId}/videos/questions/`, questionData, config);
  
      dispatch({
        type: POST_QUESTION_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: POST_QUESTION_FAIL,
        payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
      });
    }
  };
  
  export const postReply = (questionId, replyData) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_REPLY_REQUEST });
  
      const { userInfo } = getState().userLogin;
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token.access}`,
        },
      };
  
      const { data } = await instance.post(`products/questions/${questionId}/reply/`, replyData, config);
  
      dispatch({
        type: POST_REPLY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: POST_REPLY_FAIL,
        payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
      });
    }
  };