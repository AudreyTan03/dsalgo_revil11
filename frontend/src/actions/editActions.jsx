import axios from 'axios';
import {
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE
} from '../constants/editConstants';

const instance = axios.create({
    baseURL: 'https://revil24-15f5d0b1bcb1.herokuapp.com/', // Replace this with your API base URL
  });

  export const updateProduct = (productId, formData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        try {
            const response = await instance.patch(`api/products/${productId}/edit/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: error.message });
        }
    };
};
