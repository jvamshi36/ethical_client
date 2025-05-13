import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, CircularProgress, Box } from '@mui/material';
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

// Theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00bcd4',
      light: '#33c9dc',
      dark: '#008394',
    },
    secondary: {
      main: '#7c4dff',
      light: '#9670ff',
      dark: '#5035b1',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

// App loading state component
const AppLoading = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress size={60} />
  </Box>
);

const AppLayout = ({ children, sidebarOpen, toggleSidebar }) => (
  <div className="app">
    <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    <Sidebar open={sidebarOpen} />
    <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {children}
    </main>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    // Simulate any app initialization that might be needed
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (!appReady) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppLoading />
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with layout */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <AppLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
                    <Routes>
                      {/* User routes */}
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/daily-allowance" element={<DailyAllowance />} />
                      <Route path="/travel-allowance" element={<TravelAllowance />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/profile" element={<Profile />} />
                      
                      {/* Admin routes */}
                      <Route 
                        path="/admin/dashboard" 
                        element={
                          <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                            <AdminDashboard />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/admin/users" 
                        element={
                          <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                            <UserManagement />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/admin/settings" 
                        element={
                          <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                            <SystemSettings />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/admin/daily-allowances" 
                        element={
                          <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                            <AdminDailyAllowance />
                          </RoleRoute>
                        } 
                      />
                      <Route 
                        path="/admin/travel-allowances" 
                        element={
                          <RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                            <AdminTravelAllowance />
                          </RoleRoute>
                        } 
                      />
                      
                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;