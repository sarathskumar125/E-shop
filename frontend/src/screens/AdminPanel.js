import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import ErrrorMsg from "../components/ErrrorMsg";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Store } from "../Store";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [adminlist, setAdminlist] = useState();

  const createAdmin = () => {
    navigate("/superadmin/createadmin");
  };

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const List = await axios.get("/api/users/adminpanel", {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        });
        setAdminlist(List.data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchAdminUsers();
  }, [setAdminlist, userInfo.data.token]);

  return (
    <div>
      <Helmet>
        <title>Admin Panel</title>
      </Helmet>
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "1rem" }}
      >
        <Button onClick={createAdmin}>Create new Admin</Button>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
      >
        <h1>Admin panel</h1>
      </div>

      {adminlist ? (
        <>
          {" "}
          {adminlist.map((user, index) => (
            <div key={user.id}>
              <Row
                style={{
                  border: "2px solid red",
                  padding: "2px",
                  margin: "5px",
                }}
              >
                <Col>
                  <strong>#{index + 1}</strong>
                </Col>
                <Col>
                  <strong>{user.name}</strong>
                </Col>
              </Row>
            </div>
          ))}{" "}
        </>
      ) : (
        <>
          <ErrrorMsg>{"Not found any Admins !"}</ErrrorMsg>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
