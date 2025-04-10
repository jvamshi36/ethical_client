import React, { useState, useEffect, useCallback } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Alert, CircularProgress, Tabs, Tab
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import AllowanceList from '../components/allowances/AllowanceList';
import AllowanceDetails from '../components/allowances/AllowanceDetails';
import { useAuth } from '../contexts/AuthContext';
import { DailyAllowanceService } from '../services/allowance.service';
import '../styles/components/allowances.css';

const DailyAllowance = () => {
  const { currentUser, isManager } = useAuth();
  const [allowances, setAllowances] = useState([]);
  const [teamAllowances, setTeamAllowances] = useState([]);
  const [selectedAllowance, setSelectedAllowance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Use debounce to prevent multiple rapid API calls
  const debounceFetch = useCallback(() => {
    let timeoutId = null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fetchAllowances();
        if (isManager()) {
          fetchTeamAllowances();
        }
      }, 300); // 300ms debounce time
    };
  }, [isManager]);

  useEffect(() => {
    const fetchData = debounceFetch();
    fetchData();
    // Cleanup function to clear any pending timeouts
    return () => {
      const fetchData = debounceFetch();
      fetchData.timeoutId && clearTimeout(fetchData.timeoutId);
    };
  }, [debounceFetch]);
  
  const fetchAllowances = async () => {
    // Don't set loading to true if we already have data to prevent UI flicker
    if (!allowances.length) {
      setLoading(true);
    }
    setError('');
    
    try {
      const response = await DailyAllowanceService.getUserAllowances();
      setAllowances(response);
    } catch (err) {
      // Check if the error is a rate limit error (429)
      if (err.response && err.response.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
      } else {
        setError('Failed to load allowances. Please try again later.');
      }
      console.error('Error fetching allowances:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTeamAllowances = async () => {
    try {
      const response = await DailyAllowanceService.getTeamAllowances();
      setTeamAllowances(response);
    } catch (err) {
      // Only log the error, don't show UI error for team allowances to avoid confusion
      console.error('Error fetching team allowances:', err);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleView = (allowance) => {
    setSelectedAllowance(allowance);
    setDetailsOpen(true);
  };
  
  const handleApprove = async (id) => {
    try {
      await DailyAllowanceService.updateStatus(id, 'APPROVED');
      fetchTeamAllowances();
      setDetailsOpen(false);
    } catch (err) {
      setError('Failed to approve allowance. Please try again later.');
      console.error('Error approving allowance:', err);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await DailyAllowanceService.updateStatus(id, 'REJECTED');
      fetchTeamAllowances();
      setDetailsOpen(false);
    } catch (err) {
      setError('Failed to reject allowance. Please try again later.');
      console.error('Error rejecting allowance:', err);
    }
  };
  
  const renderContent = () => {
    if (loading && !allowances.length) {
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
    
    if (isManager() && tabValue === 1) {
      return (
        <AllowanceList 
          allowances={teamAllowances} 
          type="da"
          onView={handleView}
          editable={false}
        />
      );
    }
    
    return (
      <>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center">
            <InfoOutlined sx={{ mr: 1 }} />
            <Typography>
              Daily allowances are automatically credited at 5:00 PM every day based on your role.
            </Typography>
          </Box>
        </Alert>
        
        <AllowanceList 
          allowances={allowances} 
          type="da"
          onView={handleView}
          editable={false} // No edit option for daily allowances
        />
      </>
    );
  };
  
  return (
    <PageContainer title="Daily Allowance">
      {isManager() && (
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="My Allowances" />
            <Tab label="Team Allowances" />
          </Tabs>
        </Paper>
      )}
      
      {renderContent()}
      
      {/* Daily Allowance Details Dialog */}
      <AllowanceDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        allowance={selectedAllowance}
        type="da"
        onApprove={handleApprove}
        onReject={handleReject}
        canApprove={isManager() && tabValue === 1}
      />
    </PageContainer>
  );
};

export default DailyAllowance;