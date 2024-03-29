import axios from 'axios';
import {
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE
} from '../constants/editConstants';

export const updateProductRequest = () => ({
    type: UPDATE_PRODUCT_REQUEST
});

export const updateProductSuccess = (product) => ({
    type: UPDATE_PRODUCT_SUCCESS,
    payload: product
});

export const updateProductFailure = (error) => ({
    type: UPDATE_PRODUCT_FAILURE,
    payload: error
});

export const updateProduct = (productId, formData) => {
    return async (dispatch) => {
        dispatch(updateProductRequest());
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/products/${productId}/edit/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(updateProductSuccess(response.data));
        } catch (error) {
            dispatch(updateProductFailure(error.message));
        }
    };
};
