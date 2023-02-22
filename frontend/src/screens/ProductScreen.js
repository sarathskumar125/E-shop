import Axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import { useParams } from "react-router-dom";
import Rating from "../components/Rating";
import Badge from "react-bootstrap/Badge";
import { Helmet } from "react-helmet-async";
import Loading from "../components/Loading";
import ErrrorMsg from "../components/ErrrorMsg";
import { getError } from "../utils";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const params = useParams();
  const { id } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });

  // const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const Datas = await Axios.get(
          `/api/products/id/${id}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: Datas.data });
        //setProduct(Datas.data);
        //  console.log(Datas.data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [id]);
  //console.log(product.name);

  const { state, Dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const itemExist = await cart.cartItems.find((x) => x._id === product._id);
    const quantity = itemExist ? itemExist.quantity + 1 : 1;
    const data = await Axios.get(
      `/api/products/${product._id}`
    );
    if (data.data.countInStock < quantity) {
      window.alert((quantity-1)+" "+data.data.name+" only left in stock now")
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };
  return (
    <div>
      {loading ? (
        <div className="loading-center">
          <Loading />
        </div>
      ) : error ? (
        <div>
          <ErrrorMsg variant="danger">{error}</ErrrorMsg>
        </div>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <img
                className="img-large"
                src={product.image}
                alt={product.name}
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Helmet>
                    <title>{product.name}</title>
                  </Helmet>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>
                    <strong>Price: ₹{product.discountedPrice}</strong>
                  </span>
                  <br />
                  <span
                    style={{ textDecoration: "line-through", color: "grey" }}
                  >
                    ₹{product.price}    
                  </span>{" "}
                  {product.discount}
                  <span style={{ color: "red" }}>% off</span>
                  <br />
                  <span style={{color:"grey"}}>GST calculated at checkout</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span><strong style={{color:"red"}}>Brand : {product.brand}</strong></span>
                </ListGroup.Item>
                <ListGroup.Item>
                  Description:
                  <p>{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>₹{product.discountedPrice}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0 ? (
                            <Badge bg="danger">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Out of Stock</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {product.countInStock > 0 && ( 
                      <ListGroup.Item>
                        <div className="d-grid" >
                          <Button onClick={addToCartHandler}
                          >
                            {" "}
                            Add to Cart
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
