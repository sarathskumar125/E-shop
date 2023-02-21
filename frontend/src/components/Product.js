import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Rating from "./Rating";
import { Store } from "../Store";
import Axios from "axios";

const Product = (props) => {
  const { product } = props;

  const { state, Dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const itemExist = await cart.cartItems.find((x) => x._id === product._id);
    const quantity = itemExist ? itemExist.quantity + 1 : 1;
    const data = await Axios.get(
      `/api/products/${product._id}`
    );
    if (data.data.countInStock < quantity) {
      window.alert(
        quantity - 1 + " " + data.data.name + " only left in stock now"
      );
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  var qty= null;
  const item = cart.cartItems.find((x) => x._id === product._id);
  if(item){
    qty = item.quantity
  }

 
  return (
    <Card>
      <Link to={`/product/${product._id}`}>
        <Card.Img variant="top" src={product.image} height="200px"
                width="200px" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
                  {" "}
                  <span>
                    <strong>
                      ₹{product.discountedPrice}
                    </strong>{" "}
                  </span>{" "}
                  <br />{" "}
                  <span
                    style={{ textDecoration: "line-through", color: "grey" }}
                  >
                    ₹{product.price}
                  </span>{" "}
                  {product.discount}
                  <span style={{ color: "red" }}>% off</span>
                </Card.Text>
        { 
          product.countInStock===qty?  <Button disabled variant="light">
          Out of Stock 
        </Button> : <Button variant="primary" onClick={addToCartHandler}>
          Add to cart
        </Button>
        }
       
      </Card.Body>
    </Card>
  );
};

export default Product;
