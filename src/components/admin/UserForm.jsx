import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Grid, FormControl, InputLabel, Select,
  MenuItem, Typography, Switch, FormControlLabel, InputAdornment, IconButton,
  Box, Alert, CircularProgress
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { api } from '../../services/auth.service';
import { ROLES, ROLE_DISPLAY_NAMES } from '../../constants/roles';
import '../../styles/components/admin.css';

const UserForm = ({ onSubmit, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: '',
    department: '',
    headquarters: '',
    reportingManagerId: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  // Initialize form with initialData if in edit mode
  useEffect(() => {
    if (initialData) {
      // Ensure reportingManagerId is a string or empty string
      const reportingId = initialData.reportingManagerId || '';
      
      setFormData({
        username: initialData.username || '',
        password: '',  // Don't populate password in edit mode
        email: initialData.email || '',
        fullName: initialData.fullName || '',
        role: initialData.role || '',
        department: initialData.department || '',
        headquarters: initialData.headquarters || '',
        reportingManagerId: String(reportingId), // Ensure it's a string
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
      
      console.log('Initialized form with reportingManagerId:', String(reportingId));
    }
    fetchReferenceData();
  }, [initialData]);
  
  // Fetch managers when role or headquarters changes
  useEffect(() => {
    if (formData.role) {
      fetchManagers();
    }
  }, [formData.role, formData.headquarters]);
  
  const fetchReferenceData = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const [deptResponse, hqResponse] = await Promise.all([
        api.get('/reference/departments'),
        api.get('/reference/headquarters')
      ]);
      
      // Ensure departments is an array
      setDepartments(Array.isArray(deptResponse.data) ? deptResponse.data : []);
      // Ensure headquarters is an array
      setHeadquarters(Array.isArray(hqResponse.data) ? hqResponse.data : []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
      setApiError('Failed to fetch reference data. Please try again later.');
      // Initialize with empty arrays to prevent mapping errors
      setDepartments([]);
      setHeadquarters([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchManagers = async () => {
    if (!formData.role) return;
    
    try {
      let managerRoles = '';
      if ([ROLES.BE, ROLES.BM, ROLES.SBM].includes(formData.role)) {
        managerRoles = `${ROLES.ABM},${ROLES.RBM}`;
      } else if ([ROLES.ABM, ROLES.RBM].includes(formData.role)) {
        managerRoles = `${ROLES.DGM},${ROLES.ZBM}`;
      } else {
        // No manager roles needed for top-level roles
        setManagers([]);
        return;
      }
      
      if (managerRoles) {
        // Include headquarters in the query to filter managers by the same headquarters
        const url = formData.headquarters 
          ? `/users?roles=${managerRoles}&headquarters=${encodeURIComponent(formData.headquarters)}`
          : `/users?roles=${managerRoles}`;
          
        console.log('Fetching managers with URL:', url);
        const response = await api.get(url);
        
        // Log the response for debugging
        console.log('Managers response:', response.data);
        
        // Ensure managers is an array
        setManagers(Array.isArray(response.data) ? response.data : []);
      } else {
        setManagers([]);
      }
    } catch (err) {
      console.error('Error fetching managers:', err);
      setApiError('Failed to fetch managers. Please try again later.');
      // Initialize with empty array to prevent mapping errors
      setManagers([]);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Special handling for reportingManagerId to ensure it's a string or empty string
    if (name === 'reportingManagerId') {
      // Convert any non-string value to string, or empty string if null/undefined
      newValue = value === null || value === undefined ? '' : String(value);
      console.log(`Converted reportingManagerId from ${value} to ${newValue}`);
    }
    
    const newFormData = { ...formData, [name]: newValue };
    
    // Reset reportingManagerId when role changes
    if (name === 'role') {
      newFormData.reportingManagerId = '';
    }
    
    // Reset reportingManagerId when headquarters changes
    if (name === 'headquarters') {
      newFormData.reportingManagerId = '';
    }
    
    setFormData(newFormData);
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'Username is required';
    if (!isEditMode && !formData.password) newErrors.password = 'Password is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.headquarters) newErrors.headquarters = 'Headquarters is required';
    
    // Make reporting manager optional for all roles
    // The field will still show up for relevant roles, but it's not mandatory
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        // If we're in edit mode, include the ID in the log
        if (isEditMode && initialData) {
          console.log('Submitting edited user data with ID:', initialData.id);
        }
        
        // Log the form data being submitted
        console.log('Submitting form data:', formData);
        
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
        setApiError('Failed to save user. Please try again.');
      }
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="user-form">
      <Typography variant="h6" gutterBottom>
        {isEditMode ? 'Edit User' : 'Create New User'}
      </Typography>
      
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.username}
            helperText={errors.username}
            disabled={isEditMode}
          />
        </Grid>
        
        {!isEditMode && (
          <Grid item xs={12} md={6}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="">Select Role</MenuItem>
              {Object.entries(ROLE_DISPLAY_NAMES).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              label="Department"
            >
              <MenuItem value="">Select Department</MenuItem>
              {Array.isArray(departments) && departments.map(dept => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
            {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.headquarters}>
            <InputLabel>Headquarters</InputLabel>
            <Select
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              label="Headquarters"
            >
              <MenuItem value="">Select Headquarters</MenuItem>
              {Array.isArray(headquarters) && headquarters.map(hq => (
                <MenuItem key={hq.id} value={hq.name}>
                  {hq.name}
                </MenuItem>
              ))}
            </Select>
            {errors.headquarters && <FormHelperText>{errors.headquarters}</FormHelperText>}
          </FormControl>
        </Grid>
        
        {formData.role && !['DGM', 'ZBM', 'ADMIN', 'SUPER_ADMIN'].includes(formData.role) && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.reportingManagerId}>
              <InputLabel>Reporting Manager (Optional)</InputLabel>
              <Select
                name="reportingManagerId"
                value={formData.reportingManagerId}
                onChange={handleChange}
                label="Reporting Manager (Optional)"
              >
                <MenuItem value="">None</MenuItem>
                {Array.isArray(managers) && managers.length > 0 ? (
                  managers.map(manager => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.fullName || manager.full_name} ({manager.role})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No managers available</MenuItem>
                )}
              </Select>
              {errors.reportingManagerId && (
                <FormHelperText>{errors.reportingManagerId}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleSwitchChange}
                name="isActive"
                color="primary"
              />
            }
            label="Active User"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            {isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;