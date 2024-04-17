import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptions, deleteSubscription } from '../actions/adminActions';
import './subscriptionlist.css'

const SubscriptionList = () => {
    const dispatch = useDispatch();
    const subscriptions = useSelector(state => state.subscriptionReducer.subscriptions);
    const loading = useSelector(state => state.subscriptionReducer.loading);
    const error = useSelector(state => state.subscriptionReducer.error);

    useEffect(() => {
        dispatch(getSubscriptions());
    }, [dispatch]);

    const handleDelete = (subscriptionId) => {
        if (window.confirm('Are you sure you want to delete this subscription?')) {
            dispatch(deleteSubscription(subscriptionId));
        }
    };

    return (
        <div className="subscription-list">
            <h2 className="subscription-list__heading">Subscription List</h2>
            {loading ? (
                <p className="subscription-list__message">Loading subscriptions...</p>
            ) : error ? (
                <p className="subscription-list__message">Error: {error}</p>
            ) : (
                <ul className="subscription-list__items">
                    {subscriptions.map(subscription => (
                        <li key={subscription.id} className="subscription-list__item">
                            <span className="subscription-list__item-info">Subscription ID: {subscription.id}</span>
                            <span className="subscription-list__item-info">User ID: {subscription.user}</span>
                            <span className="subscription-list__item-info">Product ID: {subscription.product}</span>
                            <button onClick={() => handleDelete(subscription.id)} className="subscription-list__delete-button">Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SubscriptionList;
