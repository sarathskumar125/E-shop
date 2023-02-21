import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import Table from "react-bootstrap/Table";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Loading from "../components/Loading";
import Moment from 'react-moment';

const PostsUserAdmin = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const ID = userInfo.data._id;
  const [loading, setLoading] = useState(false);
  const [myProducts, setMyproducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const posts = await axios.get(`/api/products/useradminproducts/${ID}`, {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        });
        setLoading(false);
        setMyproducts(posts.data);
      } catch (error) {
        toast.error.apply(getError(error));
        setLoading(false);
      }
    };
    fetchData();
  }, [userInfo, ID]);
  return (
    <div style={{ display: "flex" }}>
      <Helmet>
        <title>My Products</title>
      </Helmet>
      <Container>
        {loading && (
          <div className="text-center">
            <Loading />{" "}
          </div>
        )}
        {myProducts.length !== 0 && (
           <div>
          <div>
          <h1 className="text-center my-3">My Products</h1>
        </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Posted date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product, index) => (
                  <>
                    <tr>
                      <td style={{ textAlign: "left" }}>
                        <img
                          src={product.image}
                          height={60}
                          width={60}
                          alt=""
                          className="mx-2"
                        />
                        {product.name}
                      </td>
                      <td><Moment>{product.updatedAt}</Moment></td>
                      <td>{product.status === "approved" ? (<>under verification</>) : product.status}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>
        ) }
      </Container>
    </div>
  );
};

export default PostsUserAdmin;
