import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Grid, FormControl, InputLabel, Select,
  MenuItem, Typography, Switch, FormControlLabel, InputAdornment, IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { api } from '../../services/auth.service';
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
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  
  useEffect(() => {
    fetchReferenceData();
  }, []);
  
  const fetchReferenceData = async () => {
    try {
      // Fetch departments
      const deptResponse = await api.get('/reference/departments');
      setDepartments(deptResponse.data);
      
      // Fetch headquarters
      const hqResponse = await api.get('/reference/headquarters');
      setHeadquarters(hqResponse.data);
      
      // Fetch roles
      const rolesResponse = await api.get('/reference/roles');
      setRoles(rolesResponse.data);
      
      // Fetch potential managers
      const managersResponse = await api.get('/users?roles=ABM,RBM,ZBM,DGM');
      setManagers(managersResponse.data);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  
  return (
    <form onSubmit={handleSubmit} className="user-form">
      <Typography variant="h6" className="form-title">
        {isEditMode ? 'Edit User' : 'Create New User'}
      </Typography>
      
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
            className="form-input"
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
            className="form-input"
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
            className="form-input"
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
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="form-input"
            />
          </Grid>
        )}
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth required error={!!errors.role} className="form-input">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              {roles.map(role => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth required error={!!errors.department} className="form-input">
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              label="Department"
            >
              {departments.map(dept => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth required error={!!errors.headquarters} className="form-input">
            <InputLabel>Headquarters</InputLabel>
            <Select
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              label="Headquarters"
            >
              {headquarters.map(hq => (
                <MenuItem key={hq.id} value={hq.name}>
                  {hq.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth className="form-input">
            <InputLabel>Reporting Manager</InputLabel>
            <Select
              name="reportingManagerId"
              value={formData.reportingManagerId}
              onChange={handleChange}
              label="Reporting Manager"
            >
              <MenuItem value="">None</MenuItem>
              {managers.map(manager => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.full_name} ({manager.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleSwitchChange}
                name="isActive"
                className="status-switch"
              />
            }
            label="Active User"
            className="form-switch"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
          >
            {isEditMode ? 'Update User' : 'Create User'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;