import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Paper, Typography, TextField, Button, 
  Box, InputAdornment, IconButton, Alert, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      // Redirect to dashboard or the page they were trying to access
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(formData.username, formData.password);
      // Redirect will be handled by useEffect
    } catch (err) {
      console.error('Login error:', err);
      
      // Show specific error message based on response
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid username or password');
        } else if (err.response.status === 403) {
          setError('Your account is inactive. Please contact an administrator.');
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (err.request) {
        // Request made but no response received
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <Container maxWidth="xs">
        <Paper elevation={3} className="auth-paper">
          <Box className="auth-logo">
            <Lock fontSize="large" color="primary" />
            <Typography variant="h4" className="auth-title">
              Expense Manager
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" className="auth-error">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              className="auth-input"
              disabled={loading}
              autoFocus
            />
            
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              className="auth-input"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              className="auth-button"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            
            <Box className="auth-footer">
              <Typography variant="body2">
                Forgot password? Contact your administrator
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;