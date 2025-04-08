import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, 
  Avatar, Menu, MenuItem, Badge, Box,
  Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications, 
  AccountCircle,
  LightMode,
  DarkMode,
  Logout,
  Person,
  Dashboard
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/layout.css';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
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
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
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
          
          <MenuItem onClick={() => navigateTo('/dashboard')} className="menu-item">
            <Dashboard fontSize="small" className="menu-icon" />
            Dashboard
          </MenuItem>
          
          <MenuItem onClick={() => navigateTo('/profile')} className="menu-item">
            <Person fontSize="small" className="menu-icon" />
            Profile
          </MenuItem>
          
          <MenuItem onClick={handleLogout} className="menu-item">
            <Logout fontSize="small" className="menu-icon logout-icon" />
            Logout
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
          
          {notifications.map((notification) => (
            <MenuItem key={notification.id} className="notification-item">
              <Box>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          
          <Box className="menu-footer">
            <Typography 
              variant="body2" 
              color="primary" 
              align="center" 
              className="view-all"
            >
              View All Notifications
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;