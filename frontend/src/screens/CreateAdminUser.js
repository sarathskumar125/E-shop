import React, { useContext } from 'react';
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Store } from '../Store';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const CreateAdminUser = () => {
    const navigate = useNavigate()
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [loader, setLoader] = useState(false)

    const submitHandler=async(e)=>{
        e.preventDefault();
        if (password !== confirmPassword) {
          toast.error("Password doesn't match");
        } else{
          try {
            setLoader(true)
             const data = await axios.post("/api/users/createadminuser", {
                name,
                email,
                password,
            },{
                headers: { Authorization: `Bearer ${userInfo.data.token}` },
              });
              setLoader(false)
              toast.success(data.data.message)
              navigate('/admin/adminusers')
          } catch (error) {
            setLoader(false)
            toast.error(getError(error))
          }
    } }

  return (
    <div className="container small-container">
    <Helmet>
      <title>Create AdminUser</title>
    </Helmet>
    <h1 className="my-3">CREATE ADMIN USER</h1>
    <Form onSubmit={submitHandler} autoComplete="off">
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Full Name</Form.Label>
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
      <Button type="submit">Save</Button>
    </Form>
    {loader && <Loading />}
  </div>
  )
}

export default CreateAdminUser;