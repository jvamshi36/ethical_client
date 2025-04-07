import { api } from './auth.service';

const UserService = {
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.department) params.append('department', filters.department);
    if (filters.headquarters) params.append('headquarters', filters.headquarters);
    if (filters.status !== 'all') params.append('isActive', filters.status === 'active');
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },
  
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
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