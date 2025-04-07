import React, { useState } from 'react';
import { 
  TextField, Button, Grid, FormControl, 
  InputLabel, Select, MenuItem, Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import '../../styles/components/allowances.css';

const DailyAllowanceForm = ({ onSubmit, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState(initialData || {
    date: new Date(),
    amount: '',
    remarks: ''
  });
  
  const [errors, setErrors] = useState({});
  
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
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0)
      newErrors.amount = 'Amount must be a positive number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="allowance-form">
      <Typography variant="h6" className="form-title">
        {isEditMode ? 'Edit Daily Allowance' : 'New Daily Allowance'}
      </Typography>
      
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
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.amount}
            helperText={errors.amount}
            InputProps={{
              startAdornment: <span className="currency-symbol">$</span>,
            }}
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