import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk'; // Correct import statement
import { productListReducer, productDetailsReducer } from './reducers/productsReducer';
import { userLoginReducer, userRegisterReducer, userVerifyOtpReducer, userResendOtpReducer, userDetailsReducer, userUpdateProfileReducer, userUpdateThemePreferenceReducer, userProfileWithProductsReducer  } from './reducers/userReducers';
// import { userRegisterReducer } from './reducers/registerReducers'; // Import new reducers
import { cartReducer } from './reducers/cartReducer';
import { userChangePasswordReducer, userConfirmChangePasswordReducer } from './reducers/userReducers';
import { orderCreateReducer, orderDetailReducer,  orderListMyReducer, orderPayReducer } from './reducers/orderReducer';
import {videoListReducer, videoDetailsReducer, videoDetailViewReducer} from './reducers/videoReducer';
import { userReducer, productReducer, videoReducer, subscriptionReducer } from './reducers/adminReducer';
import { subscriptionReducers } from './reducers/videoReducer';
import { postQuestionReducer, postReplyReducer } from './reducers/questionReducer'


// Define rootReducer using combineReducers
const rootReducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userChangePassword: userChangePasswordReducer, // Add new reducer
    userConfirmChangePassword: userConfirmChangePasswordReducer, // Add new reducer
    userVerifyOtp: userVerifyOtpReducer,
    userResendOtp: userResendOtpReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdateThemePreference: userUpdateThemePreferenceReducer,
    videoList : videoListReducer,
    videoDetails : videoDetailsReducer,
    videoDetailViewReducer : videoDetailViewReducer,
    postQuestion: postQuestionReducer,
    postReply: postReplyReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailReducer, 
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    Subscription: subscriptionReducers,
    // admin shit
    userReducer: userReducer,
    productReducer: productReducer,
    videoReducer: videoReducer,
    subscriptionReducer: subscriptionReducer,
    userProfileWithProducts: userProfileWithProductsReducer,
    
});

// Retrieve cartItems and userInfo from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [];
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;


// Set initialState with data from localStorage
const initialState = {
    cart: { cartItems: cartItemsFromStorage },
    userRegister: {userInfo: userInfoFromStorage},
    userLogin: { userInfo: userInfoFromStorage },
};

// Configure Redux store with rootReducer, initialState, and middleware
const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// Subscribe to store updates and update localStorage with cartItems
store.subscribe(() => {
    const { cart } = store.getState();
    localStorage.setItem('cartItems', JSON.stringify(cart.cartItems));
});

export default store;