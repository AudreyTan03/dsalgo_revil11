import {
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE
} from '../constants/editConstants';

const initialState = {
    loading: false,
    error: null
};

const updateProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRODUCT_REQUEST:
            return { ...state, loading: true, success: false, error: null };
        case UPDATE_PRODUCT_SUCCESS:
            return { ...state, loading: false, success: true };
        case UPDATE_PRODUCT_FAILURE:
            return { ...state, loading: false, success: false, error: action.payload };
        default:
            return state;
    }
}; 

export default updateProductReducer;
