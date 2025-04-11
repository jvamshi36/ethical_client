import React, { useState, useEffect } from 'react';
import { 
  Grid, Typography, Box, Paper, CircularProgress, Alert
} from '@mui/material';
import { 
  AttachMoney, CardTravel, TrendingUp, Notifications,
  Receipt, Assignment, Check, Warning, Block, Flight
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import AnalyticsService from '../services/analytics.service';
import ExpenseChart from '../components/charts/ExpenseChart';
import ActivityList from '../components/dashboard/ActivityList';
import '../styles/pages/dashboard.css'; // Updated path to match the CSS file location


// Add additional CSS for chart improvements


const Dashboard = () => {
  const { currentUser, isManager } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalDA: 0,
      totalTA: 0,
      totalAmount: 0,
      pendingApprovals: [],
      recentActivity: []
    },
    charts: {
      monthlyExpenses: [],
      categoryDistribution: [],
      statusDistribution: []
    }
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await AnalyticsService.getDashboardData();
      setDashboardData(response);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <PageContainer title="Dashboard">
        <Box className="loading-container" display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress className="loading-spinner" />
          <Typography>Loading dashboard data...</Typography>
        </Box>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer title="Dashboard">
        <Box className="error-container">
          <Alert severity="error" className="error-message">
            {error}
          </Alert>
        </Box>
      </PageContainer>
    );
  }
  
  // Extract data with fallbacks for safe rendering
  const summary = dashboardData.summary || {};
  const totalDA = summary.totalDA || 0;
  const totalTA = summary.totalTA || 0;
  const totalAmount = summary.totalAmount || 0;
  const pendingApprovals = summary.pendingApprovals || [];
  const pendingCount = Array.isArray(pendingApprovals) ? pendingApprovals.length : 0;
  const recentActivity = summary.recentActivity || [];
  
  const charts = dashboardData.charts || {};
  const monthlyExpenses = charts.monthlyExpenses || [];
  const categoryDistribution = charts.categoryDistribution || [];
  const statusDistribution = charts.statusDistribution || [];
  
  // Sample data for demonstration if no real data exists
  const sampleMonthlyExpenses = monthlyExpenses.length > 0 ? monthlyExpenses : [
    { name: 'Jan', da: 1200, ta: 600, total: 1800 },
    { name: 'Feb', da: 1400, ta: 800, total: 2200 },
    { name: 'Mar', da: 1100, ta: 700, total: 1800 },
    { name: 'Apr', da: 1300, ta: 900, total: 2200 },
    { name: 'May', da: 1600, ta: 1100, total: 2700 },
    { name: 'Jun', da: 1800, ta: 1300, total: 3100 },
    { name: 'Jul', da: 1500, ta: 900, total: 2400 },
    { name: 'Aug', da: 1700, ta: 1200, total: 2900 },
    { name: 'Sep', da: 1900, ta: 1400, total: 3300 },
    { name: 'Oct', da: 1200, ta: 1000, total: 2200 },
    { name: 'Nov', da: 1300, ta: 850, total: 2150 },
    { name: 'Dec', da: 1400, ta: 750, total: 2150 }
  ];

  const sampleCategoryDistribution = categoryDistribution.length > 0 ? categoryDistribution : [
    { name: 'Hotel', value: 900 },
    { name: 'Food', value: 600 },
    { name: 'Transport', value: 400 },
    { name: 'Other', value: 200 }
  ];

  const sampleStatusDistribution = statusDistribution.length > 0 ? statusDistribution : [
    { name: 'Approved', value: 70 },
    { name: 'Pending', value: 20 },
    { name: 'Rejected', value: 10 }
  ];

  const sampleActivities = recentActivity.length > 0 ? recentActivity : [
    { type: 'daily', title: 'Daily Allowance', status: 'APPROVED', timestamp: '2 days ago' },
    { type: 'travel', title: 'Travel Allowance', status: 'APPROVED', timestamp: '3 days ago' },
    { type: 'daily', title: 'Daily Allowance', status: 'PENDING', timestamp: '5 days ago' },
    { type: 'travel', title: 'Travel Allowance', status: 'REJECTED', timestamp: '1 week ago' }
  ];

  const pendingApprovalsDisplay = isManager() ? (
    Array.isArray(pendingApprovals) && pendingApprovals.length > 0 ? 
      pendingCount : 
      pendingCount
  ) : "0";

  return (
    <PageContainer title="Dashboard">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome, {currentUser?.fullName || "Jatothu Vamshi"}!
          </h1>
          <Typography variant="body1" color="textSecondary" style={{ marginTop: '8px' }}>
            Here's an overview of your expenses and activities
          </Typography>
        </div>
        
        {/* Summary Cards */}
        <div className="summary-section">
          <div className="summary-card">
            <div className="card-title">Daily Allowance</div>
            <div className="card-value" style={{ color: '#00BCD4' }}>$500.00</div>
            <div className="card-subtitle">
              <AttachMoney style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
              Total approved
            </div>
          </div>
          
          <div className="summary-card">
            <div className="card-title">Travel Allowance</div>
            <div className="card-value" style={{ color: '#00BCD4' }}>$1000.00</div>
            <div className="card-subtitle">
              <CardTravel style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
              Total approved
            </div>
          </div>
          
          <div className="summary-card">
            <div className="card-title">Total Expenses</div>
            <div className="card-value" style={{ color: '#00BCD4' }}>$1500.00</div>
            <div className="card-subtitle">
              <TrendingUp style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
              All categories
            </div>
          </div>
          
          <div className="summary-card">
            <div className="card-title">Pending Approvals</div>
            <div className="card-value" style={{ color: '#00BCD4' }}>{pendingApprovalsDisplay}</div>
            <div className="card-subtitle">
              <Notifications style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
              Awaiting review
            </div>
          </div>
        </div>
        
        {/* Charts and Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <div className="chart-section" style={{ height: '400px' }}>
              <div className="chart-header">
                <div className="chart-title">Monthly Expenses</div>
              </div>
              <div className="chart-content monthly-expenses-chart">
                <ExpenseChart
                  type="line"
                  data={sampleMonthlyExpenses}
                  height={350}
                />
              </div>
            </div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <div className="activity-feed">
              <div className="chart-title">Recent Activity</div>
              <Box mt={2}>
                <ActivityList activities={sampleActivities} />
              </Box>
            </div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <div className="chart-section">
              <div className="chart-header">
                <div className="chart-title">Expense Categories</div>
              </div>
              <ExpenseChart
                type="bar"
                data={sampleCategoryDistribution}
                height={300}
              />
            </div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <div className="chart-section">
              <div className="chart-header">
                <div className="chart-title">Approval Status</div>
              </div>
              <ExpenseChart
                type="pie"
                data={sampleStatusDistribution}
                height={300}
              />
            </div>
          </Grid>
        </Grid>
        
        {/* Quick Actions Section */}
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">
              <AttachMoney />
            </div>
            <div className="action-title">New Expense</div>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <CardTravel />
            </div>
            <div className="action-title">Travel Request</div>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <TrendingUp />
            </div>
            <div className="action-title">View Reports</div>
          </div>
          
          {isManager() && (
            <div className="action-card">
              <div className="action-icon">
                <Notifications />
              </div>
              <div className="action-title">Approvals</div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;