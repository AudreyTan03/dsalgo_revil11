import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfileWithProducts } from '../actions/userActions';

const ProfileWithProductScreen = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const userProfileWithProducts = useSelector((state) => state.userProfileWithProducts);
  const { profile, products, loading, error } = userProfileWithProducts; // Changed 'user' to 'profile'

  useEffect(() => {
    dispatch(fetchUserProfileWithProducts(userId));
  }, [dispatch, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {profile ? (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {profile.bio !== null && <p>Bio: {profile.bio}</p>}
        </>
      ) : (
        <p>No user information available</p>
      )}
      
      <h2>Products</h2>
      {products && products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>No products found</div>
      )}
    </div>
  );
};

export default ProfileWithProductScreen;
