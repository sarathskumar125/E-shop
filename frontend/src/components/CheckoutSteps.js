import React from 'react'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

const CheckoutSteps = (props) => {
  return (
    <Container>
    <Row className='checkout-steps'>
        <Col className={props.step1? 'active' : ''}>Sign in</Col>
        <Col className={props.step2? 'active' : ''}>Shipping</Col>
        <Col className={props.step3? 'active' : ''}>Payment</Col>
        <Col className={props.step4? 'active' : ''}>Place Order</Col>
    </Row>
    </Container>
  )
}

export default CheckoutSteps