import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptions, deleteSubscription } from '../actions/adminActions';

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
        <div>
            <h2>Subscription List</h2>
            {loading ? (
                <p>Loading subscriptions...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {subscriptions.map(subscription => (
                        <li key={subscription.id}>
                            <span>Subscription ID: {subscription.id}</span>
                            <span>User ID: {subscription.user}</span>
                            <span>Product ID: {subscription.product}</span>
                            <button onClick={() => handleDelete(subscription.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SubscriptionList;
