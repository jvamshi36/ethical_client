// Define application routes
const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/',
    DAILY_ALLOWANCE: '/daily-allowance',
    TRAVEL_ALLOWANCE: '/travel-allowance',
    ANALYTICS: '/analytics',
    PROFILE: '/profile',
    
    // Admin routes
    ADMIN: {
      USERS: '/admin/users',
      ROLES: '/admin/roles',
      SETTINGS: '/admin/settings',
    }
  };
  
  export default ROUTES;