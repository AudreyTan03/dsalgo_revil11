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
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  console.log("Order details:", orderDetails); // Added console log

  let updatedOrder = { ...order };
  if (!loading && !error) {
    const itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);

    updatedOrder = {
      ...updatedOrder,
      itemsPrice: itemsPrice,
    };
  }

  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    success: successPay,
    error: errorPay,
  } = orderPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
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
  }, [dispatch, id, order, successPay]);

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AUJayLpkW1gf5gQQWX0Tx3lVJ56yZUwPeAfvVaPVdhSEVrRumfzKZr63RwjMlsEYf9CRKAwUYljQuI0V&currency=USD';
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(id, paymentResult));
  };

  const createOrderHandler = (data, actions) => {
    // Determine the merchant ID based on the seller or product information
    // let merchantId;
    // // Example logic: Check if order is associated with a specific product or seller
    // if (order.orderItems.some(item => item.seller === "Seller1")) {
    //   merchantId = "LWRK94XM8SUWW"; // Merchant ID for Seller 1
    // } else {
    //   merchantId = "9LCPYCRMQEW7A"; // Merchant ID for Seller 2
    // }
    
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.totalPrice,
            currency_code: "USD",
          },
          // payee: {
          //   merchant_id: 'LWRK94XM8SUWW'
          // },
        },
      ],
    });
  };

  const onApproveHandler = (data, actions) => {
    return actions.order.capture().then((details) => {
      successPaymentHandler({
        id: details.id,
        status: details.status,
        update_time: details.update_time,
      });
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
      ) : order ? (
        <div>
          <h2>Order: {order._id}</h2>
          <Row>
            <Col md={8}>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant="success">Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems && order.orderItems.length === 0 ? (
                    <Message variant="info">Your Cart is Empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item) => (
                        <ListGroup.Item key={item.product}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/products/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x ${item.price} = $
                              {(item.qty * item.price).toFixed(2)}
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
                      <Col>
                        $
                        {typeof order.totalPrice === "number"
                          ? order.totalPrice.toFixed(2)
                          : "0.00"}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col>
                        $
                        {typeof order.totalPrice === "number"
                          ? order.totalPrice.toFixed(2)
                          : "0.00"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {sdkReady && (
                        <PayPalScriptProvider
                          options={{
                            "client-id":
                              "AUJayLpkW1gf5gQQWX0Tx3lVJ56yZUwPeAfvVaPVdhSEVrRumfzKZr63RwjMlsEYf9CRKAwUYljQuI0V",
                          }}
                        >
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
      ) : (
        <Message variant="info">Loading...</Message>
      )}
    </>
  );
}

export default OrderScreen;