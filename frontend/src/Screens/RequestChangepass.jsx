import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestResetPassword } from '../actions/userActions';

const RequestChangepass = () => {
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error } = userLogin;

    const submitHandler = (e) => {
        e.preventDefault();
        // If email is not valid, do not proceed
        if (!validEmail) {
            console.log('Invalid email');
            return;
        }
        // Dispatch action to send change password request
        dispatch(requestResetPassword(email));
    };

    // Function to validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Function to check if email is associated with an active account (dummy implementation)
    const checkEmailValidity = () => {
        // Make a call to your backend to verify email validity
        // For demonstration purposes, assume it's valid
        setValidEmail(true);
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        if (validateEmail(value)) {
            checkEmailValidity(); // Check email validity when it's valid
        } else {
            setValidEmail(false); // Reset validity if email format is invalid
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {!validEmail && email && <p>Email is not valid or associated with an active account</p>}
                </div>
                {validEmail && <button type="submit">Submit</button>}
            </form>
        </div>
    );
};

export default RequestChangepass;
