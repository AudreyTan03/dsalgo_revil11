

import axios from 'axios';
import {
  POST_QUESTION_REQUEST,
  POST_QUESTION_SUCCESS,
  POST_QUESTION_FAIL,
  POST_REPLY_REQUEST,
  POST_REPLY_SUCCESS,
  POST_REPLY_FAIL,
  LIST_QUESTIONS_REQUEST,
  LIST_QUESTIONS_SUCCESS,
  LIST_QUESTIONS_FAIL,
  LIST_USER_PRODUCT_QUESTIONS_REQUEST,
  LIST_USER_PRODUCT_QUESTIONS_SUCCESS,
  LIST_USER_PRODUCT_QUESTIONS_FAIL,
} from '../constants/questionConstants';   

const instance = axios.create({
    baseURL: 'https://revilll101-27f25f7438c4.herokuapp.com/', // Replace this with your API base URL
  });
  

export const postQuestion = (productId, videoId, questionData) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_QUESTION_REQUEST });
  
      const { userInfo } = getState().userLogin;
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token.access}`,
        },
      };
  
      const { data } = await instance.post(`api/products/${productId}/videos/${videoId}/questions/post/`, questionData, config);
  
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
  
  export const postReply = (productId, videoId, questionId, replyData) => async (dispatch, getState) => {
    try {
        dispatch({ type: POST_REPLY_REQUEST });

        const { userInfo } = getState().userLogin;

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token.access}`,
            },
        };

        const { data } = await instance.post(`api/products/${productId}/videos/${videoId}/questions/${questionId}/reply/`, replyData, config);

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


  export const listQuestions = (productId, videoId) => async (dispatch) => {
    try {
      dispatch({ type: LIST_QUESTIONS_REQUEST });
  
    const { data } = await instance.get(`api/products/${productId}/videos/${videoId}/questions/`);
  
      dispatch({
        type: LIST_QUESTIONS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: LIST_QUESTIONS_FAIL,
        payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
      });
    }
  };


  
export const listUserProductQuestions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_USER_PRODUCT_QUESTIONS_REQUEST });

    const { userInfo } = getState().userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token.access}`,
      },
    };

    const { data } = await instance.get('api/user-product-questions/', config);

    console.log("User Product Questions Data:", data); // Add this console log


    dispatch({
      type: LIST_USER_PRODUCT_QUESTIONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LIST_USER_PRODUCT_QUESTIONS_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};