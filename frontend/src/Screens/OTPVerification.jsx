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
    const [canResend, setCanResend] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => {
        // Initialize timeLeft from localStorage if available, or set it to 180 (3 minutes)
        const storedTimeLeft = localStorage.getItem('otpVerificationTimeLeft');
        return storedTimeLeft ? parseInt(storedTimeLeft) : 60;
    });

    const ResendOtpState = useSelector((state) => state.userResendOtp);
    const { loading: resendLoading } = ResendOtpState;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
                // Update localStorage with the new timeLeft value
                localStorage.setItem('otpVerificationTimeLeft', timeLeft - 1);
            } else {
                setCanResend(true); // Allow resending OTP after 3 minutes
                // Clear localStorage when timeLeft reaches 0
                localStorage.removeItem('otpVerificationTimeLeft');
            }
        }, 1000); // Update every second

        return () => clearTimeout(timer); // Cleanup on unmount or re-render
    }, [timeLeft]); // Re-run effect when timeLeft changes

    const handleResendOtp = async () => {
        // Check if resend is allowed
        if (!canResend) {
            return; // Exit early if resend is not allowed
        }
    
        setCanResend(false);
        setTimeLeft(60);
    
        try {
            const user_id = params.userId;
            const otp_id = params.otpId;
    
            if (!user_id || !otp_id) {
                console.error('User ID or OTP ID is null');
                return;
            }
    
            const response = await dispatch(ResendOtp(user_id, otp_id, otp)); 
    
            if (response && response.data && response.data.message) {
                console.log('OTP resent successfully');
            } else {
                setError('Error resending OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            setError('Error resending OTP. Please try again.');
        }
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

    // Format time left into minutes and seconds
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="otp-verification-container">
            <div className="outer-otp-container">
                <h1 className="otp-text">OTP Verification</h1>
                <p className="otp-text" style={{marginLeft:'9rem'}}>Enter OTP</p>
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
                    <br />
                    <button style={{padding:'0.5rem 1.5rem', borderRadius:'0.3rem', marginLeft:'3rem'}} type="submit" disabled={otp.length !== 6}>
                        Submit
                    </button>
                    <button style={{padding:'0.5rem 1.5rem', borderRadius:'0.3rem', marginLeft:'1rem'}} onClick={handleResendOtp} disabled={!canResend || resendLoading}>
                        {canResend ? 'Resend OTP' : `Resend OTP (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default OTPVerification;
