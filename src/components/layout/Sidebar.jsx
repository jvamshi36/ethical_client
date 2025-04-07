import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Collapse } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Dashboard, AttachMoney, CardTravel, InsightsOutlined, 
  Person, People, Settings, ExpandLess, ExpandMore 
} from '@mui/icons-material';
import { useState } from 'react';
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
      icon: <Dashboard />,
      path: '/',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Daily Allowance',
      icon: <AttachMoney />,
      path: '/daily-allowance',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Travel Allowance',
      icon: <CardTravel />,
      path: '/travel-allowance',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Analytics',
      icon: <InsightsOutlined />,
      path: '/analytics',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'Profile',
      icon: <Person />,
      path: '/profile',
      roles: ['BE', 'BM', 'SBM', 'ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']
    }
  ];
  
  const adminMenuItems = [
    {
      text: 'User Management',
      icon: <People />,
      path: '/admin/users',
      roles: ['ADMIN', 'SUPER_ADMIN']
    },
    {
      text: 'System Settings',
      icon: <Settings />,
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
    >
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="app-logo"></div>
          <h2>ExpenseManager</h2>
        </div>
      </div>
      
      <Divider />
      
      <List className="sidebar-menu">
        {menuItems.map((item) => (
          hasRole(item.roles) && (
            <ListItem
              button
              component={NavLink}
              to={item.path}
              key={item.text}
              className="menu-item"
            >
              <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
        
        {hasRole(['ADMIN', 'SUPER_ADMIN']) && (
          <>
            <Divider />
            <ListItem button onClick={handleAdminClick} className="menu-item">
              <ListItemIcon className="menu-icon"><Settings /></ListItemIcon>
              <ListItemText primary="Admin" />
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
                    >
                      <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  )
                ))}
              </List>
            </Collapse>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;