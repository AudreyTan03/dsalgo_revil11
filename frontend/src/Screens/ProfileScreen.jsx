import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDetails,
  updateUserProfile,
  resetUpdateProfile,
} from '../actions/userActions';
import { getMyOrders } from '../actions/orderActions';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import StudentNav from '../Components/StudentNav';
import { Link } from 'react-router-dom';
import MainDash from '../Components/Dashboard/MainDash';
import Sidebar from '../Components/Sidebar/Sidebar';

function ProfileScreen() {
  const dispatch = useDispatch();
  const [showOrders, setShowOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const userDetails = useSelector((state) => state.userDetails);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch])

  useEffect(() => {
    if (userDetails && userDetails.user) {
      if (userDetails.successUpdate) {
        dispatch(resetUpdateProfile());
      } else {
        setUpdatedName(userDetails.user.name);
        setUpdatedEmail(userDetails.user.email);
        setUpdatedBio(userDetails.user.bio || '');
        setUpdatedMerchantId(userDetails.user.merchant_id || ''); 
      }
    }
    dispatch(getMyOrders());
  }, [dispatch, userDetails]);

  const { loading: loadingDetails, error: errorDetails, user } = userDetails;
  console.log("UserDetails: ", userDetails)
  const isUserInstructor = user?.user_type === 'instructor'; 

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedBio, setUpdatedBio] = useState('');
  const [updatedMerchantId, setUpdatedMerchantId] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const toggleOrdersVisibility = () => {
    setShowOrders(!showOrders);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(); // Construct formData for multipart/form-data submission
    formData.append('name', updatedName);
    formData.append('email', updatedEmail);
    formData.append('bio', updatedBio);
    formData.append('merchant_id', updatedMerchantId)
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    dispatch(updateUserProfile(formData)); // Pass formData directly
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <StudentNav />
      <MainDash />
      <Sidebar />
      <h2>Profile</h2>
      <Form>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={user?.name} readOnly />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={user?.email} readOnly />
        </Form.Group>
        <Form.Group controlId="bio">
          <Form.Label>Bio</Form.Label>
          <Form.Control as="textarea" rows={3} value={user?.bio} readOnly />
        </Form.Group>
        <Button variant="primary" onClick={handleEditProfile}>Edit Profile</Button>
        {isUserInstructor && (
          <Form.Group controlId="merchantId">
            <Form.Label>PayPal Merchant ID </Form.Label>
            <Form.Control type="text" value={user?.merchant_id} readOnly />
          </Form.Group>
        )}
      </Form>
      <Modal show={isEditing} onHide={handleCloseEditProfile}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBio" className="mt-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter new bio"
                value={updatedBio}
                onChange={(e) => setUpdatedBio(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMerchantId" className="mt-3">
            {isUserInstructor && ( 
        <Form.Group controlId="formMerchantId" className="mt-3">
          <Form.Label>Merchant ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter new merchant ID"
            value={updatedMerchantId}
            onChange={(e) => setUpdatedMerchantId(e.target.value)}
          />
        </Form.Group>
               )}
            </Form.Group>
            <Form.Group controlId="formProfilePicture" className="mt-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept=".jpg, .png"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
              {profilePicture && (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile"
                  style={{
                    marginTop: "10px",
                    maxWidth: "100%",
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditProfile}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
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
                    <Link to={`/order/${order._id}`}>Details</Link>
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
