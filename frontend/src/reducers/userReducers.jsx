import {
  USER_SET_INSTRUCTOR,
  USER_SET_STUDENT,
  USER_SET_ROLE_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_CHANGE_PASSWORD_REQUEST, 
  USER_CHANGE_PASSWORD_SUCCESS, 
  USER_CHANGE_PASSWORD_FAIL, 
  USER_CONFIRM_CHANGE_PASSWORD_REQUEST,
  USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
  USER_CONFIRM_CHANGE_PASSWORD_FAIL,
  USER_VERIFY_OTP_REQUEST,
  USER_VERIFY_OTP_SUCCESS,
  USER_VERIFY_OTP_FAIL, 
  USER_RESEND_OTP_REQUEST,
  USER_RESEND_OTP_SUCCESS,
  USER_RESEND_OTP_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,  
  THEME_UPDATE_REQUEST,
  THEME_UPDATE_SUCCESS,
  THEME_UPDATE_FAIL,
  USER_FETCH_PROFILE_WITH_PRODUCTS_REQUEST,
  USER_FETCH_PROFILE_WITH_PRODUCTS_SUCCESS,
  USER_FETCH_PROFILE_WITH_PRODUCTS_FAIL,
} from '../constants/userConstants';

export const userSetRoleReducer = (state = {}, action) => {
  switch (action.type) {
      case USER_SET_INSTRUCTOR:
          return { ...state, is_instructor: true };
      case USER_SET_STUDENT:
          return { ...state, is_instructor: false };
      case USER_SET_ROLE_FAIL:
          return { ...state, error: action.payload };
      default:
          return state;
  }
};


export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userVerifyOtpReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_VERIFY_OTP_REQUEST:
      return { loading: true };
    case USER_VERIFY_OTP_SUCCESS:
      return { loading: false, success: true };
    case USER_VERIFY_OTP_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
      
  }
}

export const userResendOtpReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_RESEND_OTP_REQUEST:
      return { loading: true };
    case USER_RESEND_OTP_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_RESEND_OTP_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
      case USER_LOGIN_REQUEST:
          return { loading: true };
      case USER_LOGIN_SUCCESS:
          return { loading: false, userInfo: action.payload };
      case USER_LOGIN_FAIL:
          return { loading: false, error: action.payload };
      case USER_LOGOUT:
          return {};
      default:
          return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
switch (action.type) {
  case USER_DETAILS_REQUEST:
    return { ...state, loading: true };
  case USER_DETAILS_SUCCESS:
    return { loading: false, user: action.payload };
  case USER_DETAILS_FAIL:
    return { loading: false, error: action.payload };
  default:
    return state;
}
};

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

const initialState = {
  theme: 'light', // Default theme
  loading: false,
  error: null
};

export const userUpdateThemePreferenceReducer = (state = initialState, action) => {
  switch (action.type) {
      case THEME_UPDATE_REQUEST:
          return {
              ...state,
              loading: true
          };
      case THEME_UPDATE_SUCCESS:
          return {
              ...state,
              loading: false
          };
      case THEME_UPDATE_FAIL:
          return {
              ...state,
              loading: false,
              error: action.payload
          };
      default:
          return state;
  }
};


export const userChangePasswordReducer = (state = {}, action) => {
  switch(action.type) {
      case USER_CHANGE_PASSWORD_REQUEST:
          return { loading: true };
      case USER_CHANGE_PASSWORD_SUCCESS:
          return { loading: false, success: true };
      case USER_CHANGE_PASSWORD_FAIL:
          return { loading: false, error: action.payload };
      default:
          return state;
  }
};

export const userConfirmChangePasswordReducer = (state = {}, action) => {
  switch(action.type) {
      case USER_CONFIRM_CHANGE_PASSWORD_REQUEST:
          return { loading: true };
      case USER_CONFIRM_CHANGE_PASSWORD_SUCCESS:
          return { loading: false, success: true };
      case USER_CONFIRM_CHANGE_PASSWORD_FAIL:
          return { loading: false, error: action.payload };
      default:
          return state;
  }
};


export const userProfileWithProductsReducer = (state = { profile: {}, products: [], loading: false, error: null }, action) => {
switch (action.type) {
    case USER_FETCH_PROFILE_WITH_PRODUCTS_REQUEST:
        return { ...state, loading: true };
    case USER_FETCH_PROFILE_WITH_PRODUCTS_SUCCESS:
        return { loading: false, profile: action.payload.user_profile, products: action.payload.products };
    case USER_FETCH_PROFILE_WITH_PRODUCTS_FAIL:
        return { loading: false, error: action.payload };
    default:
        return state;
  }
};