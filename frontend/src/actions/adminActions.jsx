import axios from 'axios';
import {
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    SELECT_USER,
    EDIT_USER_REQUEST,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAIL,

    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAIL,
    GET_PRODUCT_DETAILS_REQUEST,
    GET_PRODUCT_DETAILS_SUCCESS,
    GET_PRODUCT_DETAILS_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    SELECT_PRODUCT,
    EDIT_PRODUCT_REQUEST,
    EDIT_PRODUCT_SUCCESS,
    EDIT_PRODUCT_FAIL,

    GET_VIDEOS_REQUEST,
    GET_VIDEOS_SUCCESS,
    GET_VIDEOS_FAIL,
    SELECT_VIDEO,

    GET_VIDEO_DETAILS_REQUEST,
    GET_VIDEO_DETAILS_SUCCESS,
    GET_VIDEO_DETAILS_FAIL,

    DELETE_VIDEO_REQUEST,
    DELETE_VIDEO_SUCCESS,
    DELETE_VIDEO_FAIL,

    GET_SUBSCRIPTIONS_REQUEST,
    GET_SUBSCRIPTIONS_SUCCESS,
    GET_SUBSCRIPTIONS_FAIL,

    DELETE_SUBSCRIPTION_REQUEST,
    DELETE_SUBSCRIPTION_SUCCESS,
    DELETE_SUBSCRIPTION_FAIL,

    GET_USER_DETAILS_REQUEST,
    GET_USER_DETAILS_SUCCESS,
    GET_USER_DETAILS_FAIL,
} from '../constants/adminConstants';

const instance = axios.create({
    baseURL: 'https://revill01-e38d1bc729a5.herokuapp.com/', // Replace this with your API base URL
  });

export const getUsers = () => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: GET_USERS_REQUEST });
            const response = await instance.get('api/admin/users/', config);
            dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: GET_USERS_FAIL, payload: error.message });
        }
    };
};

export const getUserDetails = (userId) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: GET_USER_DETAILS_REQUEST });
            const response = await instance.get(`api/admin/users/${userId}/`, config);
            dispatch({ type: GET_USER_DETAILS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: GET_USER_DETAILS_FAIL, payload: error.message });
        }
    };
};

export const editUser = (userId, userData) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: EDIT_USER_REQUEST });
            const response = await instance.put(`/api/admin/users/${userId}/`, userData, config);
            dispatch({ type: EDIT_USER_SUCCESS, payload: { userId, userData: response.data } });
            // Dispatch a success message or perform any additional actions if needed
        } catch (error) {
            dispatch({ type: EDIT_USER_FAIL, payload: error.message });
            // Optionally, you can dispatch an action to show an error message to the user
        }
    };
};

export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: DELETE_USER_REQUEST });
            await instance.delete(`/api/admin/users/${userId}/`, config);
            dispatch({ type: DELETE_USER_SUCCESS, payload: userId });
        } catch (error) {
            dispatch({ type: DELETE_USER_FAIL, payload: error.message });
        }
    };
};

export const selectUser = (userId) => ({
    type: SELECT_USER,
    payload: userId
});



export const getProducts = () => {
    return async (dispatch, getState) => {
        try {
            console.log("Dispatching getProducts action...");
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: GET_PRODUCTS_REQUEST });
            const response = await axios.get('/api/admin/products/', config);
            console.log("Response data:", response.data); // Log the response data
            dispatch({ type: GET_PRODUCTS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: GET_PRODUCTS_FAIL, payload: error.message });
        }
    };
};

export const getProductDetails = (productId) => {
    return async (dispatch, getState) => {
      try {
        const { userInfo } = getState().userLogin;
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token.access}`,
          },
        };
        dispatch({ type: GET_PRODUCT_DETAILS_REQUEST });
        const response = await axios.get(`/api/admin/products/${productId}/`, config);
        const productDetails = { ...response.data, user_name: response.data.user_name };

        dispatch({ type: GET_PRODUCT_DETAILS_SUCCESS, payload: productDetails });
    } catch (error) {
        dispatch({ type: GET_PRODUCT_DETAILS_FAIL, payload: error.message });
      }
    };
};

export const editProduct = (productId, productData) => {
    return async (dispatch, getState) => {
        try {
            console.log("Dispatching editProduct action...");
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                    'Content-Type': 'multipart/form-data', // Ensure content type is set for file uploads
                },
            };
            dispatch({ type: EDIT_PRODUCT_REQUEST });
            const response = await axios.put(`/api/admin/products/${productId}/`, productData, config);
            console.log("Response data:", response.data); // Log the response data
            dispatch({ type: EDIT_PRODUCT_SUCCESS, payload: { productId, productData: response.data } });
        } catch (error) {
            dispatch({ type: EDIT_PRODUCT_FAIL, payload: error.message });
        }
    };
};

export const deleteProduct = (productId) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: DELETE_PRODUCT_REQUEST });
            await axios.delete(`/api/admin/products/${productId}/`, config);
            dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: productId });
        } catch (error) {
            dispatch({ type: DELETE_PRODUCT_FAIL, payload: error.message });
        }
    };
};



export const selectProduct = (productId) => ({
    type: SELECT_PRODUCT,
    payload: productId
});


export const getVideos = () => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: GET_VIDEOS_REQUEST });
            const response = await axios.get('/api/admin/videos/', config);
            dispatch({ type: GET_VIDEOS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: GET_VIDEOS_FAIL, payload: error.message });
        }
    };
};


export const getVideoDetails = (videoId) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            console.log('Request Headers:', config.headers);

            dispatch({ type: GET_VIDEO_DETAILS_REQUEST });
            const response = await axios.get(`/api/admin/videos/${videoId}/`, config);
            dispatch({ type: GET_VIDEO_DETAILS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: GET_VIDEO_DETAILS_FAIL, payload: error.message });
        }
    };
};


export const deleteVideo = (videoId) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: DELETE_VIDEO_REQUEST });
            await axios.delete(`/api/admin/videos/${videoId}/`, config);
            dispatch({ type: DELETE_VIDEO_SUCCESS, payload: videoId });
        } catch (error) {
            dispatch({ type: DELETE_VIDEO_FAIL, payload: error.message });
        }
    };
};

export const selectVideo = (videoId) => ({
    type: SELECT_VIDEO,
    payload: videoId
});

export const getSubscriptions = () => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: GET_SUBSCRIPTIONS_REQUEST });
            const response = await axios.get('/api/admin/subscriptions/', config);
            dispatch({ type: GET_SUBSCRIPTIONS_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: GET_SUBSCRIPTIONS_FAIL, payload: error.message });
        }
    };
};


export const deleteSubscription = (subscriptionId) => {
    return async (dispatch, getState) => {
        try {
            const { userInfo } = getState().userLogin;
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token.access}`,
                },
            };
            dispatch({ type: DELETE_SUBSCRIPTION_REQUEST });
            await axios.delete(`/api/admin/subscriptions/${subscriptionId}/`, config);
            dispatch({ type: DELETE_SUBSCRIPTION_SUCCESS, payload: subscriptionId });
        } catch (error) {
            dispatch({ type: DELETE_SUBSCRIPTION_FAIL, payload: error.message });
        }
    };
};