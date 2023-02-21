import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store";

const AdminUserRoute = ({ children }) => {
    const { state } = useContext(Store);
    const { userInfo } = state;
  return  userInfo && userInfo.data.isAdminUser ? (
    children
  ) : (
    <Navigate to="/signin" />
  );  
}

export default AdminUserRoute
