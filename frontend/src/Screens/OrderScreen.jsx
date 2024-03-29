import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function OrderScreen() {
    const { id } = useParams(); // Destructured id directly from useParams
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, error, loading } = orderDetails;
  
    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay, error: errorPay } = orderPay;
    const [sdkReady, setSdkReady] = useState(false);
  
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
  
    useEffect(() => {
      if (!userInfo) {
        navigate('/login');
      }
  
      const addPayPalScript = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = 'https://www.paypal.com/sdk/js?client-id=ATY-gvH08O0BrR_L-x9TNYZkFlF4qotHn0aywauJVBnAvvDEdZuCfC_1NGdNK0-oOUdNI0G7_zpqdRnS&currency=USD';
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
  
      if (!order || successPay || order._id !== Number(id)) {
        dispatch({ type: ORDER_PAY_RESET });
        dispatch(getOrderDetails(id));
      } else if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }, [dispatch, id, order, successPay, userInfo, navigate]);
  
    const successPaymentHandler = (paymentResult) => {
      dispatch(payOrder(id, paymentResult));
    };

  const createOrderHandler = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: { value: order.totalPrice, currency_code: "USD" },
      }],
    });
  };

  const onApproveHandler = (data, actions) => {
    return actions.order.capture().then(details => {
      successPaymentHandler({ id: details.id, status: details.status, update_time: details.update_time });
    });
  };

  useEffect(() => {
    if (errorPay) {
      console.error("Payment error:", errorPay);
    }
  }, [errorPay]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <h2>Order: {order._id}</h2>
          <Row>
            <Col md={8}>
              {order.isDelivered ? (
                <Message variant="success">Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p><strong>Method: </strong>{order.paymentMethod}</p>
                  {order.isPaid ? (
                    <Message variant="success">Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message variant="info">Your Cart is Empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={item.product}>
                          <Row>
                            <Col md={1}>
                              <Image src={item.image} alt={item.name} fluid rounded />
                            </Col>
                            <Col>
                              <Link to={`/products/${item.product}`}>{item.name}</Link>
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
              </ListGroup>
            </Col>

            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items:</Col>
                      <Col>${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalScriptProvider options={{
                          "client-id": "ATY-gvH08O0BrR_L-x9TNYZkFlF4qotHn0aywauJVBnAvvDEdZuCfC_1NGdNK0-oOUdNI0G7_zpqdRnS",
                        }}>
                          <PayPalButtons
                            createOrder={createOrderHandler}
                            onApprove={onApproveHandler}
                            style={{ layout: "vertical" }}
                          />
                        </PayPalScriptProvider>
                      )}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default OrderScreen;
