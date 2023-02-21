import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../Store";

const SuperAdminRoute = ({children}) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.data.isSuperAdmin ? (
    children
  ) : (
    <Navigate to="/signin" />
  );
};

export default SuperAdminRoute;
