import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../actions/adminActions';
import { Link } from 'react-router-dom';
import './userlist.css'; // Make sure to import the styles

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userReducer.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div className="header-item">ID</div>
        <div className="header-item">Name</div>
        <div className="header-item">Status</div>
        <div className="header-item">Admin</div>
        <div className="header-item">Actions</div>
      </div>
      {users && users.map((user) => (
        <div className="user-list-row" key={user.id}>
          <div className="row-item">{user.id}</div>
          <div className="row-item">
            <Link to={`/admin/user-details/${user.id}`} className="user-link">{user.name}</Link>
          </div>
          <div className="row-item">
            <span className={`status-indicator ${user.is_instructor ? 'instructor' : 'student'}`} />
            {user.is_instructor ? 'Instructor' : 'Student'}
          </div>
          <div className="row-item">
            {user.is_admin ? 'Yes' : 'No'}
          </div>
          <div className="row-item action-buttons">
            <Link to={`/admin/edit-user/${user.id}`} className="edit-button">Edit</Link>
            <button onClick={() => handleDelete(user.id)} className="delete-button">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
