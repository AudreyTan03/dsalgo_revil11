import React, { useEffect } from 'react';
import { Row, Col, Button, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Message from '../Components/Message';
import { createOrder } from '../actions/orderActions'; // Import createOrder action

function PlaceOrderScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    
    // Assuming your Redux state structure includes orderCreate which has success and order properties
    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, error, success } = orderCreate; // Extract success and order state

    // Calculate total price
    const totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`); // Ensure order._id is used to navigate
        }
        if (!cart.paymentMethod) {
            navigate("/payment");
        }
    }, [success, navigate]);
    

    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            paymentMethod: cart.paymentMethod,
            itemsPrice: totalPrice,
            totalPrice: totalPrice
        }));
    }

    return (
        <Row>
            <Col md={8}>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                        <strong>Method:</strong> {cart.paymentMethod}
                    </p>
                </ListGroup.Item>
                <h2>Order Items</h2>
                {cart.cartItems.length === 0 ? (
                    <Message variant='info'>Your Cart is Empty</Message>
                ) : (
                    <ListGroup variant='flush'>
                        {cart.cartItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Item:</Col>
                                <Col>${totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {error && <Message variant="danger">{error}</Message>}
                         </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cart.cartItems.length === 0}
                                onClick={placeOrder}
                            >
                                Place Order
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
}

export default PlaceOrderScreen;