import axios from 'axios';
import { UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE } from '../constants/uploadConstants';

export const uploadProduct = (formData) => async (dispatch) => {
    try {
        dispatch({ type: UPLOAD_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const { data } = await axios.post('http://localhost:8000/api/post-product/', formData, config);

        dispatch({ type: UPLOAD_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPLOAD_FAILURE, payload: error.message });
    }
};
