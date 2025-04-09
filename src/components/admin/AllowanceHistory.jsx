import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  Alert, Tabs, Tab, FormControl, InputLabel, Select,
  MenuItem, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { api } from '../../services/auth.service';

const AllowanceHistory = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dailyAllowances, setDailyAllowances] = useState([]);
  const [travelAllowances, setTravelAllowances] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });

  useEffect(() => {
    if (userId) {
      fetchAllowanceHistory();
    }
  }, [userId, tabValue, dateRange]);

  const fetchAllowanceHistory = async () => {
    setLoading(true);
    try {
      if (tabValue === 0) {
        const response = await api.get(`/daily-allowances/user/${userId}`, {
          params: {
            startDate: dateRange.startDate.toISOString().split('T')[0],
            endDate: dateRange.endDate.toISOString().split('T')[0]
          }
        });
        setDailyAllowances(Array.isArray(response.data) ? response.data : []);
      } else {
        const response = await api.get(`/travel-allowances/user/${userId}`, {
          params: {
            startDate: dateRange.startDate.toISOString().split('T')[0],
            endDate: dateRange.endDate.toISOString().split('T')[0]
          }
        });
        setTravelAllowances(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      setError('Failed to fetch allowance history');
      console.error('Error fetching allowance history:', error);
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

  const renderDailyAllowances = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Amount ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dailyAllowances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No daily allowances found for the selected period.
              </TableCell>
            </TableRow>
          ) : (
            dailyAllowances.map((allowance) => (
              <TableRow key={allowance.id}>
                <TableCell>{new Date(allowance.date).toLocaleDateString()}</TableCell>
                <TableCell>{allowance.status}</TableCell>
                <TableCell align="right">${allowance.amount.toFixed(2)}</TableCell>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {travelAllowances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No travel allowances found for the selected period.
              </TableCell>
            </TableRow>
          ) : (
            travelAllowances.map((allowance) => (
              <TableRow key={allowance.id}>
                <TableCell>{new Date(allowance.date).toLocaleDateString()}</TableCell>
                <TableCell>{allowance.from_city}</TableCell>
                <TableCell>{allowance.to_city}</TableCell>
                <TableCell>{allowance.travel_mode}</TableCell>
                <TableCell align="right">{allowance.distance}</TableCell>
                <TableCell align="right">${allowance.amount.toFixed(2)}</TableCell>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tabValue === 0 ? renderDailyAllowances() : renderTravelAllowances()}
        </Box>
      )}
    </Paper>
  );
};

export default AllowanceHistory;