import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// keeps the UI in sync with the backend's admin-only rules - /addfoods and /updatefoods/:id used to be reachable by anyone who typed the URL
const RequireAdmin = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user !== null && user !== undefined && user.isAdmin === true;

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RequireAdmin;
