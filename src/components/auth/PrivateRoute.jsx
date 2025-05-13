import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading, authInitialized } = useAuth();
  const location = useLocation();
  
  // Display loading state if auth is still initializing
  if (!authInitialized || loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={50} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    // Save the location the user was trying to access for potential redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render the protected content
  return children;
};

export default PrivateRoute;