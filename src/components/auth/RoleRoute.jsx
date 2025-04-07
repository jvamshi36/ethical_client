import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { currentUser, hasRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return hasRole(allowedRoles) ? children : <Navigate to="/" />;
};

export default RoleRoute;