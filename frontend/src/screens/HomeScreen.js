import React, { useEffect, useReducer } from "react";
import Axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import Loading from "../components/Loading";
import ErrrorMsg from "../components/ErrrorMsg";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {

  const [{ loading, error, products }, dispatch] = useReducer((reducer), {
    products: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const Datas = await Axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: Datas.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div >
        {loading ? (
          <div className="loading-center">
            <Loading />
          </div>
        ) : error ? (
          <div>
            <ErrrorMsg variant="danger">{error}</ErrrorMsg>
          </div>
        ) : (
          <Row className="products" >
            {products.map((product) => (
              <Col key={product._id} sm={6} md={4} lg={3} className="m-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
