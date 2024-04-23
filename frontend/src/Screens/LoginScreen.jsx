import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import { login } from '../actions/userActions';
import FormContainer from '../Components/FormContainer';
import './register.css';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, userInfo } = userLogin;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    const handleRequestPasswordChange = () => {
        navigate('/request-changepass');
    }

    useEffect(() => {
        if (userInfo) {
            const { user_type } = userInfo;
            if (user_type === 'instructor') {
                navigate('/homeScreen');
            } else {
                navigate('/studenthomescreen');
            }
        }
    }, [navigate, userInfo]);

    const goBack = () => {
        window.location.href = '/';
    }

    return (
        <div className="" style={{ maxWidth: '100%', height:'100vh', paddingLeft:'1rem', background:'#ebe8df' }}>
            <Row>
                <Col className='video' style={{height:'98vh'}} md={6}>
                    <img src="https://scontent.fmnl4-2.fna.fbcdn.net/v/t1.15752-9/434992543_725123242862767_1805747067975356669_n.png?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGELjweWxygTLx1gI0s_g3RE1vnJ3SpqewTW-cndKmp7HWNLUP64Lu7aq6MIWbZm3SVAVWwyDlT0_YpxEQYJ7MC&_nc_ohc=fFGF2l0aw98Ab6sfUqu&_nc_ht=scontent.fmnl4-2.fna&oh=03_Q7cD1QEjfABzwVqT7RP4U_JpyzSImxcAV1z56oMwzAA_tleUAg&oe=664EFB04" autoPlay muted loop></img>
                </Col>
                <Col md={6} style={{ paddingTop: '20px' }}>
                    <div>
                        <h1 style={{fontSize:'3rem', marginLeft:'18rem', marginBottom:'-2rem'}}>Sign In</h1>
                        <h4 style={{marginLeft:'17.7rem', marginTop:'2rem'}} className=''>WELCOME BACK!</h4>
                        {error && <Message variant='danger'>{error}</Message>}
                        {loading && <Loader />}
                        <Form onSubmit={submitHandler}>
                            <div className='userInputContainer'>
                                <Form.Group controlId='email'>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type='text'
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

                            <Button style={{ marginLeft: '24rem' }} variant='primary' type='submit'>
                             Sign In
                            </Button>

                        </Form>
                        <Row className='py-3'>
                            <Col style={{marginLeft:'10rem'}}>
                                {/* <Button style={{marginLeft:'2rem', color:'#333333'}} variant='link' to='/register'>Register</Button>  */}
                                <Button style={{marginLeft:'2rem', color:'#333333'}} variant='link' onClick={handleRequestPasswordChange}>
                                    Forgot password?
                                </Button>
                        <Button style={{marginLeft:'2rem', color:'#333333'}} variant='link' onClick={goBack}>
                            Go Back
                        </Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default LoginScreen;
