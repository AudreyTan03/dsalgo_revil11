import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile, resetUpdateProfile } from '../actions/userActions';
import { getMyOrders } from '../actions/orderActions';
import { Button, Form, Table, Row, Col, Pagination } from 'react-bootstrap';
import StudentNav from '../Components/StudentNav';
import { Link, useLocation } from 'react-router-dom';
import './profile.css';

function ProfileScreen() {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [showProfileDetails, setShowProfileDetails] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; // Display only 5 orders per page

    const userDetails = useSelector((state) => state.userDetails);
    const { loading: loadingDetails, error: errorDetails, user } = userDetails;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdateProfile;

    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

    const [updatedName, setUpdatedName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedBio, setUpdatedBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    const location = useLocation();

    useEffect(() => {
        dispatch(getUserDetails());
        setShowProfileDetails(location.pathname === '/profile');
    }, [dispatch, location.pathname]);

    useEffect(() => {
        if (!user || successUpdate) {
            dispatch(resetUpdateProfile());
        } else {
            setUpdatedName(user.name);
            setUpdatedEmail(user.email);
            setUpdatedBio(user.bio || '');
        }
        dispatch(getMyOrders());
    }, [dispatch, user, successUpdate]);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', updatedName);
        formData.append('email', updatedEmail);
        formData.append('bio', updatedBio);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        dispatch(updateUserProfile(formData));
        setIsEditing(false);
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleCloseEditProfile = () => {
        setIsEditing(false);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate current orders based on the current page
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders && orders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div className="container-fluid">
            <StudentNav />
            <Row>
                {/* Sidebar */}
                <Col md={3} className="sidebar">
                    <div className="sidebar-header">
                        {/* <h3>Profile</h3> */}
                    </div>
                    <div className="sbar-menu">
                    <ul>
                        <li>
                            <Link to="/profile">
                                <i className="fa fa-home"></i>
                                <span>‎ ‎ ‎ Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/statistics">
                                <i className="fas fa-chart-bar"></i>
                                <span>‎ ‎ ‎ Statistics</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/productlist">
                                <i className="fa fa-th-list"></i>
                                <span>‎ ‎ ‎ Product List</span>
                            </Link>
                        </li>
                    </ul>
                    </div>
                    {/* Add scroll to sidebar */}
                    <div className="sidebar-content">
                        {/* Content here */}
                    </div>
                </Col>
                {/* Main Content */}
                <Col md={9}>
                    <h2>Profile</h2>
                    {showProfileDetails && (
                        <Row>
                            <Col md={12}>
                                <div className="profile-container">
                                    {user.image && (
                                        <img src={user.image} alt="Profile" className="profile-image" />
                                    )}
                                    <div className="profile-details">
                                        <Form>
                                            <Form.Group controlId="name">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" value={user.name} readOnly />
                                            </Form.Group>
                                            <Form.Group controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" value={user.email} readOnly />
                                            </Form.Group>
                                            <Form.Group controlId="bio">
                                                <Form.Label>Bio</Form.Label>
                                                <Form.Control as="textarea" rows={3} value={user.bio} readOnly />
                                            </Form.Group>
                                        </Form>
                                        <Button variant="primary" onClick={handleEditProfile}>Edit Profile</Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                    <h2>My Orders</h2>
                    {loadingOrders ? (
                        <div>Loading orders...</div>
                    ) : errorOrders ? (
                        <div>Error: {errorOrders}</div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders && currentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt?.substring(0, 10)}</td>
                                        <td>${order.totalPrice}</td>
                                        <td>
                                            {order.isPaid ? (
                                                order.paidAt?.substring(0, 10) || 'N/A'
                                            ) : (
                                                <i className="fas fa-times" style={{ color: "red" }}></i>
                                            )}
                                        </td>
                                        <td>
                                            <h2>Subscribed Videos</h2>
                                            <ul>
                                                {user.subscribedVideos && user.subscribedVideos.map((video) => (
                                                    <li key={video.id}>
                                                        <Link to={`videos/${video.id}`}>{video.title}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    {/* Paginator */}
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            {[...Array(Math.ceil((orders && orders.length || 0) / ordersPerPage)).keys()].map((number) => (
                                <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)}>
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default ProfileScreen;