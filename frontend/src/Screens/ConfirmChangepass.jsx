import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmChangePassword } from '../actions/userActions';
import { useParams } from 'react-router-dom';

const ConfirmChangePass = ({ match }) => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const dispatch = useDispatch();
    const userConfirmChangePassword = useSelector((state) => state.userConfirmChangePassword);
    const { loading, error } = userConfirmChangePassword;
    const { uid, token } = useParams(); // Get uid and token from URL params

    const submitHandler = (e) => {
        e.preventDefault();
        // Dispatch action to confirm change password request
        dispatch(confirmChangePassword(password, password2, uid, token));
    };

    return (
        <div>
            <h2>Confirm Password Change</h2>
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        type="password"
                        id="password2"
                        placeholder="Confirm new password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ConfirmChangePass;
