import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../actions/adminActions';
import { Link } from 'react-router-dom';
import './userlist.css'; // Make sure to import the styles

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userReducer.users);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Number of users to display per page

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users && users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

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
      {currentUsers && currentUsers.map((user) => (
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
      {/* Pagination */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        {[...Array(Math.ceil((users && users.length || 0) / usersPerPage)).keys()].map((number) => (
          <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>{number + 1}</button>
        ))}
        <button onClick={nextPage} disabled={currentPage === Math.ceil((users && users.length || 0) / usersPerPage)}>Next</button>
      </div>
    </div>
  );
};

export default UserList;
