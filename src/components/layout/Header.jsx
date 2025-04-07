import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Badge } from '@mui/material';
import { Menu as MenuIcon, Notifications, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/layout.css';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
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
        
        <Typography variant="h6" className="header-title">
          Expense Management
        </Typography>
        
        <div className="header-actions">
          <IconButton color="inherit" onClick={handleNotificationOpen}>
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar className="user-avatar">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </div>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
        >
          <MenuItem>DA request approved</MenuItem>
          <MenuItem>New TA request awaiting approval</MenuItem>
          <MenuItem>Monthly report available</MenuItem>
          <MenuItem>Team performance updated</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;