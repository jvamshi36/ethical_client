import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  Alert, Tabs, Tab, FormControl, InputLabel, Select,
  MenuItem, TextField, Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, subMonths } from 'date-fns';
import StatusBadge from '../common/StatusBadge';
import AllowanceDetails from '../allowances/AllowanceDetails';
import { DailyAllowanceService, TravelAllowanceService } from '../../services/allowance.service';
import { useAuth } from '../../contexts/AuthContext';

const AllowanceHistory = ({ userId }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dailyAllowances, setDailyAllowances] = useState([]);
  const [travelAllowances, setTravelAllowances] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: subMonths(new Date(), 1),
    endDate: new Date()
  });
  const [selectedAllowance, setSelectedAllowance] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Check if user has admin privileges
  const isAdmin = currentUser && ['ADMIN', 'SUPER_ADMIN'].includes(currentUser.role);

  useEffect(() => {
    if (userId) {
      fetchAllowanceHistory();
    }
  }, [userId, tabValue, dateRange]);

  const fetchAllowanceHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (tabValue === 0) {
        // Fetch daily allowances for the user
        const response = await DailyAllowanceService.getUserAllowancesByUserId(userId, {
          startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
          endDate: format(dateRange.endDate, 'yyyy-MM-dd')
        });
        
        setDailyAllowances(Array.isArray(response) ? response : []);
      } else {
        // Fetch travel allowances for the user
        const response = await TravelAllowanceService.getUserAllowancesByUserId(userId, {
          startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
          endDate: format(dateRange.endDate, 'yyyy-MM-dd')
        });
        
        setTravelAllowances(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error('Error fetching allowance history:', error);
      setError('Failed to fetch allowance history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = (field, date) => {
    setDateRange(prev => ({
      ...prev,
      [field]: date
    }));
  };
  
  // Handle view allowance details
  const handleViewAllowance = (allowance) => {
    setSelectedAllowance(allowance);
    setDetailsOpen(true);
  };
  
  // Handle approve allowance
  const handleApprove = async (id) => {
    try {
      if (tabValue === 0) {
        await DailyAllowanceService.updateStatus(id, 'APPROVED');
      } else {
        await TravelAllowanceService.updateStatus(id, 'APPROVED');
      }
      setDetailsOpen(false);
      setSuccess('Allowance approved successfully');
      fetchAllowanceHistory();
    } catch (err) {
      setError('Failed to approve allowance. Please try again later.');
      console.error('Error approving allowance:', err);
    }
  };
  
  // Handle reject allowance
  const handleReject = async (id) => {
    try {
      if (tabValue === 0) {
        await DailyAllowanceService.updateStatus(id, 'REJECTED');
      } else {
        await TravelAllowanceService.updateStatus(id, 'REJECTED');
      }
      setDetailsOpen(false);
      setSuccess('Allowance rejected successfully');
      fetchAllowanceHistory();
    } catch (err) {
      setError('Failed to reject allowance. Please try again later.');
      console.error('Error rejecting allowance:', err);
    }
  };

  const renderDailyAllowances = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Amount ($)</TableCell>
            <TableCell>Remarks</TableCell>
            {isAdmin && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {dailyAllowances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} align="center">
                No daily allowances found for the selected period.
              </TableCell>
            </TableRow>
          ) : (
            dailyAllowances.map((allowance) => (
              <TableRow key={allowance.id}>
                <TableCell>{format(new Date(allowance.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell><StatusBadge status={allowance.status} /></TableCell>
                <TableCell align="right">${parseFloat(allowance.amount).toFixed(2)}</TableCell>
                <TableCell>{allowance.remarks || '-'}</TableCell>
                {isAdmin && (
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewAllowance(allowance)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTravelAllowances = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Travel Mode</TableCell>
            <TableCell align="right">Distance (km)</TableCell>
            <TableCell align="right">Amount ($)</TableCell>
            <TableCell>Status</TableCell>
            {isAdmin && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {travelAllowances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 8 : 7} align="center">
                No travel allowances found for the selected period.
              </TableCell>
            </TableRow>
          ) : (
            travelAllowances.map((allowance) => (
              <TableRow key={allowance.id}>
                <TableCell>{format(new Date(allowance.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{allowance.from_city}</TableCell>
                <TableCell>{allowance.to_city}</TableCell>
                <TableCell>{allowance.travel_mode}</TableCell>
                <TableCell align="right">{allowance.distance}</TableCell>
                <TableCell align="right">${parseFloat(allowance.amount).toFixed(2)}</TableCell>
                <TableCell><StatusBadge status={allowance.status} /></TableCell>
                {isAdmin && (
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewAllowance(allowance)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Daily Allowances" />
          <Tab label="Travel Allowances" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tabValue === 0 ? renderDailyAllowances() : renderTravelAllowances()}
        </Box>
      )}
      
      {/* Allowance Details Dialog */}
      {isAdmin && selectedAllowance && (
        <AllowanceDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          allowance={selectedAllowance}
          type={tabValue === 0 ? "da" : "ta"}
          onApprove={handleApprove}
          onReject={handleReject}
          canApprove={true}
        />
      )}
    </Paper>
  );
};

export default AllowanceHistory;