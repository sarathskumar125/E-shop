import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils";
import ErrrorMsg from "../components/ErrrorMsg";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Store } from "../Store";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [userlist, setuserlist] = useState();

  const createAdminUser = () => {
    navigate('/admin/createadminuser')
  };

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const List = await axios.get("/api/users/adminuserlist", {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        });
        setuserlist(List.data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchAdminUsers();
  }, [setuserlist, userInfo.data.token]);
  // console.log(userlist);
  return (
    <div>
      <Helmet>
        <title>Admin Users</title>
      </Helmet>
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "1rem" }}
      >
        <Button onClick={createAdminUser}>Create new Admin user </Button>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
      >
        <h1>Admin-User List</h1>
      </div>
      {userlist ? (
        <>
          {" "}
          {userlist.map((user, index) => (
            <div key={user.id} style={{justifyContent:"center"}}>
              <Row
                style={{
                  border: "2px solid blue",
                  padding: "5px",
                  margin: "5px",
                  borderRadius:"5px",
                }}
              >
                <Col><strong>#{index + 1}</strong></Col>
                <Col><strong>{user.name}</strong></Col>
              </Row>
            </div>
          ))}{" "}
        </>
      ) : (
        <>
          <ErrrorMsg>{"Not found Admin Users !"}</ErrrorMsg>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
