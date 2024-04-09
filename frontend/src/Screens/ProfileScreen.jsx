import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDetails,
  updateUserProfile,
  resetUpdateProfile,
} from '../actions/userActions';
import { getMyOrders } from '../actions/orderActions';
import { Button, Form, Table } from 'react-bootstrap';
import StudentNav from '../Components/StudentNav';

function ProfileScreen() {
  const dispatch = useDispatch();
  const [showOrders, setShowOrders] = useState(false);
  const userDetails = useSelector((state) => state.userDetails);
  const { loading: loadingDetails, error: errorDetails, user } = userDetails;
  console.log(user.name)

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState(''); // Add state for bio
  const [profilePicture, setProfilePicture] = useState(null);

  const toggleOrdersVisibility = () => {
    setShowOrders(!showOrders);
  };

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch])
  
  // useEffect(() => {
  //   if (!user || successUpdate) {
  //     dispatch(resetUpdateProfile());
  //   } else {
  //     setName(user.name);
  //     setEmail(user.email);
  //     setBio(user.bio || ''); // Set bio if available
  //   }
  //   dispatch(getMyOrders());
  // }, [dispatch, user, successUpdate]);
  // console.log(user.name)

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(); // Construct formData for multipart/form-data submission
    formData.append('name', name);
    formData.append('email', email);
    formData.append('bio', bio);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    dispatch(updateUserProfile(formData)); // Pass formData directly
  };

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value); // Handler for bio

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <div>
      <StudentNav />
      <h2>Profile</h2>
      <Form onSubmit={handleProfileUpdate}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={user.name} onChange={handleNameChange} />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={user.email} onChange={handleEmailChange} />
        </Form.Group>
        <Form.Group controlId="bio">
          <Form.Label>Bio</Form.Label>
          <Form.Control as="textarea" rows={3} value={user.bio} onChange={handleBioChange} />
        </Form.Group>
        <Form.Group controlId="profilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control type="file" onChange={handleProfilePictureChange} />
        </Form.Group>
        <Button type="submit" variant="primary">Update Profile</Button>
      </Form>
      {loadingUpdate && <div>Updating...</div>}
      {errorUpdate && <div>Error: {errorUpdate}</div>}
      <Button variant="secondary" onClick={toggleOrdersVisibility} className="my-3">
        {showOrders ? 'Hide OrdersHistory' : 'Show OrderHistory'}
      </Button>
      {showOrders && (
        <>
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
                {orders && orders.map((order) => (
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
                      <Button variant="light" size="sm">Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}

export default ProfileScreen;