import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk'; // Correct import statement
import {
  productListReducer,
  productDetailsReducer,
  searchReducer,
} from './reducers/productsReducer';
import {
  userLoginReducer,
  userRegisterReducer,
  userVerifyOtpReducer,
  userResendOtpReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userUpdateThemePreferenceReducer,
  userProfileWithProductsReducer,
  userChangePasswordReducer,
  userConfirmChangePasswordReducer,
} from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducer';
import {
  orderCreateReducer,
  orderDetailReducer,
  orderListMyReducer,
  orderPayReducer,
} from './reducers/orderReducer';
import { videoListReducer, videoDetailsReducer } from './reducers/videoReducer';
import { userReducer, productReducer, videoReducer, subscriptionReducer } from './reducers/adminReducer';

// Define rootReducer using combineReducers
const rootReducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userVerifyOtp: userVerifyOtpReducer,
  userResendOtp: userResendOtpReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userUpdateThemePreference: userUpdateThemePreferenceReducer,
  userChangePassword: userChangePasswordReducer,
  userConfirmChangePassword: userConfirmChangePasswordReducer,
  videoList: videoListReducer,
  videoDetails: videoDetailsReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  Subscription: subscriptionReducer,
  search: searchReducer,
  // admin stuff
  userReducer: userReducer,
  productReducer: productReducer,
  videoReducer: videoReducer,
  userProfileWithProducts: userProfileWithProductsReducer,
});

// Retrieve cartItems and userInfo from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Set initialState with data from localStorage
const initialState = {
  cart: { cartItems: cartItemsFromStorage },
  userRegister: { userInfo: userInfoFromStorage },
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
