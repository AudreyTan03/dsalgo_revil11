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


export const listQuestionsReducer = (state = { loading: true, questions: [], error: null }, action) => {
  switch (action.type) {
    case LIST_QUESTIONS_REQUEST:
      return { ...state, loading: true };
    case LIST_QUESTIONS_SUCCESS:
      return { ...state, loading: false, questions: action.payload, error: null };
    case LIST_QUESTIONS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listUserProductQuestionsReducer = (state = { loading: true, questions: [], error: null }, action) => {
  switch (action.type) {
    case LIST_USER_PRODUCT_QUESTIONS_REQUEST:
      return { ...state, loading: true };
    case LIST_USER_PRODUCT_QUESTIONS_SUCCESS:
      return { ...state, loading: false, questions: action.payload, error: null };
    case LIST_USER_PRODUCT_QUESTIONS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
