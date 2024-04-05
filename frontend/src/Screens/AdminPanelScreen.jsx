import React from 'react';
import UserList from '../Components/UserList';
import ProductList from '../Components/ProductList';
import VideoList from '../Components/VideoList';
import Navbar from '../Components/Navbar'
import SubscriptionList from '../Components/SubscriptionList';


const AdminPanel = () => {
  return (
    <div>
      < Navbar />
      <h1>Admin Panel</h1>
      <UserList />
      <ProductList />
      <VideoList />
      <SubscriptionList />
    </div>
  );
};

export default AdminPanel;
