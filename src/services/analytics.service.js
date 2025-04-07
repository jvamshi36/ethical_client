import { api } from './auth.service';

const AnalyticsService = {
  getDashboardData: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  
  getUserAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await api.get(`/analytics/user?${queryParams.toString()}`);
    return response.data;
  },
  
  getTeamAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.userId) queryParams.append('userId', params.userId);
    
    const response = await api.get(`/analytics/team?${queryParams.toString()}`);
    return response.data;
  },
  
  getAdminAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.headquarters) queryParams.append('headquarters', params.headquarters);
    if (params.department) queryParams.append('department', params.department);
    if (params.userId) queryParams.append('userId', params.userId);
    
    const response = await api.get(`/analytics/admin?${queryParams.toString()}`);
    return response.data;
  },
  
  getDepartmentAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await api.get(`/analytics/department?${queryParams.toString()}`);
    return response.data;
  },
  
  getHeadquartersAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await api.get(`/analytics/headquarters?${queryParams.toString()}`);
    return response.data;
  },
  
  getMonthlyReports: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.year) queryParams.append('year', params.year);
    if (params.month) queryParams.append('month', params.month);
    if (params.headquarters) queryParams.append('headquarters', params.headquarters);
    if (params.department) queryParams.append('department', params.department);
    
    const response = await api.get(`/analytics/monthly?${queryParams.toString()}`);
    return response.data;
  },
  
  exportData: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.headquarters) queryParams.append('headquarters', params.headquarters);
    if (params.department) queryParams.append('department', params.department);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.format) queryParams.append('format', params.format);
    
    const response = await api.get(`/analytics/export?${queryParams.toString()}`, {
      responseType: 'blob'
    });
    
    return response.data;
  }
};

export default AnalyticsService;