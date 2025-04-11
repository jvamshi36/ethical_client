// src/pages/admin/UserDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Chip, Avatar, TextField, CircularProgress, Alert,
  InputAdornment
} from '@mui/material';
import { 
  Edit, ArrowBack, Person, Email, Business, Close,
  LocationOn, SupervisedUserCircle, Visibility, VisibilityOff, Save
} from '@mui/icons-material';
import UserForm from '../../components/admin/UserForm';
import TeamManagement from '../../components/admin/TeamManagement';
import AllowanceHistory from '../../components/admin/AllowanceHistory';
import UserTravelRoutesAdmin from '../../components/admin/UserTravelRoutesAdmin';
import { api } from '../../services/auth.service';
import UserService from '../../services/user.service';
import '../../styles/components/admin.css';
import '../../styles/pages/user-details.css'; // Import the user-details CSS

const UserDetails = ({ user, onBack, onUserUpdate }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });
  
  // Create a ref for UserForm
  const formRef = useRef(null);
  
  useEffect(() => {
    if (user && user.id) {
      fetchUserDetails();
    }
  }, [user]);
  
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await UserService.getUserById(user.id);
      setUserDetail(response);
    } catch (error) {
      setError('Failed to fetch user details');
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditUser = () => {
    setEditFormOpen(true);
  };
  
  const handleUserFormSubmit = async (userData) => {
    try {
      await UserService.updateUser(user.id, userData);
      setSuccess('User updated successfully');
      setEditFormOpen(false);
      fetchUserDetails();
      // Notify parent component about the update
      if (onUserUpdate) onUserUpdate();
    } catch (error) {
      setError('Failed to update user');
      console.error('Error updating user:', error);
    }
  };
  
  const handleOpenPasswordReset = () => {
    setPasswordData({
      newPassword: '',
      confirmPassword: '',
      showPassword: false
    });
    setPasswordResetOpen(true);
  };
  
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const togglePasswordVisibility = () => {
    setPasswordData({
      ...passwordData,
      showPassword: !passwordData.showPassword
    });
  };
  
  const handleResetPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await UserService.resetPassword(user.id, passwordData.newPassword);
      setSuccess('Password reset successfully');
      setPasswordResetOpen(false);
    } catch (error) {
      setError('Failed to reset password');
      console.error('Error resetting password:', error);
    }
  };
  
  const handleSubmitForm = () => {
    // Check if the formRef exists and has a submitForm method
    if (formRef.current && typeof formRef.current.submitForm === 'function') {
      formRef.current.submitForm();
    } else {
      console.error('Form ref or submitForm method not available');
    }
  };
  
  if (loading || !userDetail) {
    return (
      <div className="loading-container">
        <CircularProgress className="loading-spinner" />
        <Typography>Loading user details...</Typography>
      </div>
    );
  }
  
  return (
    <div className="user-details-container">
      <div className="user-details-header">
        <h1 className="user-details-title">User Details</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button 
            className="action-button secondary-button" 
            startIcon={<ArrowBack />} 
            onClick={onBack}
          >
            Back to Users
          </Button>
          <Button 
            className="action-button primary-button" 
            startIcon={<Edit />} 
            onClick={handleEditUser}
          >
            Edit User
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <Button onClick={() => setError('')}>Dismiss</Button>
        </div>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <Avatar sx={{ width: 100, height: 100, fontSize: '2.5rem' }}>
              {userDetail.fullName?.charAt(0) || userDetail.username?.charAt(0)}
            </Avatar>
          </div>
          
          <div className="profile-info">
            <h2 className="user-name">{userDetail.fullName}</h2>
            <div className="user-role">{userDetail.username}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Chip 
                label={userDetail.role} 
                color={['ADMIN', 'SUPER_ADMIN'].includes(userDetail.role) ? 'error' : 'primary'}
                size="small"
              />
              <span 
                className={`user-status ${userDetail.isActive ? 'status-active' : 'status-inactive'}`}
              >
                {userDetail.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div>
            <Button 
              className="action-button secondary-button"
              onClick={handleOpenPasswordReset}
            >
              Reset Password
            </Button>
          </div>
        </div>
        
        <Divider sx={{ my: 2 }} />
        
        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">
              <Email fontSize="small" style={{ marginRight: '4px', verticalAlign: 'middle' }} /> 
              Email
            </div>
            <div className="detail-value">{userDetail.email}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">
              <Business fontSize="small" style={{ marginRight: '4px', verticalAlign: 'middle' }} /> 
              Department
            </div>
            <div className="detail-value">{userDetail.department || 'Not specified'}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">
              <LocationOn fontSize="small" style={{ marginRight: '4px', verticalAlign: 'middle' }} /> 
              Headquarters
            </div>
            <div className="detail-value">{userDetail.headquarters || 'Not specified'}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">
              <SupervisedUserCircle fontSize="small" style={{ marginRight: '4px', verticalAlign: 'middle' }} /> 
              Reporting Manager
            </div>
            <div className="detail-value">
              {userDetail.reportingManager?.fullName || 'None'}
              {userDetail.reportingManager?.role && ` (${userDetail.reportingManager.role})`}
            </div>
          </div>
        </div>
      </div>
      
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Team Members" />
          <Tab label="Travel Routes" />
          <Tab label="Allowance History" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <TeamManagement managerId={user.id} />
          )}
          
          {tabValue === 1 && (
            <UserTravelRoutesAdmin userId={user.id} username={userDetail.fullName} />
          )}
          
          {tabValue === 2 && (
            <AllowanceHistory userId={user.id} />
          )}
        </Box>
      </Paper>
      
      {/* Edit User Dialog */}
      <Dialog
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="form-dialog-title">
          <Typography variant="h6">Edit User</Typography>
          <IconButton
            aria-label="close"
            onClick={() => setEditFormOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'gray'
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <UserForm
            ref={formRef}
            initialData={userDetail}
            isEditMode={true}
            onSubmit={handleUserFormSubmit}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            className="action-button secondary-button"
            variant="outlined" 
            onClick={() => setEditFormOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="action-button primary-button"
            variant="contained"
            onClick={handleSubmitForm}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Password Reset Dialog */}
      <Dialog
        open={passwordResetOpen}
        onClose={() => setPasswordResetOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Reset password for user: <strong>{userDetail.username}</strong>
            </Typography>
            
            <TextField
              label="New Password"
              name="newPassword"
              type={passwordData.showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {passwordData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={passwordData.showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              required
              margin="normal"
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
              helperText={
                passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' 
                ? 'Passwords do not match' 
                : ''
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button className="action-button secondary-button" onClick={() => setPasswordResetOpen(false)}>
            Cancel
          </Button>
          <Button
            className="action-button primary-button"
            onClick={handleResetPassword}
            disabled={!passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDetails;