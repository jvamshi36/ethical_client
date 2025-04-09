// src/pages/admin/UserDetails.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Chip, Avatar, TextField, CircularProgress, Alert,
  InputAdornment
} from '@mui/material';
import { 
  Edit, ArrowBack, Person, Email, Business, 
  LocationOn, SupervisedUserCircle, Visibility, VisibilityOff, Save
} from '@mui/icons-material';
import UserForm from '../../components/admin/UserForm';
import TeamManagement from '../../components/admin/TeamManagement';
import AllowanceHistory from '../../components/admin/AllowanceHistory'; // Import the AllowanceHistory component
import UserTravelRoutesAdmin from '../../components/admin/UserTravelRoutesAdmin';
import { api } from '../../services/auth.service';
import UserService from '../../services/user.service';

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
  
  if (loading || !userDetail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={onBack}>Back to Users</Button>
        <Button variant="contained" startIcon={<Edit />} onClick={handleEditUser}>Edit User</Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
            {userDetail.fullName?.charAt(0) || userDetail.username?.charAt(0)}
          </Avatar>
          
          <Box>
            <Typography variant="h5">{userDetail.fullName}</Typography>
            <Typography variant="body1" color="textSecondary">{userDetail.username}</Typography>
            <Chip 
              label={userDetail.role} 
              color={['ADMIN', 'SUPER_ADMIN'].includes(userDetail.role) ? 'error' : 'primary'}
              size="small"
              sx={{ mt: 1 }}
            />
            <Chip 
              label={userDetail.isActive ? 'Active' : 'Inactive'} 
              color={userDetail.isActive ? 'success' : 'default'}
              size="small"
              sx={{ ml: 1, mt: 1 }}
            />
          </Box>
          
          <Box sx={{ ml: 'auto' }}>
            <Button 
              variant="outlined" 
              onClick={handleOpenPasswordReset}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Email fontSize="small" sx={{ mr: 1 }} /> Email
            </Typography>
            <Typography variant="body1">{userDetail.email}</Typography>
          </Box>
          
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Business fontSize="small" sx={{ mr: 1 }} /> Department
            </Typography>
            <Typography variant="body1">{userDetail.department}</Typography>
          </Box>
          
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn fontSize="small" sx={{ mr: 1 }} /> Headquarters
            </Typography>
            <Typography variant="body1">{userDetail.headquarters}</Typography>
          </Box>
          
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <SupervisedUserCircle fontSize="small" sx={{ mr: 1 }} /> Reporting Manager
            </Typography>
            <Typography variant="body1">
              {userDetail.reportingManager?.fullName || 'None'}
              {userDetail.reportingManager?.role && ` (${userDetail.reportingManager.role})`}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Paper>
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
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <UserForm
            initialData={userDetail}
            isEditMode={true}
            onSubmit={handleUserFormSubmit}
          />
        </DialogContent>
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
          <Button onClick={() => setPasswordResetOpen(false)}>Cancel</Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            color="primary"
            disabled={!passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetails;