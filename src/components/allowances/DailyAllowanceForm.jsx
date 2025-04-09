import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Grid, FormControl, 
  InputLabel, Select, MenuItem, Typography, 
  Box, Alert, CircularProgress 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { api } from '../../services/auth.service';
import '../../styles/components/allowances.css';

const DailyAllowanceForm = ({ onSubmit, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState(initialData || {
    date: new Date(),
    remarks: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [roleAmount, setRoleAmount] = useState(0);
  const [amountLoading, setAmountLoading] = useState(true);
  const [amountError, setAmountError] = useState('');
  
  // Fetch the role-based daily allowance amount when component mounts
  useEffect(() => {
    fetchRoleAllowance();
  }, []);
  
  const fetchRoleAllowance = async () => {
    setAmountLoading(true);
    setAmountError('');
    
    try {
      const response = await api.get('/role-allowances/my-allowance');
      setRoleAmount(response.data.amount);
      
      // If editing, keep the existing amount
      if (!isEditMode) {
        setFormData(prev => ({
          ...prev,
          amount: response.data.amount
        }));
      }
    } catch (error) {
      console.error('Error fetching role allowance:', error);
      setAmountError('Failed to fetch allowance amount for your role. Please contact an administrator.');
    } finally {
      setAmountLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    // No validation for amount as it's fixed by role
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        // Ensure the amount is the fixed role-based amount
        amount: roleAmount
      });
    }
  };
  
  if (amountLoading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="allowance-form">
      <Typography variant="h6" className="form-title">
        {isEditMode ? 'Edit Daily Allowance' : 'New Daily Allowance'}
      </Typography>
      
      {amountError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {amountError}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  required
                  error={!!errors.date}
                  helperText={errors.date} 
                  className="form-input"
                />
              )}
              className="date-picker"
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={roleAmount}
            disabled={true} // Amount is fixed and cannot be edited
            fullWidth
            required
            InputProps={{
              readOnly: true,
              startAdornment: <span className="currency-symbol">$</span>,
            }}
            helperText="Fixed amount based on your role"
            className="form-input"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            className="form-input"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
          >
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DailyAllowanceForm;