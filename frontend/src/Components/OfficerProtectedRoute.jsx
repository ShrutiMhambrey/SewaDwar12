import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const OfficerProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if officer is logged in
  const officerId = localStorage.getItem("officer_id");
  const roleCode = localStorage.getItem("role_code");
  
  // Only allow officers (role_code = "OF") or admins
  const isOfficerLoggedIn = officerId && (roleCode === "OF" || roleCode === "AD" || roleCode === "HD");

  if (!isOfficerLoggedIn) {
    toast.error("Please login as an officer to access this page");
    return <Navigate to="/login/officerlogin" state={{ from: location }} replace />;
  }

  return children;
};

export default OfficerProtectedRoute;
