import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Components/FormContainer";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../Components/CheckoutSteps";

function PaymentScreen() {
  const cart = useSelector((state) => state.cart);
//   const { shippingAddress } = cart;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("PayPal");



  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              checked
              value="PayPal"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary">Continue</Button>
        <button onClick={handleGoBack}>Go Back</button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
