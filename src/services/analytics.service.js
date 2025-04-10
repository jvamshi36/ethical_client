// Enhanced version of src/services/analytics.service.js

import { api } from './auth.service';

const AnalyticsService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      
      // Ensure we have valid data with defaults for anything missing
      const data = response.data || {};
      
      // Ensure summary exists with default values
      data.summary = data.summary || {
        totalDA: 0,
        totalTA: 0, 
        totalAmount: 0,
        totalEarningsThisMonth: 0,
        totalEarningsLastMonth: 0,
        pendingDA: 0,
        approvedDA: 0,
        pendingTA: 0, 
        approvedTA: 0,
        pendingApprovals: 0,
        approvalRate: 0,
        recentActivity: []
      };
      
      // Ensure charts exists with default arrays
      data.charts = data.charts || {
        monthlyExpenses: [],
        categoryDistribution: [],
        statusDistribution: []
      };
      
      // Ensure other arrays exist
      data.daMonthly = data.daMonthly || [];
      data.taMonthly = data.taMonthly || [];
      data.topRoutes = data.topRoutes || [];
      data.recentActivity = data.recentActivity || [];
      data.teamPerformance = data.teamPerformance || [];
      
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Return a default structure in case of error
      return {
        summary: {
          totalDA: 0,
          totalTA: 0,
          totalAmount: 0,
          totalEarningsThisMonth: 0,
          totalEarningsLastMonth: 0,
          pendingDA: 0,
          approvedDA: 0,
          pendingTA: 0,
          approvedTA: 0,
          pendingApprovals: 0,
          approvalRate: 0,
          recentActivity: []
        },
        charts: {
          monthlyExpenses: [],
          categoryDistribution: [],
          statusDistribution: []
        },
        daMonthly: [],
        taMonthly: [],
        topRoutes: [],
        recentActivity: [],
        teamPerformance: []
      };
    }
  },
  
  getUserAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get(`/analytics/user?${queryParams.toString()}`);
      return response.data || {
        summary: {
          totalDA: 0,
          totalTA: 0,
          totalAmount: 0,
          approvalRate: 0
        },
        charts: {
          monthlyExpenses: [],
          categoryDistribution: [],
          statusDistribution: []
        }
      };
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return {
        summary: {
          totalDA: 0,
          totalTA: 0,
          totalAmount: 0,
          approvalRate: 0
        },
        charts: {
          monthlyExpenses: [],
          categoryDistribution: [],
          statusDistribution: []
        }
      };
    }
  },
  
  getTeamAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.userId) queryParams.append('userId', params.userId);
      
      const response = await api.get(`/analytics/team?${queryParams.toString()}`);
      return response.data || {
        summary: {
          totalDA: 0,
          totalTA: 0,
          totalAmount: 0,
          approvalRate: 0
        },
        teamMembers: [],
        charts: {
          teamPerformance: [],
          monthlyComparison: []
        }
      };
    } catch (error) {
      console.error('Error fetching team analytics:', error);
      return {
        summary: {
          totalDA: 0,
          totalTA: 0,
          totalAmount: 0,
          approvalRate: 0
        },
        teamMembers: [],
        charts: {
          teamPerformance: [],
          monthlyComparison: []
        }
      };
    }
  },
  
  getAdminAnalytics: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.headquarters) queryParams.append('headquarters', params.headquarters);
      if (params.department) queryParams.append('department', params.department);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.role) queryParams.append('role', params.role);
      
      const response = await api.get(`/analytics/admin?${queryParams.toString()}`);
      return response.data || {
        summary: {
          totalUsers: 0,
          activeUsers: 0,
          totalAllowances: 0,
          pendingApprovals: 0
        },
        charts: {
          userDistribution: [],
          allowanceDistribution: [],
          departmentComparison: []
        }
      };
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      return {
        summary: {
          totalUsers: 0,
          activeUsers: 0,
          totalAllowances: 0,
          pendingApprovals: 0
        },
        charts: {
          userDistribution: [],
          allowanceDistribution: [],
          departmentComparison: []
        }
      };
    }
  },
  
  exportData: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.headquarters) queryParams.append('headquarters', params.headquarters);
      if (params.department) queryParams.append('department', params.department);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.role) queryParams.append('role', params.role);
      if (params.format) queryParams.append('format', params.format);
      
      const response = await api.get(`/analytics/export?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-report-${new Date().toISOString().split('T')[0]}.${params.format || 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
};

export default AnalyticsService;