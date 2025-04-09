import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Grid, Box, Paper, Alert, CircularProgress, FormControl, 
  InputLabel, Select, MenuItem, Typography,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { api } from '../../services/auth.service';
import { TravelAllowanceService } from '../../services/allowance.service';
import '../../styles/components/allowances.css';

const TravelAllowanceForm = ({ onSubmit, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState(initialData || {
    date: new Date(),
    fromCity: '',
    toCity: '',
    distance: '',
    travelMode: 'CAR',
    amount: '',
    remarks: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [userRoutes, setUserRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  
  // Travel modes list
  const travelModes = [
    { value: 'CAR', label: 'Car' },
    { value: 'BIKE', label: 'Bike' },
    { value: 'PUBLIC', label: 'Public Transport' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  useEffect(() => {
    fetchUserRoutes();
    
    // If in edit mode, set the selected route
    if (isEditMode && initialData) {
      const routeKey = `${initialData.fromCity}|${initialData.toCity}`;
      setSelectedRoute(routeKey);
    }
  }, [isEditMode, initialData]);
  
  const fetchUserRoutes = async () => {
    setLoading(true);
    try {
      // Fetch user's predefined travel routes - using the correct endpoint
      const response = await TravelAllowanceService.getUserTravelRoutes();
      
      // Ensure we have an array
      const routes = Array.isArray(response) ? response : [];
      setUserRoutes(routes);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user routes:', error);
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation errors
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
    
    if (errors.date) {
      setErrors({ ...errors, date: undefined });
    }
  };
  
  const handleRouteChange = (e) => {
    const routeKey = e.target.value;
    setSelectedRoute(routeKey);
    
    if (!routeKey) return;
    
    // Parse the selected route key (format: "fromCity|toCity")
    const [fromCity, toCity] = routeKey.split('|');
    
    // Find the route details
    const route = userRoutes.find(r => 
      r.from_city === fromCity && r.to_city === toCity
    );
    
    if (route) {
      // Update form with route details
      setFormData({
        ...formData,
        fromCity,
        toCity,
        distance: route.distance,
        amount: route.amount
      });
      
      // Clear validation errors
      setErrors({
        ...errors,
        fromCity: undefined,
        toCity: undefined,
        distance: undefined,
        amount: undefined
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.fromCity) newErrors.fromCity = 'Origin city is required';
    if (!formData.toCity) newErrors.toCity = 'Destination city is required';
    if (formData.fromCity === formData.toCity) 
      newErrors.toCity = 'Destination must be different from origin';
    if (!formData.distance) newErrors.distance = 'Distance is required';
    if (!formData.travelMode) newErrors.travelMode = 'Travel mode is required';
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
        distance: parseFloat(formData.distance),
        amount: parseFloat(formData.amount)
      });
    }
  };
  
  if (loading) {
    return <CircularProgress className="loading-spinner" />;
  }
  
  // Message for when no routes are configured
  if (userRoutes.length === 0) {
    return (
      <Box className="allowance-form">
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">No Travel Routes Configured</Typography>
          <Typography variant="body2">
            You don't have any travel routes configured in your profile. Please contact your administrator to set up travel routes.
          </Typography>
        </Alert>
      </Box>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="allowance-form">
      <Typography variant="h6" className="form-title">
        {isEditMode ? 'Edit Travel Allowance' : 'New Travel Allowance'}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Travel Date"
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
          <FormControl fullWidth className="form-input">
            <InputLabel>Select Travel Route</InputLabel>
            <Select
              value={selectedRoute}
              onChange={handleRouteChange}
              label="Select Travel Route"
            >
              <MenuItem value="">-- Select a route --</MenuItem>
              {userRoutes.map(route => (
                <MenuItem 
                  key={`${route.from_city}|${route.to_city}`}
                  value={`${route.from_city}|${route.to_city}`}
                >
                  {route.from_city} to {route.to_city} ({route.distance} km)
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {userRoutes.length === 0 
                ? "No travel routes found. Please contact your administrator." 
                : "Select from your approved travel routes"}
            </FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="From City"
            name="fromCity"
            value={formData.fromCity}
            onChange={handleChange}
            fullWidth
            required
            disabled={true} // Locked based on route selection
            error={!!errors.fromCity}
            helperText={errors.fromCity}
            className="form-input"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="To City"
            name="toCity"
            value={formData.toCity}
            onChange={handleChange}
            fullWidth
            required
            disabled={true} // Locked based on route selection
            error={!!errors.toCity}
            helperText={errors.toCity}
            className="form-input"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Distance (km)"
            name="distance"
            type="number"
            value={formData.distance}
            onChange={handleChange}
            fullWidth
            required
            disabled={true} // Locked based on route selection
            error={!!errors.distance}
            helperText={errors.distance}
            className="form-input"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!errors.travelMode} className="form-input">
            <InputLabel>Travel Mode</InputLabel>
            <Select
              name="travelMode"
              value={formData.travelMode}
              onChange={handleChange}
              label="Travel Mode"
            >
              {travelModes.map(mode => (
                <MenuItem key={mode.value} value={mode.value}>
                  {mode.label}
                </MenuItem>
              ))}
            </Select>
            {errors.travelMode && <FormHelperText>{errors.travelMode}</FormHelperText>}
          </FormControl>
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
            disabled={true} // Locked based on route selection
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

export default TravelAllowanceForm;