// src/services/allowance.service.js
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
  
  getUserTravelRoutes: async () => {
    const response = await api.get('/travel-routes/my-routes');
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
    // First validate the route
    try {
      await TravelAllowanceService.validateRoute(
        allowanceData.fromCity, 
        allowanceData.toCity
      );
      
      // Then create the allowance
      const response = await api.post('/ta', allowanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateAllowance: async (id, allowanceData) => {
    try {
      // First validate the route if it changed
      const currentAllowance = await TravelAllowanceService.getAllowanceById(id);
      
      if (currentAllowance.fromCity !== allowanceData.fromCity || 
          currentAllowance.toCity !== allowanceData.toCity) {
        await TravelAllowanceService.validateRoute(
          allowanceData.fromCity, 
          allowanceData.toCity
        );
      }
      
      // Then update the allowance
      const response = await api.put(`/ta/${id}`, allowanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
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