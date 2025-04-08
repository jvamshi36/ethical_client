import React, { useState } from 'react';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Divider, Collapse, Box, Typography, Avatar
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Dashboard, AttachMoney, CardTravel, InsightsOutlined, 
  Person, People, Settings, ExpandLess, ExpandMore, 
  Layers, Analytics
} from '@mui/icons-material';
import '../../styles/components/layout.css';

const Sidebar = ({ open }) => {
  const { currentUser, hasRole } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  
  const handleAdminClick = () => {
    setAdminOpen(!adminOpen);
  };
  
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard className="menu-icon" />,
      path: '/',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Daily Allowance',
      icon: <AttachMoney className="menu-icon" />,
      path: '/daily-allowance',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Travel Allowance',
      icon: <CardTravel className="menu-icon" />,
      path: '/travel-allowance',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Analytics',
      icon: <InsightsOutlined className="menu-icon" />,
      path: '/analytics',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Profile',
      icon: <Person className="menu-icon" />,
      path: '/profile',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    }
  ];
  
  const adminMenuItems = [
    {
      text: 'User Management',
      icon: <People className="menu-icon" />,
      path: '/admin/users',
      roles: ['ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'System Settings',
      icon: <Settings className="menu-icon" />,
      path: '/admin/settings',
      roles: ['ADMIN', 'SUPER_ADMIN']
    }
  ];
  
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="sidebar"
      classes={{
        paper: "sidebar-paper"
      }}
    >
      <Box className="sidebar-header">
        <Box className="logo-container">
          <Avatar className="app-logo glow-animation">
            <Layers fontSize="small" />
          </Avatar>
          <Typography variant="h6" className="logo-text gradient-text-primary">
            ExpenseManager
          </Typography>
        </Box>
      </Box>
      
      <Box className="user-profile">
        <Avatar className="profile-avatar">
          {currentUser?.fullName?.charAt(0) || 'U'}
        </Avatar>
        <Box className="profile-info">
          <Typography variant="subtitle2" noWrap>
            {currentUser?.fullName}
          </Typography>
          <Typography variant="caption" className="role-badge">
            {currentUser?.role}
          </Typography>
        </Box>
      </Box>
      
      <Divider className="sidebar-divider" />
      
      <List className="sidebar-menu">
        {menuItems.map((item) => (
          hasRole(item.roles) && (
            <ListItem
              button
              component={NavLink}
              to={item.path}
              key={item.text}
              className="menu-item"
              activeClassName="active"
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
        
        {hasRole(['ADMIN', 'SUPER_ADMIN']) && (
          <>
            <Divider className="sidebar-divider" />
            <ListItem button onClick={handleAdminClick} className="menu-item admin-header">
              <ListItemIcon><Settings className="menu-icon" /></ListItemIcon>
              <ListItemText primary="Administration" />
              {adminOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            
            <Collapse in={adminOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className="submenu">
                {adminMenuItems.map((item) => (
                  hasRole(item.roles) && (
                    <ListItem
                      button
                      component={NavLink}
                      to={item.path}
                      key={item.text}
                      className="submenu-item"
                      activeClassName="active"
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  )
                ))}
              </List>
            </Collapse>
          </>
        )}
      </List>
      
      <Box className="sidebar-footer">
        <Typography variant="caption" color="textSecondary">
          © 2025 ExpenseManager
        </Typography>
        <Typography variant="caption" color="textSecondary">
          v1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;