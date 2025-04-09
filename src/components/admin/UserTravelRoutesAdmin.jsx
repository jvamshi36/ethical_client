import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, TextField, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, FormControl, InputLabel, Select, MenuItem,
  Alert, CircularProgress, Chip
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { api } from '../../services/auth.service';

const UserTravelRoutesAdmin = ({ userId, username }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    distance: '',
    amount: ''
  });
  const [cities, setCities] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRouteId, setCurrentRouteId] = useState(null);
  
  useEffect(() => {
    if (userId) {
      fetchUserRoutes();
      fetchCities();
    }
  }, [userId]);
  
  const fetchUserRoutes = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/travel-routes/user/${userId}`);
      setRoutes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError('Failed to fetch travel routes');
      console.error('Error fetching travel routes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCities = async () => {
    try {
      const response = await api.get('/cities');
      setCities(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const openCreateDialog = () => {
    setFormData({
      fromCity: '',
      toCity: '',
      distance: '',
      amount: ''
    });
    setIsEditMode(false);
    setDialogOpen(true);
  };
  
  const openEditDialog = (route) => {
    setFormData({
      fromCity: route.from_city,
      toCity: route.to_city,
      distance: route.distance.toString(),
      amount: route.amount.toString()
    });
    setCurrentRouteId(route.id);
    setIsEditMode(true);
    setDialogOpen(true);
  };
  
  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    
    try {
      await api.delete(`/travel-routes/${id}`);
      setSuccess('Route deleted successfully');
      fetchUserRoutes();
    } catch (error) {
      setError('Failed to delete route');
      console.error('Error deleting route:', error);
    }
  };
  
  const handleSubmit = async () => {
    // Validate form data
    if (!formData.fromCity || !formData.toCity || !formData.distance || !formData.amount) {
      setError('All fields are required');
      return;
    }
    
    if (formData.fromCity === formData.toCity) {
      setError('From and To cities must be different');
      return;
    }
    
    if (isNaN(parseFloat(formData.distance)) || parseFloat(formData.distance) <= 0) {
      setError('Distance must be a positive number');
      return;
    }
    
    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    
    try {
      if (isEditMode) {
        await api.put(`/travel-routes/${currentRouteId}`, {
          fromCity: formData.fromCity,
          toCity: formData.toCity,
          distance: parseFloat(formData.distance),
          amount: parseFloat(formData.amount)
        });
        setSuccess('Route updated successfully');
      } else {
        await api.post('/travel-routes', {
          userId,
          fromCity: formData.fromCity,
          toCity: formData.toCity,
          distance: parseFloat(formData.distance),
          amount: parseFloat(formData.amount)
        });
        setSuccess('Route added successfully');
      }
      
      setDialogOpen(false);
      fetchUserRoutes();
    } catch (error) {
      setError('Failed to save route');
      console.error('Error saving route:', error);
    }
  };
  
  const handleBulkImport = async () => {
    if (!window.confirm('Import common routes for this user? This will not affect existing routes.')) return;
    
    try {
      await api.post('/travel-routes/bulk', {
        userId,
        importCommonRoutes: true
      });
      setSuccess('Routes imported successfully');
      fetchUserRoutes();
    } catch (error) {
      setError('Failed to import routes');
      console.error('Error importing routes:', error);
    }
  };
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Travel Routes for {username || `User ID: ${userId}`}
        </Typography>
        
        <Box>
          <Button 
            variant="outlined"
            onClick={handleBulkImport}
            sx={{ mr: 1 }}
          >
            Import Common Routes
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={openCreateDialog}
          >
            Add Route
          </Button>
        </Box>
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
      ) : routes.length === 0 ? (
        <Alert severity="info">
          No travel routes configured for this user. Add routes or import common routes.
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From City</TableCell>
                <TableCell>To City</TableCell>
                <TableCell align="right">Distance (km)</TableCell>
                <TableCell align="right">Amount ($)</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map(route => (
                <TableRow key={route.id}>
                  <TableCell>{route.from_city}</TableCell>
                  <TableCell>{route.to_city}</TableCell>
                  <TableCell align="right">{route.distance}</TableCell>
                  <TableCell align="right">${route.amount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={route.is_active ? 'Active' : 'Inactive'} 
                      color={route.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEditDialog(route)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteRoute(route.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Add/Edit Route Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit Travel Route' : 'Add Travel Route'}
          <IconButton
            aria-label="close"
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>From City</InputLabel>
              <Select
                name="fromCity"
                value={formData.fromCity}
                onChange={handleInputChange}
                label="From City"
              >
                {cities.map(city => (
                  <MenuItem key={`from-${city.id}`} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>To City</InputLabel>
              <Select
                name="toCity"
                value={formData.toCity}
                onChange={handleInputChange}
                label="To City"
              >
                {cities.map(city => (
                  <MenuItem key={`to-${city.id}`} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Distance (km)"
              name="distance"
              type="number"
              value={formData.distance}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: "0.1", step: "0.1" }}
            />
            
            <TextField
              label="Amount ($)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: "0.1", step: "0.1" }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserTravelRoutesAdmin;