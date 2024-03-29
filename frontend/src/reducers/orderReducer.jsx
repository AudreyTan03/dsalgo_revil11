// import axios from 'axios';
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_RESET,
    ORDER_DETAIL_REQUEST,
    ORDER_DETAIL_SUCCESS,
    ORDER_DETAIL_FAIL,
} from '../constants/orderConstants';

export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return { loading: true };
        case ORDER_CREATE_SUCCESS:
            return { loading: false, success: true, order: action.payload };
        case ORDER_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_CREATE_RESET:
            return {};
        default:
            return state;
    }
}
export const orderDetailReducer = (state = { loading: true, orderItems: [] }, action) => {
    switch (action.type) {
        case ORDER_DETAIL_REQUEST: // Corrected action type
            return { ...state, loading: true };
        case ORDER_DETAIL_SUCCESS: // Corrected action type
            return { loading: false, order: action.payload };
        case ORDER_DETAIL_FAIL: // Corrected action type
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
