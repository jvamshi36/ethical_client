import React, { useState, useEffect } from 'react';
import { 
  Grid, Typography, Box, Paper, CircularProgress, Alert
} from '@mui/material';
import { 
  AttachMoney, CardTravel, TrendingUp, Notifications
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import SummaryCard from '../components/dashboard/SummaryCard';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import ActivityList from '../components/dashboard/ActivityList';
import AnalyticsService from '../services/analytics.service';
import '../styles/components/dashboard.css';

const Dashboard = () => {
  const { currentUser, isManager } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalDA: 0,
      totalTA: 0,
      totalAmount: 0,
      pendingApprovals: 0,
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer title="Dashboard">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </PageContainer>
    );
  }
  
  const { summary, charts } = dashboardData;
  
  return (
    <PageContainer title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {currentUser.fullName}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's an overview of your expenses and activities
        </Typography>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Daily Allowance"
            mainValue={`$${summary.totalDA.toFixed(2)}`}
            secondaryValue="Total approved"
            icon={<AttachMoney />}
            color="#4caf50"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Travel Allowance"
            mainValue={`$${summary.totalTA.toFixed(2)}`}
            secondaryValue="Total approved"
            icon={<CardTravel />}
            color="#2196f3"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Expenses"
            mainValue={`$${summary.totalAmount.toFixed(2)}`}
            secondaryValue="All categories"
            icon={<TrendingUp />}
            color="#ff9800"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Pending Approvals"
            mainValue={isManager() ? summary.pendingApprovals.toString() : "0"}
            secondaryValue="Awaiting review"
            icon={<Notifications />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
      
      {/* Charts and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ExpenseChart
            type="line"
            data={charts.monthlyExpenses}
            title="Monthly Expenses"
            height={320}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <ActivityList activities={summary.recentActivity} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ExpenseChart
            type="bar"
            data={charts.categoryDistribution}
            title="Expense Categories"
            height={300}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ExpenseChart
            type="pie"
            data={charts.statusDistribution}
            title="Approval Status"
            height={300}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;