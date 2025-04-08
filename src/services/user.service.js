import { api } from './auth.service';


// src/services/config.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserService = {
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // More explicit parameter handling
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    
    // More precise status handling
    if (filters.status) {
      if (filters.status === 'active') {
        params.append('isActive', 'true');
      } else if (filters.status === 'inactive') {
        params.append('isActive', 'false');
      }
    }
    
    // Log the actual params being sent
    console.log('Fetching users with params:', params.toString());
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  createUser: async (userData) => {
    try {
      console.log('Creating user with data:', userData);
      console.log('Full API URL:', `${API_URL}/users`);
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },
  
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  getUserTeam: async (id) => {
    const response = await api.get(`/users/${id}/team`);
    return response.data;
  },
  
  updateUserTeam: async (id, teamMembers) => {
    const response = await api.post(`/users/${id}/team`, { teamMembers });
    return response.data;
  },
  
  resetPassword: async (id, newPassword) => {
    const response = await api.post(`/users/${id}/reset-password`, { newPassword });
    return response.data;
  },
  
  updateUserStatus: async (id, isActive) => {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  },
  
  getUserHierarchy: async () => {
    const response = await api.get('/users/hierarchy');
    return response.data;
  }
};

export default UserService;