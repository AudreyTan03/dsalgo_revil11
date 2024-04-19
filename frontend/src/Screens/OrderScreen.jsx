import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { subscribeToVideo } from "../actions/videoActions";

function OrderScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay;
  const [sdkReady, setSdkReady] = useState(false);

  const subscribeToVideoAction = useDispatch();

  useEffect(() => {
    if (!order || successPay || order._id !== Number(id)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, order, successPay]);

  useEffect(() => {
    const addPayPalScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AaFwY5HmruAjblux5Tv2vQ_WvF--dtwwtz_J6evrVwXs60KUK1HLwcSSwp6hyp9zzaikBeJw_iP9HwZf&currency=USD";
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    addPayPalScript();

    return () => {
      // Clean up function to remove the PayPal script from the DOM
      document.body.removeChild(document.body.lastChild);
    };
  }, []);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(id, paymentResult));
  }

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
      reference_id: item.merchant_id,
      payee: {
        merchant_id: item.merchant_id
      },
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
  
  const onApproveHandler = (data, actions) => {
    return actions.order.capture().then(function (details) {
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
                              "AaFwY5HmruAjblux5Tv2vQ_WvF--dtwwtz_J6evrVwXs60KUK1HLwcSSwp6hyp9zzaikBeJw_iP9HwZf",
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
