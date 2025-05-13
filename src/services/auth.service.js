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
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Add a timeout to prevent hanging requests
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

// Flag to prevent multiple refresh attempts at once
let isRefreshing = false;
// Queue of requests to retry after token refresh
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      // If token refresh request fails, clean up and reject
      if (originalRequest.url === `${API_URL}/auth/refresh-token` && 
          error.response.status === 401) {
        AuthService.logout();
        return Promise.reject(error);
      }
      
      // Access token expired (401) and not already retrying this request
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, add this request to queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // Try to refresh the token
          const refreshToken = TokenService.getLocalRefreshToken();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { accessToken } = response.data;
          
          // Store the new access token
          TokenService.setLocalAccessToken(accessToken);
          
          // Update authorization header for all future requests
          instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          // Process queued requests with new token
          processQueue(null, accessToken);
          
          // Retry the original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Process queued requests with error
          processQueue(refreshError);
          
          // If refresh token fails, log out the user
          AuthService.logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      // Handle rate limiting (429 Too Many Requests)
      if (error.response.status === 429) {
        console.warn('Rate limit exceeded. Too many requests.');
        error.message = 'Too many requests. Please wait a moment before trying again.';
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.status, error.response.data);
        error.message = 'Server error. Please try again later.';
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
      
      // Store tokens and user info
      TokenService.setLocalAccessToken(accessToken);
      TokenService.setLocalRefreshToken(refreshToken);
      TokenService.setUser(user);
      
      // Set the auth header for future requests
      instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      // Try to notify the server
      const accessToken = TokenService.getLocalAccessToken();
      if (accessToken) {
        try {
          await instance.post(`${API_URL}/auth/logout`);
        } catch (logoutError) {
          console.warn('Server logout failed, continuing with client logout:', logoutError);
        }
      }
    } finally {
      // Clear auth header
      delete instance.defaults.headers.common['Authorization'];
      
      // Always clean up local storage regardless of server response
      TokenService.removeTokens();
      TokenService.removeUser();
      
      // Reset any refresh state
      isRefreshing = false;
      failedQueue = [];
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
        // Token is expired, but we might be able to refresh
        // Return true for now to prevent immediate logout flicker
        // The interceptor will handle the refresh when needed
        return TokenService.getLocalRefreshToken() !== null;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },
  
  getUserRole: () => {
    const user = TokenService.getUser();
    return user ? user.role : null;
  }
};

export { AuthService, instance as api };