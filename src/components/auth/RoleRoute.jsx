import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, Box, Typography, Button } from '@mui/material';

const RoleRoute = ({ children, allowedRoles }) => {
  const { currentUser, hasRole } = useAuth();
  const location = useLocation();
  
  // Ensure user is authenticated (this should be redundant if wrapped in PrivateRoute)
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if the user has the required role
  if (!hasRole(allowedRoles)) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={4}
        minHeight="80vh"
      >
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%', 
            maxWidth: 600, 
            mb: 3,
            fontSize: '1.1rem',
            padding: '16px 24px'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You don't have the required permissions to access this page.
            This area requires {Array.isArray(allowedRoles) 
              ? allowedRoles.join(' or ') 
              : allowedRoles} role.
          </Typography>
        </Alert>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }
  
  // User has the required role, render the protected content
  return children;
};

export default RoleRoute;