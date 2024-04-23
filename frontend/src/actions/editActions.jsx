import axios from 'axios';
import {
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE
} from '../constants/editConstants';

const instance = axios.create({
    baseURL: 'https://revilll101-27f25f7438c4.herokuapp.com/', // Replace this with your API base URL
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
