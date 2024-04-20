import React, { useState } from 'react';
import './adminpanel.css'; // Import CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faUsers, faShoppingCart, faVideo, faClipboardList } from '@fortawesome/free-solid-svg-icons'; // Import the necessary icons
import UserList from '../Components/UserList';
import ProductList from '../Components/ProductList';
import VideoList from '../Components/VideoList';
import SubscriptionList from '../Components/SubscriptionList';
import Navbar from '../Components/Navbar';
import AdminConcern from './AdminConcern';

const AdminPanel = () => {
  const [selectedList, setSelectedList] = useState('UserList');

  const handleListChange = (listName) => {
    setSelectedList(listName);
  };

  // Render selected list component
  const renderSelectedList = () => {
    switch (selectedList) {
      case 'UserList':
        return <UserList />;
      case 'ProductList':
        return <ProductList />;
      case 'VideoList':
        return <VideoList />;
      case 'SubscriptionList':
        return <SubscriptionList />;
        case 'ConcernList':
        return <AdminConcern />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar /> {/* Navbar outside admin-panel */}
      <div className="admin-panel__container">
        <div className="admin-panel__content">
          <div className="admin-panel__sidebar-container">
            <div className="admin-panel__sidebar">
              <ul>
                <li onClick={() => handleListChange('UserList')}>
                  <FontAwesomeIcon icon={faUsers} /> <span>User List</span>
                </li>
                <li onClick={() => handleListChange('ProductList')}>
                  <FontAwesomeIcon icon={faShoppingCart} /> <span>Product List</span>
                </li>
                <li onClick={() => handleListChange('VideoList')}>
                  <FontAwesomeIcon icon={faVideo} /> <span>Video List</span>
                </li>
                <li onClick={() => handleListChange('SubscriptionList')}>
                  <FontAwesomeIcon icon={faClipboardList} /> <span>Subscription List</span>
                </li>
                <li onClick={() => handleListChange('ConcernList')}>
                  <FontAwesomeIcon icon={faClipboardList} /> <span>Concerns</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="admin-panel__data-box-container">
            <div className="admin-panel__data-box">
              <h1 className="admin-panel__title">Admin Panel</h1> {/* Move h1 to this location */}
              {renderSelectedList()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;