import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Handle JWT token storage
const TokenService = {
  getLocalAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
  
  getLocalRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },
  
  setLocalAccessToken: (token) => {
    localStorage.setItem('accessToken', token);
  },
  
  setLocalRefreshToken: (token) => {
    localStorage.setItem('refreshToken', token);
  },
  
  removeTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  getUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  removeUser: () => {
    localStorage.removeItem('user');
  }
};

// Create axios instance with auth header
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    
    if (error.response) {
      // Access token expired
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        
        try {
          // Try to refresh the token
          const refreshToken = TokenService.getLocalRefreshToken();
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { accessToken } = response.data;
          TokenService.setLocalAccessToken(accessToken);
          
          // Retry the original request
          return instance(originalConfig);
        } catch (_error) {
          // If refresh token fails, log out the user
          AuthService.logout();
          return Promise.reject(_error);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service methods
const AuthService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      
      const { accessToken, refreshToken, user } = response.data;
      
      TokenService.setLocalAccessToken(accessToken);
      TokenService.setLocalRefreshToken(refreshToken);
      TokenService.setUser(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await instance.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenService.removeTokens();
      TokenService.removeUser();
    }
  },
  
  getCurrentUser: () => {
    return TokenService.getUser();
  },
  
  isAuthenticated: () => {
    const token = TokenService.getLocalAccessToken();
    if (!token) {
      return false;
    }
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  },
  
  getUserRole: () => {
    const user = TokenService.getUser();
    return user ? user.role : null;
  }
};

export { AuthService, instance as api };