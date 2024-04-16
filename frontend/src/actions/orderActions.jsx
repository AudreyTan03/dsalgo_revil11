import axios from 'axios';
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    // CART_CLEAR_ITEMS,
    ORDER_DETAIL_REQUEST,
    ORDER_DETAIL_SUCCESS,
    ORDER_DETAIL_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    
} from '../constants/orderConstants';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST });
        
        const {
            userLogin: { userInfo },
        } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token.access}`,
            },
        };
        const { data } = await axios.post('api/add/', order, config);
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });
        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data.CART_CLEAR_ITEM
        });
        localStorage.removeItem('cartItems');
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
      dispatch({ type: ORDER_DETAIL_REQUEST });

      const {
          userLogin: { userInfo },
      } = getState();

      const config = {
          headers: {
              Authorization: `Bearer ${userInfo.token.access}`,
              "Content-Type": "application/json"
          },
      };

      const { data } = await axios.get(`/api/order/${id}/`, config);
      console.log("API Response:", data); // Log the API response

      dispatch({
          type: ORDER_DETAIL_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: ORDER_DETAIL_FAIL,
          payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
      });
  }
};


  
  
export const getMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token.access}`, // Ensure this is "Bearer <token>"
      },
    };
    const { data } = await axios.get(`/api/orders/myorders/`, config);
    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

  
  
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8000",
  })
   
  export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_PAY_REQUEST,
      });
  
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token.access}`, // Ensure this is "Bearer <token>"
        },
      };
      const { data } = await instance.put(`/api/orders/${id}/pay/`,paymentResult, config);
      dispatch({
        type: ORDER_PAY_SUCCESS,
        payload: data,
      });
  
  
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

