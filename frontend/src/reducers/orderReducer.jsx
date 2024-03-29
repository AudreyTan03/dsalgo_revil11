// import axios from 'axios';
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_RESET,
    ORDER_DETAIL_REQUEST,
    ORDER_DETAIL_SUCCESS,
    ORDER_DETAIL_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_RESET,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,
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
export const orderDetailReducer = (state = { loading: true, order: { orderItems: [] } }, action) => {
    switch (action.type) {
        case ORDER_DETAIL_REQUEST:
            return { ...state, loading: true };
        case ORDER_DETAIL_SUCCESS:
            // Ensure the entire order, including orderItems, is nested within an order object.
            return { ...state, loading: false, order: action.payload };
        case ORDER_DETAIL_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


export const orderListMyReducer = (state = {orders:[]}, action) => {
    switch (action.type) {
      case ORDER_LIST_MY_REQUEST:
        return {
          loading: true,
        };
      case ORDER_LIST_MY_SUCCESS:
        return {
          loading: false,
          orders: action.payload
        };
      case ORDER_LIST_MY_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      case ORDER_LIST_MY_RESET:
        return {};
  
      default:
        return state;
    }
  };
  
  
  
  export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
      case ORDER_PAY_REQUEST:
        return {
          loading: true,
        }
      case ORDER_PAY_SUCCESS:
        return {
          loading: false,
          success: true
  
        }
      case ORDER_PAY_FAIL:
        return {
          loading: false,
          error: action.payload,
        }
      case ORDER_PAY_RESET:
        return {}
      default:
        return state
    }
  }
