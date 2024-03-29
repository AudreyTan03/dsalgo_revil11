import axios from 'axios';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_SET_INSTRUCTOR,
    USER_SET_STUDENT,
    USER_CHANGE_PASSWORD_REQUEST,
    USER_CHANGE_PASSWORD_SUCCESS,
    USER_CHANGE_PASSWORD_FAIL,
    USER_CONFIRM_CHANGE_PASSWORD_REQUEST,
    USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
    USER_CONFIRM_CHANGE_PASSWORD_FAIL,
    USER_REQUEST_RESET_PASSWORD_REQUEST,
    USER_REQUEST_RESET_PASSWORD_SUCCESS,
    USER_REQUEST_RESET_PASSWORD_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    // USER_SET_ROLE_FAIL
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
} from '../constants/userConstants';

export const register = (name, email, password, userType, confirmPassword) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/users/register/',
        { name, email, password, password2: confirmPassword, user_type: userType }, // Include confirmPassword as password2
        config
      );
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });
  
      // Redirect to OTP verification screen
      const { user_id, otp_id } = data; // Ensure that user_id and otp_id are present in the response
      return { user_id, otp_id }; // Return user_id and otp_id for redirection
  
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: error.response && error.response.data.details
          ? error.response.data.details
          : error.message,
      });
      throw error; // Rethrow the error for handling in the component
    }
  };
  

export const VerifyOtp = (user_id, otp_id, otp_code) => async (dispatch) => {
    try {
        console.log(user_id, otp_id, otp_code);
        dispatch({
            type: USER_VERIFY_OTP_REQUEST  // Corrected action type name
        });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            'http://127.0.0.1:8000/api/verify-otp/',
            { user_id: user_id, otp_id: otp_id, otp_code: otp_code }, // Corrected object key names
            config
        );
        dispatch({
            type: USER_VERIFY_OTP_SUCCESS,  // Corrected action type name
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_VERIFY_OTP_FAIL,  // Add appropriate action type for failure
            payload: error.response && error.response.data.details
                ? error.response.data.details
                : error.message,
        });
    }
};


export const ResendOtp = (user_id, otp_id) => async (dispatch) => {
    try {
        dispatch({
            type: USER_RESEND_OTP_REQUEST,
        });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        // Ensure user_id and otp_id are not null
        // if (!user_id || !otp_id) {
        //     throw new Error("User ID or OTP ID is missing.");
        // }

        const { data } = await axios.post(
            "/api/resend-otp/",
            { user_id, otp_id },
            config
        );

        dispatch({
            type: USER_RESEND_OTP_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_RESEND_OTP_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// export const ResendOtp = (user_id, otp_id) => async (dispatch) => {
//     try {
//       dispatch({
//         type: USER_RESEND_OTP_REQUEST,
//       });
  
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       };
  
//       const { data } = await axios.post('http://127.0.0.1:8000/api/resend-otp/', { user_id, otp_id }, config);
  
//       dispatch({
//         type: USER_RESEND_OTP_SUCCESS,
//         payload: data,
//       });
//     } catch (error) {
//       dispatch({
//         type: USER_RESEND_OTP_FAIL,
//         payload:
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message,
//       });
//     }
//   };


const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/'
})

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await instance.post(
            'api/users/login/',
            { email, password },
            config
        );

        console.log('data',data)
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
        localStorage.setItem('userInfo', JSON.stringify(data));

        // Set user role
        // if (data.is_instructor) {
        //     dispatch({ type: USER_SET_INSTRUCTOR });
        // } else {
        //     dispatch({ type: USER_SET_STUDENT });
        // }

        // Redirect logic here

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.details
                ? error.response.data.details
                : error.message,
        });
    }
};

export const getUserDetails = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
  
        const {
            userLogin: { userInfo },
        } = getState();
  
        if (!userInfo || !userInfo.token) {
            throw new Error('User information is missing or incomplete');
        }
  
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token.access}`,
            },
        };
  
        console.log('Access Token:', userInfo.token.access);
        const { data } = await axios.get('api/profile/', config);
        console.log('Response Data:', data);
  
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response
                ? error.response.data.message
                : error.message || 'Error fetching user details',
        });
    }
};

export const updateThemePreference = (theme) => async (dispatch) => {
    try {
      dispatch({ type: THEME_UPDATE_REQUEST });
  
      // Send a request to update the theme preference
      const { data } = await axios.put('/api/update-theme', { theme });
  
      dispatch({ type: THEME_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: THEME_UPDATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  }

export const resetUpdateProfile = () => (dispatch) => {
    dispatch({ type: USER_UPDATE_PROFILE_RESET });
  };
  
  export const updateUserProfile = (updatedUser, profilePicture) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
  
        const { userLogin: { userInfo } } = getState();
  
        if (!userInfo || !userInfo.token) {
            throw new Error('User information is missing or incomplete');
        }
  
        const formData = new FormData();
  
        formData.append('name', updatedUser.name || '');
        formData.append('email', updatedUser.email || '');
  
        if (profilePicture) {
            formData.append('userprofile_pics', profilePicture);
        }
  
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token.access}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        console.log('Access Token:', userInfo.token.access);
  
        const { data } = await axios.put('api/profile/update/', formData, config);
  
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data.profile_data,
        });
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response
                ? error.response.data.message
                : error.message || 'Error updating user profile',
        });
    }
};




// Other action creators...


export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
};

export const changePassword = (password, password2, token) => async (dispatch) => {
    try {
        dispatch({ type: USER_CHANGE_PASSWORD_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            'http://127.0.0.1:8000/api/changepassword/',
            { password, password2 },
            config
        );
        dispatch({
            type: USER_CHANGE_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_CHANGE_PASSWORD_FAIL,
            payload: error.response && error.response.data.details
                ? error.response.data.details
                : error.message,
        });
    }
};

export const requestResetPassword = (email) => async (dispatch) => {
    try {
        // Dispatch request action
        dispatch({ type: USER_REQUEST_RESET_PASSWORD_REQUEST });

        // Set request headers
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Send POST request to backend to request password reset
        const { data } = await axios.post(
            'http://127.0.0.1:8000/api/users/resetpassword-email/',
            { email },
            config
        );

        // Dispatch success action with response data
        dispatch({
            type: USER_REQUEST_RESET_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        // Dispatch fail action with error details
        dispatch({
            type: USER_REQUEST_RESET_PASSWORD_FAIL,
            payload: error.response && error.response.data.details
                ? error.response.data.details
                : error.message,
        });
    }
};

export const confirmChangePassword = (password, password2, uid, token) => async (dispatch) => {
    try {
        dispatch({ type: USER_CONFIRM_CHANGE_PASSWORD_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            `http://127.0.0.1:8000/api/users/reset-password/${uid}/${token}`,
            { password, password2 },
            config
        );
        dispatch({
            type: USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_CONFIRM_CHANGE_PASSWORD_FAIL,
            payload: error.response && error.response.data.details
                ? error.response.data.details
                : error.message,
        });
    }
};