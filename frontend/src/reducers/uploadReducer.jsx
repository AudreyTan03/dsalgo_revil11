import { UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE } from '../constants/uploadConstants';

const initialState = {
    uploading: false,
    success: false,
    error: null,
};

const uploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_REQUEST:
            return { ...state, uploading: true };
        case UPLOAD_SUCCESS:
            return { ...state, uploading: false, success: true };
        case UPLOAD_FAILURE:
            return { ...state, uploading: false, error: action.payload };
        default:
            return state;
    }
};

export default uploadReducer;
