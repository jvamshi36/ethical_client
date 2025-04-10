// Update the DailyAllowanceService object
import { api } from './auth.service';
const DailyAllowanceService = {
  getUserAllowances: async () => {
    const response = await api.get('/da');
    return response.data;
  },
  
  // Admin method to get all allowances
  getAllAllowances: async () => {
    const response = await api.get('/da/admin/all');
    return response.data;
  },
  
  getUserAllowancesByUserId: async (userId, dateParams) => {
    let url = `/da/user/${userId}`;
    
    // Add date params if provided
    if (dateParams && dateParams.startDate && dateParams.endDate) {
      url += `?startDate=${dateParams.startDate}&endDate=${dateParams.endDate}`;
    }
    
    const response = await api.get(url);
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

// Update the TravelAllowanceService object

const TravelAllowanceService = {
  getUserAllowances: async () => {
    const response = await api.get('/ta');
    return response.data;
  },
  
  // Admin method to get all allowances
  getAllAllowances: async () => {
    const response = await api.get('/ta/admin/all');
    return response.data;
  },
  
  getUserAllowancesByUserId: async (userId, dateParams) => {
    let url = `/ta/user/${userId}`;
    
    // Add date params if provided
    if (dateParams && dateParams.startDate && dateParams.endDate) {
      url += `?startDate=${dateParams.startDate}&endDate=${dateParams.endDate}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  getAllowanceById: async (id) => {
    const response = await api.get(`/ta/${id}`);
    return response.data;
  },
  
  getUserTravelRoutes: async () => {
    const response = await api.get('/ta/routes');
    return response.data;
  },
  
  validateRoute: async (fromCity, toCity) => {
    try {
      // Check if this route is configured for the user
      const response = await api.post('/ta/validate-route', { fromCity, toCity });
      return response.data;
    } catch (error) {
      // Route validation failed
      console.error('Route validation error:', error);
      throw error;
    }
  },
  
  createAllowance: async (allowanceData) => {
    // Then create the allowance
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
  
  // Use the city routes instead of ta routes for distance calculation
  calculateDistance: async (fromCity, toCity) => {
    try {
      const response = await api.post('/cities/distance', { fromCity, toCity });
      return response.data;
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }
};
export { DailyAllowanceService, TravelAllowanceService };