import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  
  const initAuth = useCallback(() => {
    try {
      const user = AuthService.getCurrentUser();
      
      if (user && AuthService.isAuthenticated()) {
        setCurrentUser(user);
      } else {
        // If we have user data but tokens are invalid, clean up
        if (user && !AuthService.isAuthenticated()) {
          AuthService.logout();
        }
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
      setAuthInitialized(true);
    }
  }, []);
  
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  const login = async (username, password) => {
    try {
      setLoading(true);
      const user = await AuthService.login(username, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setLoading(false);
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  
  // Handle token expiration
  useEffect(() => {
    if (!authInitialized) return;
    
    // Periodically check authentication status (every minute)
    const checkAuthInterval = setInterval(() => {
      if (currentUser && !AuthService.isAuthenticated()) {
        console.log('Token expired, logging out');
        logout();
      }
    }, 60000);
    
    return () => clearInterval(checkAuthInterval);
  }, [authInitialized, currentUser, logout]);
  
  // Check if user has required role
  const hasRole = (requiredRoles) => {
    if (!currentUser) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(currentUser.role);
    }
    
    return currentUser.role === requiredRoles;
  };
  
  // Check if user is in admin role
  const isAdmin = () => {
    return hasRole(['ADMIN', 'SUPER_ADMIN']);
  };
  
  // Check if user is in manager role
  const isManager = () => {
    return hasRole(['ABM', 'RBM', 'ZBM', 'DGM', 'ADMIN', 'SUPER_ADMIN']);
  };
  
  const authContextValue = {
    currentUser,
    loading,
    login,
    logout,
    hasRole,
    isAdmin,
    isManager,
    authInitialized
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);