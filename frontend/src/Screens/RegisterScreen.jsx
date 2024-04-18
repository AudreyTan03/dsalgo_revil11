import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import FormContainer from '../Components/FormContainer';

function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading } = userRegister;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      const response = await dispatch(register(name, email, password, userType, confirmPassword));
      console.log('Register Response:', response);
  
      // Redirect to OTP verification screen
      const { user_id, otp_id } = response; // Ensure that user_id and otp_id are correctly returned from the register action
      navigate(`/verify-otp/user_id/${user_id}/otp/${otp_id}`); // Redirect to OTP verification screen with user_id and otp_id
    } catch (error) {
      console.error('Error during registration:', error.message);
      // Handle other errors, e.g., display a generic error message
    }
  };
  
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="" style={{ maxWidth: '100%', height:'100vh', paddingLeft:'1rem', background:'#ebe8df' }}>  
     <Row>
        <Col className='video' md={6} style={{height:'98vh'}}>
          <video src="/Images/Gifforcode.mp4" autoPlay muted loop></video>
          
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '5px' }}>
            <p style={{ margin: 0 }}>REVIL: Resources for Video Learning</p>
          </div>
        </Col>
        <Col md={6}>
          <Form onSubmit={submitHandler}>
            <br />
          <h1 style={{fontSize:'3rem', marginLeft:'18rem', marginBottom:'-2rem'}}>Register</h1>
            <div className='userInputContainer'>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className='userInputContainer'>
              <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className='userInputContainer'>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className='userInputContainer'>
              <Form.Group controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className='userInputContainer'>
              <Form.Group controlId='userType'>
                <Form.Label>User Type</Form.Label>
                <Form.Control
                  as='select'
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value='student'>Student</option>
                  <option value='instructor'>Instructor</option>
                </Form.Control>
              </Form.Group>
            </div>
            <Button style={{marginLeft:'24rem'}} type='submit' variant='primary'>
              Register
            </Button>
          </Form>
          <Row className='py-3'>
            <Col>
              Already registered? <Link to='/login'>Sign In</Link>
              <Button style={{marginLeft:'2rem', color:'#333333'}} variant='link' onClick={handleGoBack}>
                Go Back
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default RegisterScreen;
