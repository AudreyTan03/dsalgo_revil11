import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../actions/adminActions';

const AdminUserDetails = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const selectedUser = useSelector(state => state.userReducer.selectedUser);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log("Fetching user details...");
        dispatch(getUserDetails(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        if (selectedUser && selectedUser.products) {
            setProducts(selectedUser.products);
        }
    }, [selectedUser]);

    return (
        <div>
            <h2>User Details</h2>
            {selectedUser && (
                <div>
                    <p>Name: {selectedUser.name}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>User Type: {selectedUser.is_instructor ? 'Instructor' : 'Student'}</p>
                    <p>Admin: {selectedUser.is_admin ? 'Yes' : 'No'}</p>
                    {products.length > 0 && (
                        <div>
                            <h3>Products Created</h3>
                            <ul>
                                {products.map(product => (
                                    <li key={product._id}>ID:{product._id}   Name:{product.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {products.length === 0 && (
                        <div>
                            <h3>No Products Created</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminUserDetails;
