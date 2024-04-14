import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { subscribeToVideo } from "../actions/videoActions"; // Import subscribeToVideo action creator
// import { useNavigate } from 'react-router-dom';

function OrderScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay;
  const [sdkReady, setSdkReady] = useState(false);

  // Subscribe to video action
  const subscribeToVideoAction = useDispatch();

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
    } else if (successPay) {
      // If payment is successful, trigger the subscription
      const { orderItems } = order;
      orderItems.forEach((item) => {
        dispatch(subscribeToVideo(item.product, item.video)); // Dispatch subscription action
      });
  
      // Get the videoId from orderItems or any other source
      const videoId = orderItems[0].video; // Assuming the first item has the videoId
  
      // Navigate to the VideoDetailScreen after successful subscription
      navigate(`/videos/${videoId}`);
    }
  }, [dispatch, id, order, successPay, navigate]);
  

  // Add PayPal script
  const addPayPalScript = () => {
    console.log("addPaypalMerchant ID:", order.orderItems.map(item => item.merchant_id)); // Log merchant ID

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AXVOOQasJ5vIYjiFPHmtCI2wrNJDXmOchM8SoFSBxHL61x8uNR0RIM1iCLjSesNPRuA_fhOzS240gQyn&currency=USD";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  // Handle payment success
  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(id, paymentResult));
  }

  // Create PayPal order
  const createOrderHandler = (data, actions) => {
    const purchaseUnits = order.orderItems.map(item => ({
      amount: {
        currency_code: "USD",
        value: Number((Number(item.price) + Number(item.taxPrice)).toFixed(2)),
        breakdown: {
          item_total: {
            currency_code: "USD",
            value: Number((Number(item.price) * item.qty).toFixed(2))
          },
          tax_total: {
            currency_code: "USD",
            value: Number(item.taxPrice).toFixed(2)
          }
        }
      },
      description: item.name,
      items: [{
        name: item.name,
        quantity: item.qty,
        unit_amount: {
          currency_code: "USD",
          value: Number(item.price).toFixed(2)
        },
      }]
    }));
  
    return actions.order.create({
      purchase_units: purchaseUnits
    });
  };
  
  

  // Handle approval
  const onApproveHandler = (data, actions) => {
    return actions.order.capture().then(function (details) {
      successPaymentHandler({ id: details.id, status: details.status, update_time: details.update_time });
    });
  };

  // Log any errors during payment
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
                  {order.orderItems.length === 0 ? (
                    <Message variant="info">Your Cart is Empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
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
                              {item.qty} X ${item.price} = $
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
                      <Col>Item:</Col>
                      <Col>${order.itemsPrice}</Col>
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
                        <PayPalScriptProvider
                          options={{
                            "client-id":
                              "AXVOOQasJ5vIYjiFPHmtCI2wrNJDXmOchM8SoFSBxHL61x8uNR0RIM1iCLjSesNPRuA_fhOzS240gQyn",
                          }}
                        >
                          <PayPalButtons
                            createOrder={createOrderHandler}
                            onApprove={onApproveHandler}
                            style={{ layout: "vertical" }}
                            onSuccess={successPaymentHandler}
                            
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
