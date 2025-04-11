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
import '../../styles/components/user-form.css';

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
      
      setDepartments(Array.isArray(deptResponse.data) ? deptResponse.data : []);
      setHeadquarters(Array.isArray(hqResponse.data) ? hqResponse.data : []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
      setApiError('Failed to fetch reference data. Please try again later.');
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
        setManagers([]);
        return;
      }
      
      if (managerRoles) {
        const url = formData.headquarters 
          ? `/users?roles=${managerRoles}&headquarters=${encodeURIComponent(formData.headquarters)}`
          : `/users?roles=${managerRoles}`;
          
        const response = await api.get(url);
        setManagers(Array.isArray(response.data) ? response.data : []);
      } else {
        setManagers([]);
      }
    } catch (err) {
      console.error('Error fetching managers:', err);
      setApiError('Failed to fetch managers. Please try again later.');
      setManagers([]);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'reportingManagerId') {
      newValue = value === null || value === undefined ? '' : String(value);
    }
    
    const newFormData = { ...formData, [name]: newValue };
    
    if (name === 'role' || name === 'headquarters') {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress className="loading-spinner" />
      </div>
    );
  }
  
  return (
    <div className="user-form-container">
      <form onSubmit={handleSubmit} id="user-form" className="user-form">
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} className="warning-alert">
            {apiError}
          </Alert>
        )}
        
        <Typography variant="subtitle1" className="form-section-title">
          User Information
        </Typography>
        
        <Grid container spacing={3} className="form-grid">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.fullName}
              helperText={errors.fullName}
              className="form-input"
              placeholder="Enter full name"
              InputProps={{
                style: { fontSize: '1rem', padding: '2px 0' }
              }}
              InputLabelProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
              className="form-input"
              placeholder="Enter email address"
              InputProps={{
                style: { fontSize: '1rem', padding: '2px 0' }
              }}
              InputLabelProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
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
              className="form-input"
              placeholder="Enter username"
              InputProps={{
                style: { fontSize: '1rem', padding: '2px 0' }
              }}
              InputLabelProps={{
                style: { fontSize: '1.1rem' }
              }}
            />
          </Grid>
          
          {!isEditMode && (
            <Grid item xs={12} sm={6} md={6}>
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
                className="form-input password-field"
                placeholder="Enter password"
                InputProps={{
                  style: { fontSize: '1rem', padding: '2px 0' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { fontSize: '1.1rem' }
                }}
              />
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
                  size="medium"
                />
              }
              label="Active User"
              className="user-status-switch"
            />
          </Grid>
        </Grid>
        
        <Typography variant="subtitle1" className="form-section-title" sx={{ mt: 3 }}>
          Organization Details
        </Typography>
        
        <Grid container spacing={3} className="form-grid">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth error={!!errors.role} className="form-input dropdown-field">
              <InputLabel style={{ fontSize: '1.1rem' }}>User Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="User Role"
                placeholder="Select role"
                sx={{
                  fontSize: '1rem',
                  '& .MuiSelect-select': {
                    padding: '16px 14px',
                  }
                }}
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
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth error={!!errors.department} className="form-input dropdown-field">
              <InputLabel style={{ fontSize: '1.1rem' }}>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                label="Department"
                placeholder="Select department"
                sx={{
                  fontSize: '1rem',
                  '& .MuiSelect-select': {
                    padding: '16px 14px',
                  }
                }}
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
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth error={!!errors.headquarters} className="form-input dropdown-field">
              <InputLabel style={{ fontSize: '1.1rem' }}>Headquarters</InputLabel>
              <Select
                name="headquarters"
                value={formData.headquarters}
                onChange={handleChange}
                label="Headquarters"
                placeholder="Select headquarters"
                sx={{
                  fontSize: '1rem',
                  '& .MuiSelect-select': {
                    padding: '16px 14px',
                  }
                }}
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
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth error={!!errors.reportingManagerId} className="form-input dropdown-field">
                <InputLabel style={{ fontSize: '1.1rem' }}>Reporting Manager</InputLabel>
                <Select
                  name="reportingManagerId"
                  value={formData.reportingManagerId}
                  onChange={handleChange}
                  label="Reporting Manager"
                  placeholder="Select reporting manager"
                  sx={{
                    fontSize: '1rem',
                    '& .MuiSelect-select': {
                      padding: '16px 14px',
                    }
                  }}
                >
                  <MenuItem value="">None Selected</MenuItem>
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
                <FormHelperText>Optional: Select a reporting manager</FormHelperText>
              </FormControl>
            </Grid>
          )}
        </Grid>
        
        <div className="action-buttons">
          <Button 
            type="button"
            variant="outlined"
            className="cancel-button"
            onClick={() => {}}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="submit-button"
            id="user-form-submit"
          >
            {isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </div>
        
        {/* Hidden submit button for external triggering */}
        <input type="submit" style={{ display: 'none' }} />
      </form>
    </div>
  );
};

export default UserForm;