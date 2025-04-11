import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, TextField, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, Chip
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import { api } from '../../services/auth.service';
import '../../styles/pages/city-management.css';
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
    <div className="city-management-container">
      <div className="section-header">
        <div className="section-title">Cities Management</div>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddCity}
          className="action-button primary-button"
        >
          Add City
        </Button>
      </div>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={() => setError('')}
          className="error-container"
        >
          <div className="error-message">{error}</div>
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }} 
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}
      
      {loading ? (
        <div className="loading-container">
          <CircularProgress className="loading-spinner" />
          <div>Loading cities...</div>
        </div>
      ) : (
        <TableContainer className="city-table-container">
          <Table className="city-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Name</TableCell>
                <TableCell className="table-header">State</TableCell>
                <TableCell className="table-header">Headquarters</TableCell>
                <TableCell align="center" className="table-header">Status</TableCell>
                <TableCell align="right" className="table-header">Actions</TableCell>
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
                  <TableRow key={city.id} className="city-row">
                    <TableCell className="city-name">{city.name}</TableCell>
                    <TableCell>{city.state}</TableCell>
                    <TableCell>{city.headquarters}</TableCell>
                    <TableCell align="center">
                      <div className={`status-badge status-${city.is_active ? 'active' : 'inactive'}`}>
                        {city.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className="action-buttons">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditCity(city)}
                          className="action-button secondary-button"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteCity(city.id)}
                          className="action-button secondary-button"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </div>
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
        classes={{ paper: 'city-dialog' }}
      >
        <DialogTitle className="dialog-title">
          {isEditMode ? 'Edit City' : 'Add City'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            className="close-button"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers className="dialog-content">
          <div className="form-container">
            <div className="form-group">
              <label className="form-label">City Name</label>
              <TextField
                name="name"
                value={cityData.name}
                onChange={handleInputChange}
                fullWidth
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">State</label>
              <TextField
                name="state"
                value={cityData.state}
                onChange={handleInputChange}
                fullWidth
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Headquarters</label>
              <TextField
                select
                name="headquarters"
                value={cityData.headquarters}
                onChange={handleInputChange}
                fullWidth
                required
                className="form-select"
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
            </div>
            
            {isEditMode && (
              <div className="form-group">
                <label className="form-label">Status</label>
                <div 
                  className={`status-toggle ${cityData.isActive ? 'active' : 'inactive'}`}
                  onClick={() => setCityData({...cityData, isActive: !cityData.isActive})}
                >
                  <div className="toggle-slider"></div>
                  <span>{cityData.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        
        <DialogActions className="dialog-actions">
          <Button 
            onClick={handleCloseDialog}
            className="action-button secondary-button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCity} 
            variant="contained"
            color="primary"
            className="action-button primary-button"
          >
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CityManagement;