import React, { useContext, useEffect, useReducer } from "react";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Loading from "../components/Loading";
import ErrorMsg from "../components/ErrrorMsg";
import { getError } from "../utils";
import axios from "axios";
import { Store } from "../Store";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/Card";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const [{ loading, error, order, loadingPay, successPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      loadingPay: false,
      successPay: false,
    });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.data.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const data = await axios.put(
          `/api/orders/${order.data._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.data.token}` } }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: getError(error) });
        toast.error(getError(error));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const data = await axios.get(
          `/api/orders/${orderId}`,
          { headers: { authorization: `Bearer ${userInfo.data.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (!userInfo) {
      return navigate("/signin");
    }
    if (
      !order.data ||
      successPay ||
      (order.data._id && order.data._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(
          "/api/keys/paypal",
          {
            headers: {
              authorization: `Bearer ${userInfo.data.token}`,
            },
          }
        );
        paypalDispatch({
          type: "resetOptons",
          value: { "client-id": clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return (
    <div>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <ErrorMsg variant="danger">{error}</ErrorMsg>
      ) : (
        <div>
          <Helmet>
            <title>{orderId}</title>
          </Helmet>
          <h1 className="my-3">ORDER ID : {orderId}</h1>
          <Row>
            <Col md="8">
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Shipping</Card.Title>
                  <Card.Text>
                    <strong>Name : </strong>{" "}
                    {order.data.shippingAddress.fullName} <br />
                    <strong>Address : </strong>{" "}
                    {order.data.shippingAddress.address},{" "}
                    {order.data.shippingAddress.city},{" "}
                    {order.data.shippingAddress.postalCode},{" "}
                    {order.data.shippingAddress.country}
                  </Card.Text>
                  {order.data.isDelivered ? (
                    <ErrorMsg variant="success">
                      Delivered at {order.data.deliveredAt}
                    </ErrorMsg>
                  ) : (
                    <ErrorMsg variant="danger">Not Delivered</ErrorMsg>
                  )}
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Payment</Card.Title>
                  <Card.Text>
                    <strong>Method : </strong> {order.data.paymentMethod}{" "}
                  </Card.Text>
                  {order.data.isPaid ? (
                    <ErrorMsg variant="success">
                      Paid at : {order.data.paidAt}
                    </ErrorMsg>
                  ) : (
                    <ErrorMsg variant="danger">Not Paid</ErrorMsg>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Items</Card.Title>
                  <ListGroup variant="flush">
                    {order.data.orderItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                          <Col md="6">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid rounded img-thumbnail"
                            />
                            <Link to={`/product/${item._id}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md="3">
                            <span>{item.quantity}</span>
                          </Col>
                          <Col md="3">$ {item.price * item.quantity}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Order summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>$ {order.data.itemsPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>$ {order.data.shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Order Total </strong>
                        </Col>
                        <Col>
                          $ <strong>{order.data.totalPrice.toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {!order.data.isPaid && order.data.paymentMethod==="paypal" && (
                      <ListGroup.Item>
                        {isPending ? (
                          <Loading />
                        ) : (
                          <div>
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            ></PayPalButtons>
                          </div>
                        )}
                        {loadingPay && <loading />}
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

export default OrderScreen;
