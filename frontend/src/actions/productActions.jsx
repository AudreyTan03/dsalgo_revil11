import axios from 'axios';
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    SEARCH_REQUEST,
    SEARCH_SUCCESS,
    SEARCH_FAIL,
} from '../constants/productConstants';

const instance = axios.create({
    baseURL: 'https://revil24-15f5d0b1bcb1.herokuapp.com/', // Replace this with your API base URL
  });

// Action creator for searching
export const search = (query) => async (dispatch) => {
    try {
        dispatch({ type: SEARCH_REQUEST });
        const { data } = await instance.get(`api/search/?query=${query}`);
        dispatch({ type: SEARCH_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SEARCH_FAIL, payload: 
            error.message && error.response.data.message 
            ? error.response.data.message 
            : error.message
        });
    }
};

// Existing action creators for listing products and getting product details
export const listProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        const { data } = await instance.get('api/products/');
        dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: PRODUCT_LIST_FAIL, payload: 
            error.message && error.response.data.message 
            ? error.response.data.message 
            : error.message
        });
    }
};

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });
        const { data } = await instance.get(`api/products/${id}`);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: PRODUCT_DETAILS_FAIL, payload: 
            error.message && error.response.data.message 
            ? error.response.data.message 
            : error.message
        });
    }
};
