import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants';

const instance = axios.create({
    baseURL: 'https://revilll101-27f25f7438c4.herokuapp.com/', // Replace this with your API base URL
 });

// Action creator to add an item to the cart
export const addToCart = (id, qty) => async (dispatch, getState) => {
    try {
        const { data } = await instance.get(`api/products/${id}`);

        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty,
            },
        });

        // Use setTimeout as a workaround to allow time for the state to update
        setTimeout(() => {
            localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
        }, 0);
    } catch (error) {
        console.error('Error adding to cart:', error.message);
    }
};

// Action creator to remove an item from the cart
export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: id });

    // Use setTimeout as a workaround to allow time for the state to update
    setTimeout(() => {
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    }, 0);
};

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({ type: 'CART_SAVE_METHOD', payload: data });
    localStorage.setItem('paymentMethod', JSON.stringify(data));
}

