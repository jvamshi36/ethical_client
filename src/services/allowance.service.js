// Update the DailyAllowanceService object
import { api } from './auth.service';

// Create a debounce mechanism to prevent multiple rapid API calls
let pendingRequests = {};
let lastRequestTimes = {};
const COOLDOWN_MS = 500; // Cooldown period between requests with the same key

const debouncedRequest = (key, apiCall) => {
  const now = Date.now();
  const lastRequestTime = lastRequestTimes[key] || 0;
  const timeSinceLastRequest = now - lastRequestTime;
  
  // If there's already a pending request with this key, return it
  if (pendingRequests[key]) {
    console.log(`Request already in progress: ${key}`);
    return pendingRequests[key];
  }
  
  // If we're within the cooldown period, delay the request
  if (timeSinceLastRequest < COOLDOWN_MS) {
    console.log(`Rate limiting request: ${key}`);
    const delayMs = COOLDOWN_MS - timeSinceLastRequest;
    
    // Create a delayed promise
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Execute the API call after delay
        apiCall()
          .then(response => {
            delete pendingRequests[key];
            lastRequestTimes[key] = Date.now();
            resolve(response);
          })
          .catch(error => {
            delete pendingRequests[key];
            reject(error);
          });
      }, delayMs);
    });
    
    pendingRequests[key] = promise;
    return promise;
  }
  
  // No pending request and outside cooldown period, execute immediately
  const promise = new Promise((resolve, reject) => {
    apiCall()
      .then(response => {
        delete pendingRequests[key];
        lastRequestTimes[key] = Date.now();
        resolve(response);
      })
      .catch(error => {
        delete pendingRequests[key];
        reject(error);
      });
  });
  
  pendingRequests[key] = promise;
  lastRequestTimes[key] = now;
  return promise;
};

const DailyAllowanceService = {
  getUserAllowances: async () => {
    return debouncedRequest('get-user-da', async () => {
      const response = await api.get('/da');
      return response.data;
    });
  },
  
  // Admin method to get all allowances with optional filters
  getAllAllowances: async (filters = {}) => {
    return debouncedRequest('get-all-da-admin', async () => {
      try {
        // Build query params
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.department) queryParams.append('department', filters.department);
        if (filters.headquarters) queryParams.append('headquarters', filters.headquarters);
        
        const response = await api.get(`/da/admin/all?${queryParams.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching all daily allowances:', error);
        return [];
      }
    });
  },
  
  getUserAllowancesByUserId: async (userId, dateParams) => {
    return debouncedRequest(`get-user-da-${userId}`, async () => {
      let url = `/da/user/${userId}`;
      
      // Add date params if provided
      if (dateParams && dateParams.startDate && dateParams.endDate) {
        url += `?startDate=${dateParams.startDate}&endDate=${dateParams.endDate}`;
      }
      
      const response = await api.get(url);
      return response.data;
    });
  },
  
  getAllowanceById: async (id) => {
    return debouncedRequest(`get-da-${id}`, async () => {
      const response = await api.get(`/da/${id}`);
      return response.data;
    });
  },
  
  createAllowance: async (allowanceData) => {
    return debouncedRequest('create-da', async () => {
      const response = await api.post('/da', allowanceData);
      return response.data;
    });
  },
  
  updateAllowance: async (id, allowanceData) => {
    return debouncedRequest(`update-da-${id}`, async () => {
      const response = await api.put(`/da/${id}`, allowanceData);
      return response.data;
    });
  },
  
  deleteAllowance: async (id) => {
    return debouncedRequest(`delete-da-${id}`, async () => {
      const response = await api.delete(`/da/${id}`);
      return response.data;
    });
  },
  
  updateStatus: async (id, status) => {
    return debouncedRequest(`update-da-status-${id}`, async () => {
      const response = await api.patch(`/da/${id}/status`, { status });
      return response.data;
    });
  },
  
  getAllAllowances: async (filters = {}) => {
    return debouncedRequest('get-all-da-admin', async () => {
      try {
        // Build query params
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.department) queryParams.append('department', filters.department);
        if (filters.headquarters) queryParams.append('headquarters', filters.headquarters);
        
        const response = await api.get(`/da/admin/all?${queryParams.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching all daily allowances:', error);
        return [];
      }
    });
  },
  
  getTeamAllowances: async () => {
    return debouncedRequest('get-team-da', async () => {
      try {
        const response = await api.get('/da/team');
        return response.data;
      } catch (error) {
        console.error('Error fetching team daily allowances:', error);
        return [];
      }
    });
  },
};

// Update the TravelAllowanceService object

const TravelAllowanceService = {
  getUserAllowances: async () => {
    return debouncedRequest('get-user-ta', async () => {
      const response = await api.get('/ta');
      return response.data;
    });
  },
  
  // Admin method to get all allowances
  getAllAllowances: async () => {
    return debouncedRequest('get-all-ta', async () => {
      const response = await api.get('/ta/admin/all');
      return response.data;
    });
  },
  
  getUserAllowancesByUserId: async (userId, dateParams) => {
    return debouncedRequest(`get-user-ta-${userId}`, async () => {
      let url = `/ta/user/${userId}`;
      
      // Add date params if provided
      if (dateParams && dateParams.startDate && dateParams.endDate) {
        url += `?startDate=${dateParams.startDate}&endDate=${dateParams.endDate}`;
      }
      
      const response = await api.get(url);
      return response.data;
    });
  },
  
  getAllowanceById: async (id) => {
    return debouncedRequest(`get-ta-${id}`, async () => {
      const response = await api.get(`/ta/${id}`);
      return response.data;
    });
  },
  
  getUserTravelRoutes: async () => {
    return debouncedRequest('get-ta-routes', async () => {
      const response = await api.get('/ta/routes');
      return response.data;
    });
  },
  
  validateRoute: async (fromCity, toCity) => {
    return debouncedRequest(`validate-route-${fromCity}-${toCity}`, async () => {
      try {
        // Check if this route is configured for the user
        const response = await api.post('/ta/validate-route', { fromCity, toCity });
        return response.data;
      } catch (error) {
        // Route validation failed
        console.error('Route validation error:', error);
        throw error;
      }
    });
  },
  
  createAllowance: async (allowanceData) => {
    return debouncedRequest('create-ta', async () => {
      // Then create the allowance
      const response = await api.post('/ta', allowanceData);
      return response.data;
    });
  },
  
  updateAllowance: async (id, allowanceData) => {
    return debouncedRequest(`update-ta-${id}`, async () => {
      const response = await api.put(`/ta/${id}`, allowanceData);
      return response.data;
    });
  },
  
  deleteAllowance: async (id) => {
    return debouncedRequest(`delete-ta-${id}`, async () => {
      const response = await api.delete(`/ta/${id}`);
      return response.data;
    });
  },
  
  updateStatus: async (id, status) => {
    return debouncedRequest(`update-ta-status-${id}`, async () => {
      const response = await api.patch(`/ta/${id}/status`, { status });
      return response.data;
    });
  },
  
  // Use the city routes instead of ta routes for distance calculation
  calculateDistance: async (fromCity, toCity) => {
    return debouncedRequest(`calculate-distance-${fromCity}-${toCity}`, async () => {
      try {
        const response = await api.post('/cities/distance', { fromCity, toCity });
        return response.data;
      } catch (error) {
        console.error('Error calculating distance:', error);
        throw error;
      }
    });
  },
  
  getAllAllowances: async (filters = {}) => {
    return debouncedRequest('get-all-ta-admin', async () => {
      try {
        // Build query params
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.department) queryParams.append('department', filters.department);
        if (filters.headquarters) queryParams.append('headquarters', filters.headquarters);
        
        const response = await api.get(`/ta/admin/all?${queryParams.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching all travel allowances:', error);
        return [];
      }
    });
  },
  
  getTeamAllowances: async () => {
    return debouncedRequest('get-team-ta', async () => {
      try {
        const response = await api.get('/ta/team');
        return response.data;
      } catch (error) {
        console.error('Error fetching team travel allowances:', error);
        return [];
      }
    });
  }
};
export { DailyAllowanceService, TravelAllowanceService };