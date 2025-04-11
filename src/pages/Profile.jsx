import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Avatar,
  TextField, Divider, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, IconButton
} from '@mui/material';
import { 
  Person, Email, Business, LocationOn, Badge,
  Edit, Visibility, VisibilityOff, Save
} from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/auth.service';
import '../styles/pages/profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: ''
  });
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, you would fetch this from your API
      // For now, we'll use the currentUser from auth context
      
      // Simulating an API call
      setTimeout(() => {
        const userData = {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          fullName: currentUser.fullName,
          role: currentUser.role,
          department: currentUser.department,
          headquarters: currentUser.headquarters,
          reportingManager: {
            id: 1,
            fullName: 'John Smith',
            role: 'ZBM'
          },
          joinDate: '2021-05-15',
          lastLogin: '2023-09-01T14:32:15'
        };
        
        setUserData(userData);
        setFormData({
          email: userData.email,
          fullName: userData.fullName
        });
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError('Failed to load profile data. Please try again later.');
      console.error('Error fetching profile data:', err);
      setLoading(false);
    }
  };
  
  const handleToggleEditMode = () => {
    if (editMode) {
      // Cancel edit mode - revert form data
      setFormData({
        email: userData.email,
        fullName: userData.fullName
      });
    }
    setEditMode(!editMode);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };
  
  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    
    try {
      // In a real application, you would send this to your API
      // For demo, we'll simulate an API call
      
      setTimeout(() => {
        setUserData({
          ...userData,
          email: formData.email,
          fullName: formData.fullName
        });
        
        setEditMode(false);
        setSuccess('Profile updated successfully');
      }, 500);
      
    } catch (err) {
      setError('Failed to update profile. Please try again later.');
      console.error('Error updating profile:', err);
    }
  };
  
  const handleChangePassword = async () => {
    setPasswordError('');
    
    // Validate passwords
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    try {
      // In a real application, you would send this to your API
      // For demo, we'll simulate an API call
      
      setTimeout(() => {
        setPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('Password changed successfully');
      }, 500);
      
    } catch (err) {
      setPasswordError('Failed to change password. Please check your current password and try again.');
      console.error('Error changing password:', err);
    }
  };
  
  if (loading) {
    return (
      <PageContainer title="My Profile">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  if (!userData) {
    return (
      <PageContainer title="My Profile">
        <Alert severity="error">
          Failed to load profile data. Please refresh the page.
        </Alert>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer 
      title="My Profile"
      actions={
        <Button
          variant="contained"
          color={editMode ? "secondary" : "primary"}
          startIcon={editMode ? <Save /> : <Edit />}
          onClick={editMode ? handleSaveProfile : handleToggleEditMode}
        >
          {editMode ? 'Save Profile' : 'Edit Profile'}
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="profile-card">
            <Box className="profile-header">
              <Avatar className="profile-avatar" sx={{ width: 100, height: 100 }}>
                {userData.fullName.charAt(0)}
              </Avatar>
              <Typography variant="h5" className="profile-name">
                {userData.fullName}
              </Typography>
              <Typography variant="body1" color="textSecondary" className="profile-role">
                {userData.role} - {userData.department}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box className="profile-actions">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setPasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper className="profile-details">
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {editMode ? (
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <Box className="profile-field">
                    <Person className="field-icon" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {userData.fullName}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box className="profile-field">
                  <Badge className="field-icon" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Username
                    </Typography>
                    <Typography variant="body1">
                      {userData.username}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {editMode ? (
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <Box className="profile-field">
                    <Email className="field-icon" />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {userData.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box className="profile-field">
                  <Business className="field-icon" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {userData.department}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box className="profile-field">
                  <LocationOn className="field-icon" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Headquarters
                    </Typography>
                    <Typography variant="body1">
                      {userData.headquarters}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box className="profile-field">
                  <Person className="field-icon" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Reporting Manager
                    </Typography>
                    <Typography variant="body1">
                      {userData.reportingManager ? 
                        `${userData.reportingManager.fullName} (${userData.reportingManager.role})` : 
                        'None'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Change Password Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type={showPassword.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="New Password"
              name="newPassword"
              type={showPassword.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained" 
            color="primary"
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Profile;