import React from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useContext } from "react";
import { Store } from "../Store";
import Button from "react-bootstrap/esm/Button";
import { useReducer } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Loading from "../components/Loading";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, updateLoading: true };
    case "UPDATE_SUCCESS":
      return { ...state, updateLoading: false };
    case "UPDATE_FAIL":
      return { ...state, updateLoading: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { state, Dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.data.name);
  const [email, setEmail] = useState(userInfo.data.email);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [{ updateLoading }, dispatch] = useReducer(reducer, {
    updateLoading: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      const data = await axios.put(
        "/api/users/profile",
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success("USER UPDATED SUCCESSFULLY")
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(error));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>My Profile</title>
      </Helmet>
      <h1 className="my-3">USER PROFILE</h1>
      <Form onSubmit={submitHandler} autoComplete="off">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            autoComplete="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirm-password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Update</Button>
      </Form>
      {updateLoading && <Loading />}
    </div>
  );
};

export default ProfileScreen;
