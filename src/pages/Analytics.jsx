import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Alert, 
  CircularProgress, Tabs, Tab, FormControl, 
  InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FilterList, GetApp } from '@mui/icons-material';
import { format, subMonths } from 'date-fns';
import PageContainer from '../components/layout/PageContainer';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsService from '../services/analytics.service';
import '../styles/components/dashboard.css';

const Analytics = () => {
  const { currentUser, isManager, isAdmin } = useAuth();
  
  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalDA: 0,
      totalTA: 0,
      totalAmount: 0,
      approvalRate: 0
    },
    charts: {
      monthlyExpenses: [],
      expenseCategories: [],
      statusDistribution: [],
      departmentComparison: [],
      userRankings: []
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    startDate: subMonths(new Date(), 6),
    endDate: new Date(),
    department: '',
    headquarters: '',
    userId: 'current'
  });
  
  const [departments, setDepartments] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchReferenceData();
    fetchAnalyticsData();
  }, []);
  
  const fetchReferenceData = async () => {
    try {
      // Fetch reference data for filters
      // This would typically come from your API
      
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
      
      if (isManager() || isAdmin()) {
        setUsers([
          { id: 1, fullName: 'John Doe' },
          { id: 2, fullName: 'Jane Smith' },
          { id: 3, fullName: 'Robert Johnson' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching reference data:', err);
    }
  };
  
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Prepare filter params
      const params = {
        startDate: format(filters.startDate, 'yyyy-MM-dd'),
        endDate: format(filters.endDate, 'yyyy-MM-dd')
      };
      
      if (filters.department) params.department = filters.department;
      if (filters.headquarters) params.headquarters = filters.headquarters;
      if (filters.userId && filters.userId !== 'current') params.userId = filters.userId;
      
      // Call appropriate analytics endpoint based on user role
      let response = {
        summary: {
          totalDA: 0,
          totalTA: 0,
          totalAmount: 0,
          approvalRate: 0
        },
        charts: {
          monthlyExpenses: [],
          expenseCategories: [],
          statusDistribution: [],
          departmentComparison: [],
          userRankings: []
        }
      };
      
      try {
        if (isAdmin()) {
          response = await AnalyticsService.getAdminAnalytics(params);
        } else if (isManager()) {
          response = await AnalyticsService.getTeamAnalytics(params);
        } else {
          response = await AnalyticsService.getUserAnalytics(params);
        }
      } catch (err) {
        console.error('Error fetching analytics from service:', err);
        // Keep the default response structure
      }
      
      // Ensure we have valid data
      if (!response.summary) {
        response.summary = {
          totalDA: 0,
          totalTA: 0,
          totalAmount: 0,
          approvalRate: 0
        };
      }
      
      if (!response.charts) {
        response.charts = {
          monthlyExpenses: [],
          expenseCategories: [],
          statusDistribution: [],
          departmentComparison: [],
          userRankings: []
        };
      }
      
      setAnalyticsData(response);
    } catch (err) {
      setError('Failed to load analytics data. Please try again later.');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
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
    setFilters({
      ...filters,
      [field]: date
    });
  };
  
  const applyFilters = () => {
    fetchAnalyticsData();
  };
  
  const resetFilters = () => {
    setFilters({
      startDate: subMonths(new Date(), 6),
      endDate: new Date(),
      department: '',
      headquarters: '',
      userId: 'current'
    });
  };
  
  const handleExport = async () => {
    try {
      const params = {
        startDate: format(filters.startDate, 'yyyy-MM-dd'),
        endDate: format(filters.endDate, 'yyyy-MM-dd'),
        format: 'xlsx'
      };
      
      if (filters.department) params.department = filters.department;
      if (filters.headquarters) params.headquarters = filters.headquarters;
      if (filters.userId && filters.userId !== 'current') params.userId = filters.userId;
      
      const blob = await AnalyticsService.exportData(params);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-report-${format(new Date(), 'yyyyMMdd')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data. Please try again later.');
      console.error('Error exporting data:', err);
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }
    
    // Ensure charts exist with defaults
    const charts = analyticsData.charts || {};
    const monthlyExpenses = charts.monthlyExpenses || [];
    const expenseCategories = charts.expenseCategories || [];
    const statusDistribution = charts.statusDistribution || [];
    const departmentComparison = charts.departmentComparison || [];
    const userRankings = charts.userRankings || [];
    
    switch (tabValue) {
        case 0: // Monthly Expenses
          return (
            <Paper className="analytics-panel">
              <Typography variant="h6" className="panel-title">
                Monthly Expense Trends
              </Typography>
              <ExpenseChart
                type="line"
                data={monthlyExpenses}
                height={400}
              />
            </Paper>
          );
          
        case 1: // Category Analysis
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Paper className="analytics-panel">
                  <Typography variant="h6" className="panel-title">
                    Expense Categories
                  </Typography>
                  <ExpenseChart
                    type="bar"
                    data={expenseCategories}
                    height={400}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper className="analytics-panel">
                  <Typography variant="h6" className="panel-title">
                    Category Distribution
                  </Typography>
                  <ExpenseChart
                    type="pie"
                    data={expenseCategories}
                    height={400}
                  />
                </Paper>
              </Grid>
            </Grid>
          );
          
        case 2: // Status Analysis
          return (
            <Paper className="analytics-panel">
              <Typography variant="h6" className="panel-title">
                Approval Status Distribution
              </Typography>
              <ExpenseChart
                type="pie"
                data={statusDistribution}
                height={400}
              />
            </Paper>
          );
          
        case 3: // Department/Team Analysis (Manager/Admin only)
          if (!isManager() && !isAdmin()) {
            return (
              <Alert severity="info">
                You don't have permission to view team analytics.
              </Alert>
            );
          }
          
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className="analytics-panel">
                  <Typography variant="h6" className="panel-title">
                    Department Comparison
                  </Typography>
                  <ExpenseChart
                    type="bar"
                    data={departmentComparison}
                    height={400}
                  />
                </Paper>
              </Grid>
              {isAdmin() && (
                <Grid item xs={12}>
                  <Paper className="analytics-panel">
                    <Typography variant="h6" className="panel-title">
                      Top Users by Expense
                    </Typography>
                    <ExpenseChart
                      type="bar"
                      data={userRankings}
                      height={400}
                    />
                  </Paper>
                </Grid>
              )}
            </Grid>
          );
          
        default:
          return null;
      }
    };
    
    return (
      <PageContainer 
        title="Analytics & Reports" 
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
              variant="contained"
              startIcon={<GetApp />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Box>
        }
      >
        {/* Filters Panel */}
        {showFilters && (
          <Paper sx={{ p: 3, mb: 3 }} className="filters-panel">
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              {(isManager() || isAdmin()) && (
                <>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={filters.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        label="Department"
                      >
                        <MenuItem value="">All Departments</MenuItem>
                        {departments.map(dept => (
                          <MenuItem key={dept.id} value={dept.name}>
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
                        {headquarters.map(hq => (
                          <MenuItem key={hq.id} value={hq.name}>
                            {hq.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>User</InputLabel>
                      <Select
                        value={filters.userId}
                        onChange={(e) => handleFilterChange('userId', e.target.value)}
                        label="User"
                      >
                        <MenuItem value="current">Current User</MenuItem>
                        <MenuItem value="all">All Users</MenuItem>
                        {users.map(user => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.fullName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              
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
        
        {/* Analytics Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="summary-card">
              <Typography variant="subtitle1" color="textSecondary">
                Total Daily Allowance
              </Typography>
              <Typography variant="h4" className="summary-value">
                ${(analyticsData.summary?.totalDA || 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="summary-card">
              <Typography variant="subtitle1" color="textSecondary">
                Total Travel Allowance
              </Typography>
              <Typography variant="h4" className="summary-value">
                ${(analyticsData.summary?.totalTA || 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="summary-card">
              <Typography variant="subtitle1" color="textSecondary">
                Total Expenses
              </Typography>
              <Typography variant="h4" className="summary-value">
                ${(analyticsData.summary?.totalAmount || 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="summary-card">
              <Typography variant="subtitle1" color="textSecondary">
                Approval Rate
              </Typography>
              <Typography variant="h4" className="summary-value">
                {(analyticsData.summary?.approvalRate || 0).toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Monthly Trend" />
            <Tab label="Category Analysis" />
            <Tab label="Status Breakdown" />
            {(isManager() || isAdmin()) && <Tab label="Team Comparison" />}
          </Tabs>
        </Paper>
        
        {/* Tab Content */}
        {renderContent()}
        
      </PageContainer>
    );
  };
  
  export default Analytics;