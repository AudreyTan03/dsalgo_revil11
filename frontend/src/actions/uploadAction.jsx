import axios from 'axios';
import { UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE } from '../constants/uploadConstants';

export const uploadProduct = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPLOAD_REQUEST });
        const { userLogin: { userInfo } } = getState();

        // Note the addition of "Bearer " before the token
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo.token.access}`, 
            },
        };

        const { data } = await axios.post('http://localhost:8000/api/post-product/', formData, config);

        dispatch({ type: UPLOAD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPLOAD_FAILURE, payload: error.response?.data?.detail || error.message });
    }
};
