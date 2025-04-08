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
  const [formData, setFormData] = useState(initialData || {
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
  
  useEffect(() => {
    fetchReferenceData();
  }, []);
  
  useEffect(() => {
    if (formData.role) {
      fetchManagers();
    }
  }, [formData.role]);
  
  const fetchReferenceData = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const [deptResponse, hqResponse] = await Promise.all([
        api.get('/reference/departments'),
        api.get('/reference/headquarters')
      ]);
      
      setDepartments(deptResponse.data || []);
      setHeadquarters(hqResponse.data || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
      setApiError('Failed to fetch reference data. Please try again later.');
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
      }
      
      if (managerRoles) {
        const response = await api.get(`/users?roles=${managerRoles}`);
        setManagers(response.data || []);
      } else {
        setManagers([]);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      setApiError('Failed to fetch managers. Please try again later.');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    if (name === 'role') {
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
    
    if (!['DGM', 'ZBM'].includes(formData.role) && !formData.reportingManagerId) {
      newErrors.reportingManagerId = 'Reporting manager is required for this role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
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
              {departments.map(dept => (
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
              {headquarters.map(hq => (
                <MenuItem key={hq.id} value={hq.name}>
                  {hq.name}
                </MenuItem>
              ))}
            </Select>
            {errors.headquarters && <FormHelperText>{errors.headquarters}</FormHelperText>}
          </FormControl>
        </Grid>
        
        {formData.role && !['DGM', 'ZBM'].includes(formData.role) && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.reportingManagerId}>
              <InputLabel>Reporting Manager</InputLabel>
              <Select
                name="reportingManagerId"
                value={formData.reportingManagerId}
                onChange={handleChange}
                label="Reporting Manager"
              >
                <MenuItem value="">Select Manager</MenuItem>
                {managers.map(manager => (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.full_name} ({manager.role})
                  </MenuItem>
                ))}
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