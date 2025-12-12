import React from 'react';
import { Navigate } from 'react-router-dom';

const HelpdeskProtectedRoute = ({ children }) => {
  const helpdeskId = localStorage.getItem('helpdesk_id');
  const roleCode = localStorage.getItem('helpdesk_role');
  
  if (!helpdeskId || !roleCode) {
    return <Navigate to="/login/helpdeslogin" replace />;
  }
  
  return children;
};

export default HelpdeskProtectedRoute;
