import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initAuth = () => {
      const user = AuthService.getCurrentUser();
      
      if (user && AuthService.isAuthenticated()) {
        setCurrentUser(user);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (username, password) => {
    try {
      const user = await AuthService.login(username, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  const logout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
  };
  
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
    isManager
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);