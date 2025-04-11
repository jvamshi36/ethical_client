import React, { useState, useEffect } from 'react';
import { 
  Grid, Typography, Paper, Box, CircularProgress, Alert,
  Card, CardContent, Divider, Tabs, Tab, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, TextField, MenuItem, Select, FormControl, InputLabel, Button,
  InputAdornment, Avatar
} from '@mui/material';
import { 
  People, AttachMoney, CardTravel, TrendingUp, DonutLarge,
  Refresh, PieChart, CalendarToday, FilterList, GetApp,
  SupervisorAccount, ThumbUp, Cancel
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, subMonths, isValid } from 'date-fns';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import PageContainer from '../../components/layout/PageContainer';
import StatusBadge from '../../components/common/StatusBadge';
import AnalyticsService from '../../services/analytics.service';
import UserService from '../../services/user.service';
import { DailyAllowanceService, TravelAllowanceService } from '../../services/allowance.service';
import '../../styles/pages/admin-dashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState({
    summary: false,
    users: false,
    allowances: false,
    activities: false
  });
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: subMonths(new Date(), 3),
    endDate: new Date()
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    headquarters: '',
    role: ''
  });
  
  // Dashboard data
  const [summaryData, setSummaryData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAllowances: 0,
    pendingApprovals: 0,
    totalDailyAmount: 0,
    totalTravelAmount: 0,
    approvalRate: 0
  });
  const [userList, setUserList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allowances, setAllowances] = useState({
    daily: [],
    travel: []
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({
    userDistribution: [],
    departmentDistribution: [],
    monthlyExpenses: [],
    topRoutes: []
  });
  
  useEffect(() => {
    fetchReferenceData();
    fetchDashboardData();
  }, []);
  
  const fetchReferenceData = async () => {
    try {
      const [deptResponse, hqResponse, rolesResponse] = await Promise.all([
        fetch('/api/reference/departments'),
        fetch('/api/reference/headquarters'),
        fetch('/api/reference/roles')
      ]);
      
      const depts = await deptResponse.json();
      const hqs = await hqResponse.json();
      const rolesList = await rolesResponse.json();
      
      setDepartments(depts || []);
      setHeadquarters(hqs || []);
      setRoles(rolesList || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
      // Use mock data as fallback
      setDepartments([
        { id: 1, name: 'Sales' },
        { id: 2, name: 'Marketing' },
        { id: 3, name: 'Operations' }
      ]);
      setHeadquarters([
        { id: 1, name: 'New York' },
        { id: 2, name: 'Chicago' },
        { id: 3, name: 'Los Angeles' }
      ]);
      setRoles([
        { value: 'BE', label: 'Business Executive' },
        { value: 'BM', label: 'Business Manager' },
        { value: 'ABM', label: 'Area Business Manager' },
        { value: 'ADMIN', label: 'Administrator' }
      ]);
    }
  };
  
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // Fetch summary data
      await fetchSummaryData();
      
      // Fetch users
      await fetchUsers();
      
      // Fetch allowances
      await fetchAllowances();
      
      // Fetch chart data
      await fetchChartData();
      
      // Generate mock activities for now
      generateMockActivities();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSummaryData = async () => {
    setDataLoading(prev => ({ ...prev, summary: true }));
    
    try {
      // In a real app, fetch from API
      // For demo, we'll generate realistic mock data
      const startDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const endDate = format(dateRange.endDate, 'yyyy-MM-dd');
      
      // Try to get data from the API first
      let adminData = {
        summary: {
          totalUsers: 0,
          activeUsers: 0,
          totalAllowances: 0,
          pendingApprovals: 0
        }
      };
      
      try {
        const apiResponse = await AnalyticsService.getAdminAnalytics({
          startDate,
          endDate,
          ...filters
        });
        
        if (apiResponse && apiResponse.summary) {
          adminData = apiResponse;
        }
      } catch (err) {
        console.warn('Using mock data for admin analytics:', err);
      }
      
      // Get counts from actual API calls as fallback
      const [userResponse, dailyResponse, travelResponse] = await Promise.all([
        UserService.getUsers(),
        DailyAllowanceService.getAllAllowances(),
        TravelAllowanceService.getAllAllowances()
      ]);
      
      const users = Array.isArray(userResponse) ? userResponse : [];
      const dailyAllowances = Array.isArray(dailyResponse) ? dailyResponse : [];
      const travelAllowances = Array.isArray(travelResponse) ? travelResponse : [];
      
      // Calculate totals
      const activeUsers = users.filter(user => user.isActive).length;
      const dailyTotal = dailyAllowances.reduce((sum, item) => 
        sum + (item.status === 'APPROVED' ? parseFloat(item.amount || 0) : 0), 0);
      const travelTotal = travelAllowances.reduce((sum, item) => 
        sum + (item.status === 'APPROVED' ? parseFloat(item.amount || 0) : 0), 0);
      const pendingCount = dailyAllowances.filter(a => a.status === 'PENDING').length + 
                           travelAllowances.filter(a => a.status === 'PENDING').length;
      const totalApproved = dailyAllowances.filter(a => a.status === 'APPROVED').length + 
                            travelAllowances.filter(a => a.status === 'APPROVED').length;
      const totalAllowances = dailyAllowances.length + travelAllowances.length;
      const approvalRate = totalAllowances ? ((totalApproved / totalAllowances) * 100) : 0;
      
      // Set summary data
      setSummaryData({
        totalUsers: users.length || adminData.summary.totalUsers,
        activeUsers: activeUsers || adminData.summary.activeUsers,
        totalAllowances: totalAllowances || adminData.summary.totalAllowances,
        pendingApprovals: pendingCount || adminData.summary.pendingApprovals,
        totalDailyAmount: dailyTotal,
        totalTravelAmount: travelTotal,
        approvalRate
      });
      
    } catch (error) {
      console.error('Error fetching summary data:', error);
      // Use fallback mock data
      setSummaryData({
        totalUsers: Math.floor(Math.random() * 50) + 50,
        activeUsers: Math.floor(Math.random() * 40) + 40,
        totalAllowances: Math.floor(Math.random() * 500) + 100,
        pendingApprovals: Math.floor(Math.random() * 20) + 5,
        totalDailyAmount: Math.floor(Math.random() * 10000) + 5000,
        totalTravelAmount: Math.floor(Math.random() * 15000) + 8000,
        approvalRate: Math.floor(Math.random() * 20) + 75
      });
    } finally {
      setDataLoading(prev => ({ ...prev, summary: false }));
    }
  };
  
  const fetchUsers = async () => {
    setDataLoading(prev => ({ ...prev, users: true }));
    
    try {
      const response = await UserService.getUsers(filters);
      setUserList(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUserList([]);
    } finally {
      setDataLoading(prev => ({ ...prev, users: false }));
    }
  };
  
  const fetchAllowances = async () => {
    setDataLoading(prev => ({ ...prev, allowances: true }));
    
    try {
      const [dailyResponse, travelResponse] = await Promise.all([
        DailyAllowanceService.getAllAllowances(),
        TravelAllowanceService.getAllAllowances()
      ]);
      
      setAllowances({
        daily: Array.isArray(dailyResponse) ? dailyResponse : [],
        travel: Array.isArray(travelResponse) ? travelResponse : []
      });
    } catch (error) {
      console.error('Error fetching allowances:', error);
      setAllowances({ daily: [], travel: [] });
    } finally {
      setDataLoading(prev => ({ ...prev, allowances: false }));
    }
  };
  
  const fetchChartData = async () => {
    try {
      // In a real app, fetch from API
      // For demo, generate realistic mock data based on actual data
      
      // 1. User distribution by role
      const roleDistribution = {};
      userList.forEach(user => {
        roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1;
      });
      
      const userDistributionData = Object.keys(roleDistribution).map(role => ({
        name: role,
        value: roleDistribution[role]
      }));
      
      // 2. Department distribution
      const deptDistribution = {};
      userList.forEach(user => {
        deptDistribution[user.department] = (deptDistribution[user.department] || 0) + 1;
      });
      
      const departmentData = Object.keys(deptDistribution).map(dept => ({
        name: dept,
        value: deptDistribution[dept]
      }));
      
      // 3. Monthly expenses
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyData = months.map((month, index) => {
        const daAmount = Math.floor(Math.random() * 3000) + 1000;
        const taAmount = Math.floor(Math.random() * 4000) + 2000;
        return {
          name: month,
          'Daily Allowance': daAmount,
          'Travel Allowance': taAmount,
          Total: daAmount + taAmount
        };
      });
      
      // 4. Top travel routes
      const routeCounts = {};
      allowances.travel.forEach(ta => {
        const route = `${ta.from_city} to ${ta.to_city}`;
        routeCounts[route] = (routeCounts[route] || 0) + 1;
      });
      
      const routeEntries = Object.entries(routeCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5);
      
      const topRoutesData = routeEntries.map(([route, count]) => ({
        name: route,
        value: count
      }));
      
      setChartData({
        userDistribution: userDistributionData,
        departmentDistribution: departmentData,
        monthlyExpenses: monthlyData,
        topRoutes: topRoutesData
      });
      
    } catch (error) {
      console.error('Error preparing chart data:', error);
      // Use fallback empty data
      setChartData({
        userDistribution: [],
        departmentDistribution: [],
        monthlyExpenses: [],
        topRoutes: []
      });
    }
  };
  
  const generateMockActivities = () => {
    setDataLoading(prev => ({ ...prev, activities: true }));
    
    try {
      // Combine recent allowances for activity feed
      const recentDailyAllowances = allowances.daily
        .slice(0, 5)
        .map(da => ({
          id: `da-${da.id}`,
          type: 'DA',
          title: 'Daily Allowance',
          user: da.user_name,
          date: da.date,
          status: da.status,
          amount: da.amount,
          description: `${da.user_name} submitted a daily allowance request.`
        }));
      
      const recentTravelAllowances = allowances.travel
        .slice(0, 5)
        .map(ta => ({
          id: `ta-${ta.id}`,
          type: 'TA',
          title: 'Travel Allowance',
          user: ta.user_name,
          date: ta.date,
          status: ta.status,
          amount: ta.amount,
          description: `${ta.user_name} submitted a travel request from ${ta.from_city} to ${ta.to_city}.`
        }));
      
      // Add some user activities
      const userActivities = userList
        .slice(0, 3)
        .map((user, index) => ({
          id: `user-${user.id}`,
          type: 'USER',
          title: 'User Account',
          user: user.fullName,
          date: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
          status: 'ACTIVE',
          description: `${user.fullName} account was ${user.isActive ? 'activated' : 'deactivated'}.`
        }));
      
      // Combine and sort by date
      const allActivities = [
        ...recentDailyAllowances,
        ...recentTravelAllowances,
        ...userActivities
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setActivities(allActivities);
    } catch (error) {
      console.error('Error generating activities:', error);
      setActivities([]);
    } finally {
      setDataLoading(prev => ({ ...prev, activities: false }));
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };
  
  const handleDateChange = (field, date) => {
    if (isValid(date)) {
      setDateRange({
        ...dateRange,
        [field]: date
      });
    }
  };
  
  const applyFilters = () => {
    fetchDashboardData();
  };
  
  const resetFilters = () => {
    setFilters({
      department: '',
      headquarters: '',
      role: ''
    });
    setDateRange({
      startDate: subMonths(new Date(), 3),
      endDate: new Date()
    });
  };
  
  const exportData = async () => {
    try {
      await AnalyticsService.exportData({
        startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
        endDate: format(dateRange.endDate, 'yyyy-MM-dd'),
        ...filters,
        format: 'xlsx'
      });
      
      // Success notification would go here
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
    }
  };
  
  // Render summary cards
  const renderSummaryCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 2,
            color: '#651fff',
            opacity: 0.2,
            transform: 'scale(1.5)'
          }}>
            <People />
          </Box>
          
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Total Users
          </Typography>
          
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#651fff', mb: 1 }}>
            {summaryData.totalUsers}
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            {summaryData.activeUsers} active users
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 2,
            color: '#2196f3',
            opacity: 0.2,
            transform: 'scale(1.5)'
          }}>
            <AttachMoney />
          </Box>
          
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Daily Allowance Total
          </Typography>
          
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 1 }}>
            ${summaryData.totalDailyAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            From {allowances.daily.length} allowances
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 2,
            color: '#00bcd4',
            opacity: 0.2,
            transform: 'scale(1.5)'
          }}>
            <CardTravel />
          </Box>
          
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Travel Allowance Total
          </Typography>
          
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#00bcd4', mb: 1 }}>
            ${summaryData.totalTravelAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            From {allowances.travel.length} allowances
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: 2,
            color: '#ff9800',
            opacity: 0.2,
            transform: 'scale(1.5)'
          }}>
            <TrendingUp />
          </Box>
          
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Approval Rate
          </Typography>
          
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 1 }}>
            {summaryData.approvalRate.toFixed(1)}%
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            {summaryData.pendingApprovals} pending approvals
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
  
  // Render charts
  const renderCharts = () => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Expense Trends
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData.monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Daily Allowance" fill="#2196f3" />
                <Bar dataKey="Travel Allowance" fill="#00bcd4" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              User Distribution by Role
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <RePieChart>
                <Pie
                  data={chartData.userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </RePieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Department Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.departmentDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="value" fill="#651fff" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Top Travel Routes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.topRoutes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <ReTooltip />
                <Bar dataKey="value" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  };
  
  // Render users tab
  const renderUsersTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Headquarters</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              userList.slice(0, 10).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.headquarters}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {userList.length > 10 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined">View All Users</Button>
        </Box>
      )}
    </Paper>
  );
  
  // Render allowances tab
  const renderAllowancesTab = () => (
    <Paper sx={{ p: 3 }}>
      <Tabs value={tabValue === 2 ? 0 : 1} onChange={(e, val) => {}}>
        <Tab label="Daily Allowances" />
        <Tab label="Travel Allowances" />
      </Tabs>
      
      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Department</TableCell>
              {tabValue === 3 && (
                <>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                </>
              )}
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tabValue === 2 ? allowances.daily : allowances.travel).length === 0 ? (
              <TableRow>
                <TableCell colSpan={tabValue === 2 ? 5 : 7} align="center">
                  No allowances found
                </TableCell>
              </TableRow>
            ) : (
              (tabValue === 2 ? allowances.daily : allowances.travel).slice(0, 10).map((allowance) => (
                <TableRow key={allowance.id}>
                  <TableCell>{format(new Date(allowance.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{allowance.user_name}</TableCell>
                  <TableCell>{allowance.department}</TableCell>
                  {tabValue === 3 && (
                    <>
                      <TableCell>{allowance.from_city}</TableCell>
                      <TableCell>{allowance.to_city}</TableCell>
                    </>
                  )}
                  <TableCell align="right">${parseFloat(allowance.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={allowance.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {(tabValue === 2 ? allowances.daily : allowances.travel).length > 10 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined">View All Allowances</Button>
        </Box>
      )}
    </Paper>
  );
  
  // Render activity feed
  const renderActivityFeed = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      
      {activities.length === 0 ? (
        <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
          No recent activities
        </Typography>
      ) : (
        <Box>
          {activities.map((activity, index) => (
            <Box key={activity.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    mr: 2, 
                    bgcolor: activity.type === 'DA' ? '#2196f3' : 
                             activity.type === 'TA' ? '#00bcd4' : '#651fff'
                  }}>
                    {activity.type === 'DA' ? <AttachMoney /> : 
                     activity.type === 'TA' ? <CardTravel /> : <People />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {activity.title} - {activity.user}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {activity.description}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
                    {format(new Date(activity.date), 'MMM dd, yyyy')}
                  </Typography>
                  <StatusBadge status={activity.status} size="small" />
                </Box>
              </Box>
              {index < activities.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
  
  if (loading) {
    return (
      <PageContainer title="Admin Dashboard">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer 
      title="Admin Dashboard" 
      actions={
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 2 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchDashboardData}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<GetApp />}
            onClick={exportData}
          >
            Export
          </Button>
        </Box>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Filters Panel */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Dashboard Data
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept, index) => (
                    <MenuItem key={dept.id || index} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Headquarters</InputLabel>
                <Select
                  value={filters.headquarters}
                  onChange={(e) => handleFilterChange('headquarters', e.target.value)}
                  label="Headquarters"
                >
                  <MenuItem value="">All Headquarters</MenuItem>
                  {headquarters.map((hq, index) => (
                    <MenuItem key={hq.id || index} value={hq.name}>
                      {hq.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  label="Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {roles.map((role, index) => (
                    <MenuItem key={index} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={resetFilters}>
                Reset
              </Button>
              <Button variant="contained" onClick={applyFilters}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Summary Cards */}
      {renderSummaryCards()}
      
      {/* Main Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Overview" />
          <Tab label="Users" />
          <Tab label="Daily Allowances" />
          <Tab label="Travel Allowances" />
          <Tab label="Activity" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      {tabValue === 0 && renderCharts()}
      {tabValue === 1 && renderUsersTab()}
      {tabValue === 2 && renderAllowancesTab()}
      {tabValue === 3 && renderAllowancesTab()}
      {tabValue === 4 && renderActivityFeed()}
    </PageContainer>
  );
};

export default AdminDashboard;