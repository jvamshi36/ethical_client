import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, 
  Avatar, Menu, MenuItem, Badge, Box,
  Tooltip, useMediaQuery, useTheme, 
  CircularProgress, Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications, 
  AccountCircle,
  Logout,
  Person,
  Dashboard,
  Settings
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/layout.css';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Sample notifications for demo
  const notifications = [
    { id: 1, message: 'DA request approved', time: '10 min ago' },
    { id: 2, message: 'New TA request awaiting approval', time: '1 hour ago' },
    { id: 3, message: 'Monthly report available', time: '3 hours ago' },
    { id: 4, message: 'Team performance updated', time: 'Yesterday' }
  ];
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };
  
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      handleMenuClose(); // Close the menu immediately
      await logout();
      // Navigation is handled inside the logout function in AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      // If logout fails, ensure user sees something happened
      alert('An error occurred during logout. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };
  
  const navigateTo = (path) => {
    navigate(path);
    handleMenuClose();
  };
  
  return (
    <AppBar position="fixed" className="app-header">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          className="menu-button"
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" className="header-title gradient-text-primary">
          Expense Management
        </Typography>
        
        <Box className="header-actions">
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationOpen} className="action-icon">
              <Badge badgeContent={notifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {loggingOut ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <CircularProgress size={24} color="inherit" />
            </Box>
          ) : (
            <Tooltip title={currentUser?.fullName || 'User Profile'}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                className="avatar-button"
              >
                <Avatar className="user-avatar">
                  {currentUser?.fullName?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {/* Profile menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="profile-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            className: "menu-paper"
          }}
        >
          <Box className="menu-header">
            <Avatar className="menu-avatar">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{currentUser?.fullName}</Typography>
              <Typography variant="caption" color="textSecondary">
                {currentUser?.role}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={() => navigateTo('/')} className="menu-item">
            <Dashboard fontSize="small" className="menu-icon" />
            Dashboard
          </MenuItem>
          
          <MenuItem onClick={() => navigateTo('/profile')} className="menu-item">
            <Person fontSize="small" className="menu-icon" />
            Profile
          </MenuItem>
          
          {isAdmin() && (
            <MenuItem onClick={() => navigateTo('/admin/dashboard')} className="menu-item">
              <Settings fontSize="small" className="menu-icon" />
              Admin Panel
            </MenuItem>
          )}
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={handleLogout} className="menu-item" disabled={loggingOut}>
            <Logout fontSize="small" className="menu-icon logout-icon" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </MenuItem>
        </Menu>
        
        {/* Notifications menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          className="notification-menu"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            className: "menu-paper"
          }}
        >
          <Box className="menu-header">
            <Typography variant="subtitle1">Notifications</Typography>
          </Box>
          
          <Divider sx={{ mb: 1 }} />
          
          {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem key={notification.id} className="notification-item" onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
          
          {notifications.length > 0 && (
            <>
              <Divider sx={{ mt: 1 }} />
              <Box className="menu-footer">
                <Typography 
                  variant="body2" 
                  color="primary" 
                  align="center" 
                  className="view-all"
                  onClick={handleNotificationClose}
                  sx={{ cursor: 'pointer', py: 1 }}
                >
                  View All Notifications
                </Typography>
              </Box>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );

};

export default Header;
