import {
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_REQUEST,
    DELETE_USER_FAIL,
    SELECT_USER,
    EDIT_USER_REQUEST,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAIL,
    GET_USER_DETAILS_REQUEST,
    GET_USER_DETAILS_SUCCESS,
    GET_USER_DETAILS_FAIL,

    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAIL,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_FAIL,
    SELECT_PRODUCT,
    EDIT_PRODUCT_REQUEST,
    EDIT_PRODUCT_SUCCESS,
    EDIT_PRODUCT_FAIL,
    GET_PRODUCT_DETAILS_REQUEST,
    GET_PRODUCT_DETAILS_SUCCESS,
    GET_PRODUCT_DETAILS_FAIL,

    GET_VIDEOS_REQUEST,
    GET_VIDEOS_SUCCESS,
    GET_VIDEOS_FAIL,
    GET_VIDEO_DETAILS_REQUEST,
    GET_VIDEO_DETAILS_SUCCESS,
    GET_VIDEO_DETAILS_FAIL,
    SELECT_VIDEO,

    GET_SUBSCRIPTIONS_REQUEST,
    GET_SUBSCRIPTIONS_SUCCESS,
    GET_SUBSCRIPTIONS_FAIL,
    
    DELETE_SUBSCRIPTION_REQUEST,
    DELETE_SUBSCRIPTION_SUCCESS,
    DELETE_SUBSCRIPTION_FAIL,
    DELETE_VIDEO_REQUEST,
    DELETE_VIDEO_SUCCESS,
    DELETE_VIDEO_FAIL,

} from '../constants/adminConstants';

const initialUserState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null
};

const initialProductState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null
};

const initialVideoState = {
    videos: [],
    selectedVideo: null,
    loading: false,
    error: null
};

const initialSubscriptionState = {
    subscriptions: [],
    loading: false,
    error: null
};

export const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case GET_USERS_REQUEST:
        case DELETE_USER_REQUEST:
        case EDIT_USER_REQUEST:
        case GET_USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload,
                error: null
            };
        case GET_USER_DETAILS_SUCCESS: 
            return {
                ...state,
                loading: false,
                selectedUser: action.payload,
                error: null
            };
        case GET_USERS_FAIL:
        case DELETE_USER_FAIL:
        case EDIT_USER_FAIL:
        case GET_USER_DETAILS_FAIL: 
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.filter(user => user.id !== action.payload),
                error: null
            };
        case SELECT_USER:
            return { ...state, selectedUser: action.payload };
        case EDIT_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.map(user =>
                    user.id === action.payload.userId ? { ...user, ...action.payload.userData } : user
                ),
                error: null
            };
        default:
            return state;
    }
};


export const productReducer = (state = initialProductState, action) => {
    switch (action.type) {
        case GET_PRODUCTS_REQUEST:
        case DELETE_PRODUCT_REQUEST:
        case EDIT_PRODUCT_REQUEST:
        case GET_PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload,
                error: null
            };
        case GET_PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedProduct: action.payload,
                error: null
            };
        case GET_PRODUCTS_FAIL:
        case DELETE_PRODUCT_FAIL:
        case EDIT_PRODUCT_FAIL:
        case GET_PRODUCT_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.filter(product => product.id !== action.payload),
                error: null
            };
        case SELECT_PRODUCT:
            return {
                ...state,
                selectedProduct: action.payload
            };
        case EDIT_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.map(product =>
                    product.id === action.payload.productId ? { ...product, ...action.payload.productData } : product
                ),
                error: null
            };
        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.filter(product => product._id !== action.payload),
                error: null
            };
        case DELETE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};



export const videoReducer = (state = initialVideoState, action) => {
    switch (action.type) {
        case GET_VIDEOS_REQUEST:
        case DELETE_VIDEO_REQUEST:
        case GET_VIDEO_DETAILS_REQUEST: 
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_VIDEOS_SUCCESS:
            return {
                ...state,
                loading: false,
                videos: action.payload,
                error: null
            };
        case GET_VIDEO_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedVideo: action.payload,
                error: null
            };
        case GET_VIDEOS_FAIL:
        case DELETE_VIDEO_FAIL:
        case GET_VIDEO_DETAILS_FAIL: 
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case DELETE_VIDEO_SUCCESS:
            return {
                ...state,
                loading: false,
                videos: state.videos.filter(video => video.id !== action.payload),
                error: null
            };
        case SELECT_VIDEO:
            return {
                ...state,
                selectedVideo: action.payload
            };
        default:
            return state;
    }
}; 

export const subscriptionReducer = (state = initialSubscriptionState, action) => {
    switch (action.type) {
        case GET_SUBSCRIPTIONS_REQUEST:
        case DELETE_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_SUBSCRIPTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                subscriptions: action.payload,
                error: null
            };
        case GET_SUBSCRIPTIONS_FAIL:
        case DELETE_SUBSCRIPTION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case DELETE_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                subscriptions: state.subscriptions.filter(subscription => subscription.id !== action.payload),
                error: null
            };
        default:
            return state;
    }
};