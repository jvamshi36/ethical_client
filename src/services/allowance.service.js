import { api } from './auth.service';

// Daily Allowance Service
const DailyAllowanceService = {
  getUserAllowances: async () => {
    const response = await api.get('/da');
    return response.data;
  },
  
  getTeamAllowances: async () => {
    const response = await api.get('/da/team');
    return response.data;
  },
  
  getUserAllowancesByUserId: async (userId) => {
    const response = await api.get(`/da/user/${userId}`);
    return response.data;
  },
  
  getAllowanceById: async (id) => {
    const response = await api.get(`/da/${id}`);
    return response.data;
  },
  
  createAllowance: async (allowanceData) => {
    const response = await api.post('/da', allowanceData);
    return response.data;
  },
  
  updateAllowance: async (id, allowanceData) => {
    const response = await api.put(`/da/${id}`, allowanceData);
    return response.data;
  },
  
  deleteAllowance: async (id) => {
    const response = await api.delete(`/da/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/da/${id}/status`, { status });
    return response.data;
  }
};

// Travel Allowance Service
const TravelAllowanceService = {
  getUserAllowances: async () => {
    const response = await api.get('/ta');
    return response.data;
  },
  
  getTeamAllowances: async () => {
    const response = await api.get('/ta/team');
    return response.data;
  },
  
  getUserAllowancesByUserId: async (userId) => {
    const response = await api.get(`/ta/user/${userId}`);
    return response.data;
  },
  
  getAllowanceById: async (id) => {
    const response = await api.get(`/ta/${id}`);
    return response.data;
  },
  
  createAllowance: async (allowanceData) => {
    const response = await api.post('/ta', allowanceData);
    return response.data;
  },
  
  updateAllowance: async (id, allowanceData) => {
    const response = await api.put(`/ta/${id}`, allowanceData);
    return response.data;
  },
  
  deleteAllowance: async (id) => {
    const response = await api.delete(`/ta/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/ta/${id}/status`, { status });
    return response.data;
  },
  
  calculateDistance: async (fromCity, toCity) => {
    const response = await api.post('/cities/distance', { fromCity, toCity });
    return response.data;
  }
};

export { DailyAllowanceService, TravelAllowanceService };