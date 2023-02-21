import React, { useContext } from "react";
import Axios from "axios";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/esm/Card";
import ListGroup from "react-bootstrap/esm/ListGroup";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import ErrrorMsg from "../components/ErrrorMsg";
import { Store } from "../Store";
import Button from "react-bootstrap/esm/Button";

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, Dispatch: ctxDispactch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (prod, quantity) => {
    const datas = await Axios.get(
      `/api/products/${prod._id}`
    );
    if (quantity > datas.data.countInStock) {
      window.alert(quantity - 1 + " Items only left in stock now");
      return;
    }
    ctxDispactch({
      type: "CART_ADD_ITEM",
      payload: { ...prod, quantity },
    });
  };

  const removeCartHandler = (x) => {
    ctxDispactch({
      type: "REMOVE_CART_ITEM",
      payload: x,
    });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div>
      <Helmet>
        <title>shopping cart</title>
      </Helmet>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <ErrrorMsg>
              Your Cart is empty. <Link to="/">Go Shopping</Link>
            </ErrrorMsg>
          ) : (
            <ListGroup>
              {cartItems.map((prod) => (
                <ListGroup.Item key={prod._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <Link to={`/product/${prod._id}`}>
                        <img
                          className="img-thumbnail"
                          src={prod.image}
                          alt={prod.name}
                        />
                      </Link>
                      <Link to={`/product/${prod._id}`}>{prod.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(prod, prod.quantity - 1)
                        }
                        variant="light"
                        disabled={prod.quantity === 1}
                      >
                        <i className="fas fa-minus-circle" />
                      </Button>{" "}
                      {prod.quantity}
                      {"  "}
                      <Button
                        onClick={() =>
                          updateCartHandler(prod, prod.quantity + 1)
                        }
                        variant="light"
                      >
                        <i className="fas fa-plus-circle" />
                      </Button>
                    </Col>
                    <Col md={3}>₹ {prod.discountedPrice}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeCartHandler(prod)}
                        variant="light"
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        {cartItems.length > 0 && (
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                      items ) : ₹
                      {cartItems.reduce((a, c) => a + c.discountedPrice * c.quantity, 0)}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={checkoutHandler}>
                        Proceed to checkout
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CartScreen;
