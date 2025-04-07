import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Grid, FormControl, 
  InputLabel, Select, MenuItem, Typography,
  FormHelperText, CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { api } from '../../services/auth.service';
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
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  
  // Travel modes with rates per km
  const travelModes = [
    { value: 'CAR', label: 'Car', rate: 0.6 },
    { value: 'BIKE', label: 'Bike', rate: 0.3 },
    { value: 'PUBLIC', label: 'Public Transport', rate: 0.2 },
    { value: 'OTHER', label: 'Other', rate: 0 }
  ];
  
  useEffect(() => {
    fetchCities();
  }, []);
  
  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fromCity' || name === 'toCity') {
      setFormData({ ...formData, [name]: value });
      
      // If both cities are selected, calculate distance
      if ((name === 'fromCity' && formData.toCity) || 
          (name === 'toCity' && formData.fromCity)) {
        calculateDistance(
          name === 'fromCity' ? value : formData.fromCity,
          name === 'toCity' ? value : formData.toCity
        );
      }
    } else if (name === 'distance' || name === 'travelMode') {
      const newFormData = { ...formData, [name]: value };
      
      // Update distance and recalculate amount
      if (name === 'distance') {
        const selectedMode = travelModes.find(mode => mode.value === formData.travelMode);
        if (selectedMode && selectedMode.rate > 0) {
          newFormData.amount = (parseFloat(value) * selectedMode.rate).toFixed(2);
        }
      }
      
      // Update travel mode and recalculate amount
      if (name === 'travelMode') {
        const selectedMode = travelModes.find(mode => mode.value === value);
        if (selectedMode && selectedMode.rate > 0 && formData.distance) {
          newFormData.amount = (parseFloat(formData.distance) * selectedMode.rate).toFixed(2);
        } else if (selectedMode && selectedMode.rate === 0) {
          newFormData.amount = '';
        }
      }
      
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };
  
  const calculateDistance = async (fromCity, toCity) => {
    if (!fromCity || !toCity || fromCity === toCity) return;
    
    setCalculatingDistance(true);
    try {
      // Call API to calculate distance between cities
      const response = await api.post('/cities/distance', {
        fromCity,
        toCity
      });
      
      const { distance } = response.data;
      
      // Update distance and calculate amount
      const selectedMode = travelModes.find(mode => mode.value === formData.travelMode);
      let amount = '';
      
      if (selectedMode && selectedMode.rate > 0) {
        amount = (distance * selectedMode.rate).toFixed(2);
      }
      
      setFormData({
        ...formData,
        distance,
        amount
      });
    } catch (error) {
      console.error('Error calculating distance:', error);
    } finally {
      setCalculatingDistance(false);
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.fromCity) newErrors.fromCity = 'From city is required';
    if (!formData.toCity) newErrors.toCity = 'To city is required';
    if (formData.fromCity === formData.toCity) 
      newErrors.toCity = 'To city must be different from From city';
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
  
  return (
    <form onSubmit={handleSubmit} className="allowance-form">
      <Typography variant="h6" className="form-title">
        {isEditMode ? 'Edit Travel Allowance' : 'New Travel Allowance'}
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
          <FormControl fullWidth required error={!!errors.fromCity} className="form-input">
            <InputLabel>From City</InputLabel>
            <Select
              name="fromCity"
              value={formData.fromCity}
              onChange={handleChange}
              label="From City"
            >
              {cities.map(city => (
                <MenuItem key={city.id} value={city.name}>
                  {city.name}, {city.state}
                </MenuItem>
              ))}
            </Select>
            {errors.fromCity && <FormHelperText>{errors.fromCity}</FormHelperText>}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!errors.toCity} className="form-input">
            <InputLabel>To City</InputLabel>
            <Select
              name="toCity"
              value={formData.toCity}
              onChange={handleChange}
              label="To City"
            >
              {cities.map(city => (
                <MenuItem key={city.id} value={city.name}>
                  {city.name}, {city.state}
                </MenuItem>
              ))}
            </Select>
            {errors.toCity && <FormHelperText>{errors.toCity}</FormHelperText>}
          </FormControl>
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
            error={!!errors.distance}
            helperText={errors.distance || (calculatingDistance ? 'Calculating...' : '')}
            disabled={calculatingDistance}
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
                  {mode.label} {mode.rate > 0 ? `($${mode.rate}/km)` : ''}
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
            error={!!errors.amount}
            helperText={errors.amount || (formData.travelMode !== 'OTHER' ? 'Auto-calculated based on distance and mode' : '')}
            disabled={formData.travelMode !== 'OTHER' && formData.distance && formData.travelMode}
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