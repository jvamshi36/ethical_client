import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../styles/pages/login.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Typography variant="h4" className="form-title">
        Login
      </Typography>
      
      {error && <Alert severity="error" className="form-alert">{error}</Alert>}
      
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        className="form-input"
      />
      
      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        className="form-input"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        className="submit-button"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;