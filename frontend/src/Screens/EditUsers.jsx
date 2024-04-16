import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../actions/adminActions';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams from React Router

const EditUser = () => {
  const { userId } = useParams();
  console.log("userId:", userId); // Log userId to verify if it's being extracted correctly
  // Get the userId from the URL parameter
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Get the navigate function from useNavigate
  const selectedUser = useSelector(state => state.userReducer.users.find(user => user.id === Number(userId)));
  const [editedUserData, setEditedUserData] = useState({
    name: '',
    email: '',
    user_type: ''
  });

  useEffect(() => {
    // Populate the form fields with the selected user's data when it changes
    if (selectedUser) {
      setEditedUserData({
        name: selectedUser.name,
        email: selectedUser.email,
        user_type: selectedUser.user_type
      });
    }
    console.log("Selected user:", selectedUser); // Log the selected user to the console
  }, [selectedUser]);

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (selectedUser) {
      await dispatch(editUser(selectedUser._id, editedUserData));
      // Redirect back to admin panel after editing
      navigate('/admin');
    }
  };

  return (
    <div>
      <h2>Edit User: {selectedUser ? selectedUser.name : ''}</h2> {/* Display the name of the selected user in the header */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedUserData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedUserData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="user_type">User Type:</label>
          <select
            id="user_type"
            name="user_type"
            value={editedUserData.user_type}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditUser;
