import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, TextField, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, Chip
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { api } from '../../services/auth.service';
import '../../styles/components/admin.css';

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [headquarters, setHeadquarters] = useState([]);
  
  // Form data for city
  const [cityData, setCityData] = useState({
    id: null,
    name: '',
    state: '',
    headquarters: '',
    isActive: true
  });
  
  // Load cities and headquarters on component mount
  useEffect(() => {
    fetchCities();
    fetchHeadquarters();
  }, []);
  
  // Fetch all cities
  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cities');
      setCities(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Failed to fetch cities. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch headquarters for the dropdown
  const fetchHeadquarters = async () => {
    try {
      const response = await api.get('/reference/headquarters');
      setHeadquarters(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching headquarters:', error);
      setHeadquarters([]);
    }
  };
  
  // Open dialog for creating a new city
  const handleAddCity = () => {
    setCityData({
      id: null,
      name: '',
      state: '',
      headquarters: '',
      isActive: true
    });
    setIsEditMode(false);
    setDialogOpen(true);
  };
  
  // Open dialog for editing a city
  const handleEditCity = (city) => {
    setCityData({
      id: city.id,
      name: city.name,
      state: city.state,
      headquarters: city.headquarters,
      isActive: city.is_active
    });
    setIsEditMode(true);
    setDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCityData({
      ...cityData,
      [name]: value
    });
  };
  
  // Save city (create or update)
  const handleSaveCity = async () => {
    // Validate form data
    if (!cityData.name || !cityData.state || !cityData.headquarters) {
      setError('Name, state, and headquarters are required');
      return;
    }
    
    try {
      if (isEditMode) {
        // Update existing city
        await api.put(`/cities/${cityData.id}`, cityData);
        setSuccess('City updated successfully');
      } else {
        // Create new city
        await api.post('/cities', cityData);
        setSuccess('City added successfully');
      }
      
      // Close dialog and refresh the list
      setDialogOpen(false);
      fetchCities();
    } catch (error) {
      console.error('Error saving city:', error);
      setError('Failed to save city. Please try again.');
    }
  };
  
  // Delete a city
  const handleDeleteCity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    
    try {
      await api.delete(`/cities/${id}`);
      setSuccess('City deleted successfully');
      fetchCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      setError('Failed to delete city. It may be in use by travel routes.');
    }
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setError('');
  };
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Cities Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddCity}
        >
          Add City
        </Button>
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Headquarters</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No cities found. Add a city to get started.
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{city.state}</TableCell>
                    <TableCell>{city.headquarters}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={city.is_active ? 'Active' : 'Inactive'} 
                        color={city.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditCity(city)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteCity(city.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Add/Edit City Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? 'Edit City' : 'Add City'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="City Name"
              name="name"
              value={cityData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <TextField
              label="State"
              name="state"
              value={cityData.state}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <TextField
              select
              label="Headquarters"
              name="headquarters"
              value={cityData.headquarters}
              onChange={handleInputChange}
              fullWidth
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Headquarters</option>
              {headquarters.map((hq) => (
                <option key={hq.id} value={hq.name}>
                  {hq.name}
                </option>
              ))}
            </TextField>
            
            {isEditMode && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Status:</Typography>
                <Chip 
                  label={cityData.isActive ? 'Active' : 'Inactive'} 
                  color={cityData.isActive ? 'success' : 'default'}
                  onClick={() => setCityData({...cityData, isActive: !cityData.isActive})}
                  clickable
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveCity} 
            variant="contained"
            color="primary"
          >
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CityManagement;