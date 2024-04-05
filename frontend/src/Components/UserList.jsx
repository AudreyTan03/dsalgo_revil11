import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../actions/adminActions';
import { Link } from 'react-router-dom'; // Import Link from React Router

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.userReducer.users);

  useEffect(() => {
    console.log("Fetching users...");
    dispatch(getUsers());
  }, [dispatch]);

  console.log("Users in component:", users);

  const handleDelete = userId => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users && users.map(user => (
          <li key={user.id}>
            <span> ID: {user.id} - </span>
            <span> Name: <Link to={`/admin/user-details/${user.id}`} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>{user.name}</Link></span>
            <Link to={`/admin/edit-user/${user.id}/`} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>Edit</Link>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
