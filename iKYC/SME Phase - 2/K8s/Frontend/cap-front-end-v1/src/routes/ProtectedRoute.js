// ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const isLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));
  const userType = localStorage.getItem("userType");

  console.log(isLoggedIn, userType, requiredRole);

  if (isLoggedIn === undefined || userType === undefined) {
    // Handle loading or error state if necessary
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  console.log(userType !== requiredRole);
  if (userType !== requiredRole) {
    // console.log("outlet before", `/${userType.toLowerCase()}dashboard`);
    return <Navigate to={`/${userType.toLowerCase()}dashboard`} />;
  }

  console.log("outlet");
  return <Outlet />;
};

export default ProtectedRoute;
