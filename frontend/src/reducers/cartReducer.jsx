import { CART_ADD_ITEM, CART_CLEAR_ITEMS, CART_REMOVE_ITEM, CART_SAVE_METHOD, CART_UPDATE_SUBSCRIPTION } from '../constants/cartConstants';
import { USER_LOGOUT } from '../constants/userConstants'
export const cartReducer = (state = { cartItems: [], paymentMethod: '' }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const newItem = action.payload;
            const existingItem = state.cartItems.find(x => x.product === newItem.product);
            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.product === existingItem.product ? newItem : x
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, newItem],
                };
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            };
        case CART_SAVE_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            };
        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: []
            };
        case CART_UPDATE_SUBSCRIPTION:
            const { id, isSubscribed } = action.payload;
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.product === id ? { ...item, isSubscribed } : item
                )
            };
            case USER_LOGOUT:
            return {
                ...state,
                cartItems: []
            };
        default:
            return state;
    }
};