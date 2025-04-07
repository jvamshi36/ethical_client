import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
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