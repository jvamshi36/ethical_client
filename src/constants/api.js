// API endpoints
const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
    },
    USERS: {
      BASE: '/users',
      TEAM: '/users/team',
      RESET_PASSWORD: '/users/:id/reset-password',
      USER_TEAM: '/users/:id/team',
    },
    DAILY_ALLOWANCE: {
      BASE: '/da',
      TEAM: '/da/team',
      USER: '/da/user/:id',
      STATUS: '/da/:id/status',
    },
    TRAVEL_ALLOWANCE: {
      BASE: '/ta',
      TEAM: '/ta/team',
      USER: '/ta/user/:id',
      STATUS: '/ta/:id/status',
    },
    CITIES: {
      BASE: '/cities',
      DISTANCE: '/cities/distance',
    },
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      USER: '/analytics/user',
      TEAM: '/analytics/team',
      ADMIN: '/analytics/admin',
      EXPORT: '/analytics/export',
    },
    REFERENCE: {
      DEPARTMENTS: '/reference/departments',
      HEADQUARTERS: '/reference/headquarters',
      ROLES: '/reference/roles',
    }
  };
  
  // Function to replace URL params
  export const buildUrl = (url, params) => {
    let result = url;
    
    if (params) {
      Object.keys(params).forEach(key => {
        result = result.replace(`:${key}`, params[key]);
      });
    }
    
    return result;
  };
  
  export default API_ENDPOINTS;