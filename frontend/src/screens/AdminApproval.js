import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Store } from "../Store";
import { getError } from "../utils";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const AdminApproval = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [approvalList, setApprovalList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        setLoading(true);
        const List = await axios.get("/api/products/adminapproval", {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        });
        setLoading(false);
        setApprovalList(List.data);
      } catch (error) {
        toast.error(getError(error));
        setLoading(false);
      }
    };
    fetchPendingApprovals();
  }, [userInfo]);

  const approveHandler = async(id) => {
    try {
      setLoading(true);
       await axios.post(
        "/api/products/approve",
        { ID: id },
        {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        }
      )
      setLoading(false)
      const newList = approvalList.filter((x)=>x._id!==id)
      setApprovalList(newList)
    } catch (error) {
      toast.error(getError(error));
      setLoading(false);
    }
  };
  const rejectHandler = async(id) => {
    try {
      setLoading(true);
       await axios.post(
        "/api/products/reject",
        { ID: id },
        {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        }
      )
      setLoading(false)
      const newList = approvalList.filter((x)=>x._id!==id)
      setApprovalList(newList)
    } catch (error) {
      toast.error(getError(error));
      setLoading(false);
    }
  };

  return (
    <div className="products">
      <Helmet>
        <title>Pending Approvals</title>
      </Helmet>
      {loading && (
        <div className="text-center">
          <Loading />{" "}
        </div>
      )}
      {approvalList.length !== 0 &&
        approvalList.map((products, index) => (
          <div key={index}>
            <Card style={{ width: "18rem", margin: "10px" }}>
              <Card.Img
                variant="top"
                src={products.image}
                height="200px"
                width="200px"
              />
              <Card.Body>
                <Card.Title>{products.name}</Card.Title>
                <Card.Text>
                  {" "}
                  <span>
                    <strong>
                      ₹
                      {products.discount !== 0
                        ? (products.price -
                          (products.price * products.discount) / 100).toFixed(2)
                        : products.price}
                    </strong>{" "}
                  </span>{" "}
                  <br />{" "}
                  <span
                    style={{ textDecoration: "line-through", color: "grey" }}
                  >
                    ₹{products.price}
                  </span>{" "}
                  {products.discount}
                  <span style={{ color: "red" }}>% off</span>
                </Card.Text>
                <Card.Text>
                  <strong>Brand:</strong> {products.brand}
                  <br />
                  <strong>category: </strong>
                  {products.category}
                </Card.Text>
                <div className="d-flex justify-content-between m-2">
                  <Button
                    variant="primary"
                    onClick={(e) => approveHandler(products._id)}
                  >
                    Approve
                  </Button>
                  <Button variant="primary"
                  onClick={(e) => rejectHandler(products._id)}
                  >Reject</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
    </div>
  );
};

export default AdminApproval;
