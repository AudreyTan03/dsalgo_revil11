import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptions, deleteSubscription } from '../actions/adminActions';
import './subscriptionlist.css';

const SubscriptionList = () => {
    const dispatch = useDispatch();
    const subscriptions = useSelector(state => state.subscriptionReducer.subscriptions);
    const loading = useSelector(state => state.subscriptionReducer.loading);
    const error = useSelector(state => state.subscriptionReducer.error);

    useEffect(() => {
        dispatch(getSubscriptions());
    }, [dispatch]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [subscriptionsPerPage] = useState(5);

    // Get current subscriptions
    const indexOfLastSubscription = currentPage * subscriptionsPerPage;
    const indexOfFirstSubscription = indexOfLastSubscription - subscriptionsPerPage;
    const currentSubscriptions = subscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

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
                <>
                    <ul className="subscription-list__items">
                        {currentSubscriptions.map(subscription => (
                            <li key={subscription.id} className="subscription-list__item">
                                <span className="subscription-list__item-info">Subscription ID: {subscription.id}</span>
                                <span className="subscription-list__item-info">User ID: {subscription.user}</span>
                                <span className="subscription-list__item-info">Product ID: {subscription.product}</span>
                                <button onClick={() => handleDelete(subscription.id)} className="subscription-list__delete-button">Delete</button>
                            </li>
                        ))}
                    </ul>
                    {/* Pagination */}
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        {Array.from({ length: Math.ceil(subscriptions.length / subscriptionsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(subscriptions.length / subscriptionsPerPage)}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SubscriptionList;
