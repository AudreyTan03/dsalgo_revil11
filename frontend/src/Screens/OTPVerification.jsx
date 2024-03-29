import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Import useLocation
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { VerifyOtp, ResendOtp } from '../actions/userActions';
import './otpverification.css';

function OTPVerification() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const location = useLocation(); // Use useLocation hook
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const [canResend, setCanResend] = useState(true);

    const ResendOtpState = useSelector((state) => state.userResendOtp);
    const { loading: resendLoading } = ResendOtpState;

    useEffect(() => {
        const timer = setTimeout(() => {
            setCanResend(true); // Allow resending OTP after 300 seconds
        }, 300000); // 300 seconds = 300000 milliseconds

        return () => clearTimeout(timer); // Cleanup on unmount or re-render
    }, [canResend]); // Re-run effect when canResend changes

    const handleResendOtp = () => {
        // Check if resend is allowed
        if (!canResend) {
            return; // Exit early if resend is not allowed
        }
    
        const queryParams = new URLSearchParams(location.search);
        const user_id = queryParams.get('user_id');
        const otp_id = queryParams.get('otp_id');
        dispatch(ResendOtp(user_id, otp_id))
            .then((response) => {
                if (response.success) {
                    console.log('OTP resent successfully');
                    // Do not disable the resend button after successful resend
                } else {
                    setError(response.error);
                }
            })
            .catch((error) => {
                console.error('Error resending OTP:', error);
                setError('Error resending OTP. Please try again.');
            });
        // Do not disable the resend button immediately after clicking
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Extract user_id and otp_id from URL parameters
            const user_id = params.userId;
            const otp_id = params.otpId;
            
            // Dispatch OTP verification action
            const response = await dispatch(VerifyOtp(user_id, otp_id, otp)); 
            
            // Check if OTP verification was successful
            if (response.success) {
                console.log('OTP verified successfully'); // Log success message
                // Redirect to login page upon successful verification
                navigate('/login');
            } else {
                // Handle unsuccessful verification
                setError("OTP verification failed"); // Assuming your response contains an error message
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    

    const handleChange = (value, index) => {
        if (value === '') {
            setOtp(prevOtp => prevOtp.slice(0, -1));
            if (index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
            }
        } else {
            setOtp((prevOtp) => {
                const updatedOtp = prevOtp.substring(0, index) + value + prevOtp.substring(index + 1);
                if (value && index < 5) {
                    inputRefs.current[index + 1].focus();
                }
                return updatedOtp;
            });
        }
    };

    return (
        <div className="otp-verification-container">
            <div className="outer-otp-container">
                <h1 className="otp-text">OTP Verification</h1>
                <p className="otp-text">Enter OTP</p>
                <form onSubmit={handleSubmit}>
                    <div className="otp-container">
                        {[...Array(6)].map((_, index) => (
                            <input
                                key={index}
                                type="number"
                                value={otp[index] || ''}
                                onChange={(e) => handleChange(e.target.value, index)}
                                maxLength="1"
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="otp-input"
                            />
                        ))}
                    </div>
                    <button type="submit" disabled={otp.length !== 6}>
                        Submit
                    </button>
                    <button onClick={handleResendOtp} disabled={!canResend || resendLoading}>
                    {canResend ? 'Resend OTP' : 'Please wait...'}
                </button>
                </form>
            </div>
        </div>
    );
}

export default OTPVerification;
