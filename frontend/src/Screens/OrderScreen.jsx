import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Import useParams
import { getOrderDetails } from '../actions/orderActions';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import { useHistory } from 'react-router-dom'; // Import useHistory

function OrderScreen() {
    const { id } = useParams(); // Destructure id from useParams
    const dispatch = useDispatch();
    // const history = useHistory(); // Initialize useHistory
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails || {}; 

    if (!loading && !error && order) {
        order.itemsPrice = order.orderItems
            .reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    }
    useEffect(() => {
        if (!order || order._id !== Number(id)) {
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id, order]);// Add order to dependency array

    // useEffect(() => {
    //     // Log orderDetails to check if the order object includes the _id field
    //     console.log("Order Details:", orderDetails);
    // }, [orderDetails]);

    return (
        <Row>
            <Col md={8}>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : order ? (
                    <>
                        <h2>Order ID: {order._id}</h2> 
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems && order.orderItems.length === 0 ? (
                                    <Message variant='info'>Your Cart is Empty</Message>
                                ) : (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={item.product}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        {item.name}
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method:</strong> {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt}</Message>
                                ) : (
                                    <Message variant='danger'>Not Paid</Message>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </>
                ) : null} 
            </Col>
            <Col md={4}>
                {order ? (
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                ) : null} 
            </Col>
        </Row>
    );
}

export default OrderScreen;
