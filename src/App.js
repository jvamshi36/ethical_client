import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Authenticated route wrapper
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/Dashboard';
import DailyAllowance from './pages/DailyAllowance';
import TravelAllowance from './pages/TravelAllowance';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import AdminDailyAllowance from './pages/admin/AdminDailyAllowance';
import AdminTravelAllowance from './pages/admin/AdminTravelAllowance';
import './styles/global.css';

// Theme configuration for futuristic UI (you can customize in styles)
const theme = createTheme({
  // The actual theme styling will be in your styles folder
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with layout */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="app">
                    <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
                    <Sidebar open={sidebarOpen} />
                    <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/daily-allowance" element={<DailyAllowance />} />
                        <Route path="/travel-allowance" element={<TravelAllowance />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/profile" element={<Profile />} />
                        
                        {/* Admin routes */}
                        <Route path="/admin/dashboard" element={
  <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
    <AdminDashboard />
  </RoleRoute>
} />
                        <Route path="/admin/users" element={
                          <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                            <UserManagement />
                          </RoleRoute>
                        } />
                        <Route path="/admin/settings" element={
                          <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                            <SystemSettings />
                          </RoleRoute>
                        } />

<Route path="/admin/daily-allowances" element={
    <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <AdminDailyAllowance />
    </RoleRoute>
  } />
  <Route path="/admin/travel-allowances" element={
    <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <AdminTravelAllowance />
    </RoleRoute>
  } />
                        
                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;