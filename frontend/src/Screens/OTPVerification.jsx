import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { VerifyOtp, ResendOtp } from '../actions/userActions';
import './otpverification.css';

function OTPVerification() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const [canResend, setCanResend] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => {
        const storedTimeLeft = localStorage.getItem('otpVerificationTimeLeft');
        return storedTimeLeft ? parseInt(storedTimeLeft) : 60;
    });

    const ResendOtpState = useSelector((state) => state.userResendOtp);
    const { loading: resendLoading } = ResendOtpState;

    const VerifyOtpState = useSelector((state) => state.userVerifyOtp);
    const { loading: verifyLoading, success, error: verifyError } = VerifyOtpState;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
                localStorage.setItem('otpVerificationTimeLeft', timeLeft - 1);
            } else {
                setCanResend(true);
                localStorage.removeItem('otpVerificationTimeLeft');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (success) {
            console.log('OTP verified successfully');
            navigate('/login');
        } else if (verifyError) {
            setError(verifyError);
        }
    }, [success, verifyError, navigate]);

    const handleResendOtp = async () => {
        if (!canResend) {
            return;
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
            const user_id = params.userId;
            const otp_id = params.otpId;
            
            const response = await dispatch(VerifyOtp(user_id, otp_id, otp)); 
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