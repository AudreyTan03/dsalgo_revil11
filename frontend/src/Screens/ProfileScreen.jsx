import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile, resetUpdateProfile } from '../actions/userActions';
import StudentNav from '../Components/StudentNav';

function ProfileScreen() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const userProfileUpdate = useSelector((state) => state.userUpdateProfile);
    const { loading, error, user } = userDetails;
    const { loading: updateLoading, success: updateSuccess, error: updateError } = userProfileUpdate;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [fileName, setFileName] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        dispatch(getUserDetails());
    }, [dispatch]);

    useEffect(() => {
        if (updateSuccess) {
            dispatch(resetUpdateProfile());
            dispatch(getUserDetails());
            setEditMode(false);
            // Update userInfo in localStorage after successful update
            const userInfoString = localStorage.getItem('userInfo');
            if (userInfoString) {
                const userInfo = JSON.parse(userInfoString);
                userInfo.token.name = name;
                userInfo.token.email = email;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
        }
    }, [updateSuccess, dispatch, name, email]);

    useEffect(() => {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            setName(userInfo.token.name);
            setEmail(userInfo.token.email);
        }
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setProfilePicture(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setProfilePicture(null);
            setFileName('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = {
            name,
            email,
        };
        await dispatch(updateUserProfile(updatedUser, profilePicture));
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <div className="dashboard-container">
            <StudentNav />
            <div className="dashboard-content">
                <div className="profile-container">
                    <h2>Profile</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <div className="profile-details">
                            {editMode ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profilePicture">Profile Picture:</label>
                                        <input
                                            type="file"
                                            id="profilePicture"
                                            onChange={handleFileChange}
                                        />
                                        {fileName && <p>Selected file: {fileName}</p>}
                                    </div>
                                    <button type="submit" disabled={updateLoading}>
                                        {updateLoading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                    {updateError && <p>Error: {updateError}</p>}
                                </form>
                            ) : (
                                <>
                                    <div className="details-group">
                                        <p><strong>Name:</strong> {name}</p>
                                        <p><strong>Email:</strong> {email}</p>
                                    </div>
                                </>
                            )}
                            <button onClick={toggleEditMode}>
                                {editMode ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileScreen;
