import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Alert, CircularProgress,
  Tabs, Tab, Divider, Switch, FormControlLabel, TextField,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select
} from '@mui/material';
import { 
  Add, Edit, Delete, Save, Business, LocationOn,
  Settings, Security, Notifications
} from '@mui/icons-material';
import PageContainer from '../../components/layout/PageContainer';
import FormField from '../../components/common/FormField';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { api } from '../../services/auth.service';
import '../../styles/components/admin.css';

const SystemSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: '',
    allowUserRegistration: false,
    requireManagerApproval: true,
    notifyAdminsOnRegistration: true,
    defaultDailyAllowance: 0,
    daAutoCalculation: true,
    allowExpenseEditing: true
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: false,
    sessionTimeout: 15,
    maxLoginAttempts: 5,
    mfaEnabled: false
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    approvalEmails: true,
    rejectionEmails: true,
    summaryEmailFrequency: 'weekly',
    reminderEmails: true
  });
  
  // Departments
  const [departments, setDepartments] = useState([]);
  const [departmentDialog, setDepartmentDialog] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({ id: null, name: '' });
  const [departmentEditMode, setDepartmentEditMode] = useState(false);
  
  // Headquarters
  const [headquarters, setHeadquarters] = useState([]);
  const [hqDialog, setHqDialog] = useState(false);
  const [currentHq, setCurrentHq] = useState({ id: null, name: '', location: '' });
  const [hqEditMode, setHqEditMode] = useState(false);
  
  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: '', // 'department' or 'headquarters'
    id: null,
    name: ''
  });
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, these would be API calls
      // Simulating API responses for demo purposes
      
      // Fetch settings
      setTimeout(() => {
        // Sample data
        setGeneralSettings({
          companyName: 'Acme Corporation',
          allowUserRegistration: false,
          requireManagerApproval: true,
          notifyAdminsOnRegistration: true,
          defaultDailyAllowance: 30,
          daAutoCalculation: true,
          allowExpenseEditing: true
        });
        
        setSecuritySettings({
          passwordMinLength: 8,
          passwordRequireUppercase: true,
          passwordRequireNumber: true,
          passwordRequireSymbol: false,
          sessionTimeout: 15,
          maxLoginAttempts: 5,
          mfaEnabled: false
        });
        
        setNotificationSettings({
          emailNotifications: true,
          approvalEmails: true,
          rejectionEmails: true,
          summaryEmailFrequency: 'weekly',
          reminderEmails: true
        });
        
        setDepartments([
          { id: 1, name: 'Sales' },
          { id: 2, name: 'Marketing' },
          { id: 3, name: 'Operations' },
          { id: 4, name: 'Finance' },
          { id: 5, name: 'Human Resources' }
        ]);
        
        setHeadquarters([
          { id: 1, name: 'New York', location: 'NY, USA' },
          { id: 2, name: 'Chicago', location: 'IL, USA' },
          { id: 3, name: 'Los Angeles', location: 'CA, USA' },
          { id: 4, name: 'London', location: 'UK' }
        ]);
        
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError('Failed to load settings. Please try again later.');
      console.error('Error fetching settings:', err);
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleGeneralSettingsChange = (e) => {
    const { name, value, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };
  
  const handleSecuritySettingsChange = (e) => {
    const { name, value, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };
  
  const handleNotificationSettingsChange = (e) => {
    const { name, value, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };
  
  const saveGeneralSettings = async () => {
    setError('');
    setSuccess('');
    
    try {
      // In a real application, this would be an API call
      // Simulating API response
      setTimeout(() => {
        setSuccess('General settings saved successfully');
      }, 500);
    } catch (err) {
      setError('Failed to save settings. Please try again later.');
      console.error('Error saving settings:', err);
    }
  };
  
  const saveSecuritySettings = async () => {
    setError('');
    setSuccess('');
    
    try {
      // In a real application, this would be an API call
      // Simulating API response
      setTimeout(() => {
        setSuccess('Security settings saved successfully');
      }, 500);
    } catch (err) {
      setError('Failed to save settings. Please try again later.');
      console.error('Error saving settings:', err);
    }
  };
  
  const saveNotificationSettings = async () => {
    setError('');
    setSuccess('');
    
    try {
      // In a real application, this would be an API call
      // Simulating API response
      setTimeout(() => {
        setSuccess('Notification settings saved successfully');
      }, 500);
    } catch (err) {
      setError('Failed to save settings. Please try again later.');
      console.error('Error saving settings:', err);
    }
  };
  
  // Department handlers
  const handleAddDepartment = () => {
    setCurrentDepartment({ id: null, name: '' });
    setDepartmentEditMode(false);
    setDepartmentDialog(true);
  };
  
  const handleEditDepartment = (department) => {
    setCurrentDepartment({ ...department });
    setDepartmentEditMode(true);
    setDepartmentDialog(true);
  };
  
  const handleDeleteDepartment = (department) => {
    setDeleteDialog({
      open: true,
      type: 'department',
      id: department.id,
      name: department.name
    });
  };
  
  const handleDepartmentInputChange = (e) => {
    setCurrentDepartment({
      ...currentDepartment,
      [e.target.name]: e.target.value
    });
  };
  
  const saveDepartment = async () => {
    if (!currentDepartment.name) {
      setError('Department name is required');
      return;
    }
    
    try {
      if (departmentEditMode) {
        // Update existing department
        const updatedDepartments = departments.map(dept => 
          dept.id === currentDepartment.id ? currentDepartment : dept
        );
        setDepartments(updatedDepartments);
      } else {
        // Add new department
        const newDepartment = {
          ...currentDepartment,
          id: Date.now() // Generate a temporary id
        };
        setDepartments([...departments, newDepartment]);
      }
      
      setDepartmentDialog(false);
      setSuccess(`Department ${departmentEditMode ? 'updated' : 'added'} successfully`);
    } catch (err) {
      setError(`Failed to ${departmentEditMode ? 'update' : 'add'} department. Please try again later.`);
      console.error('Error saving department:', err);
    }
  };
  
  // Headquarters handlers
  const handleAddHq = () => {
    setCurrentHq({ id: null, name: '', location: '' });
    setHqEditMode(false);
    setHqDialog(true);
  };
  
  const handleEditHq = (hq) => {
    setCurrentHq({ ...hq });
    setHqEditMode(true);
    setHqDialog(true);
  };
  
  const handleDeleteHq = (hq) => {
    setDeleteDialog({
      open: true,
      type: 'headquarters',
      id: hq.id,
      name: hq.name
    });
  };
  
  const handleHqInputChange = (e) => {
    setCurrentHq({
      ...currentHq,
      [e.target.name]: e.target.value
    });
  };
  
  const saveHq = async () => {
    if (!currentHq.name || !currentHq.location) {
      setError('Headquarters name and location are required');
      return;
    }
    
    try {
      if (hqEditMode) {
        // Update existing headquarters
        const updatedHqs = headquarters.map(hq => 
          hq.id === currentHq.id ? currentHq : hq
        );
        setHeadquarters(updatedHqs);
      } else {
        // Add new headquarters
        const newHq = {
          ...currentHq,
          id: Date.now() // Generate a temporary id
        };
        setHeadquarters([...headquarters, newHq]);
      }
      
      setHqDialog(false);
      setSuccess(`Headquarters ${hqEditMode ? 'updated' : 'added'} successfully`);
    } catch (err) {
      setError(`Failed to ${hqEditMode ? 'update' : 'add'} headquarters. Please try again later.`);
      console.error('Error saving headquarters:', err);
    }
  };
  
  // Handle deletion confirmation
  const confirmDelete = async () => {
    try {
      if (deleteDialog.type === 'department') {
        // Delete department
        const filteredDepartments = departments.filter(dept => dept.id !== deleteDialog.id);
        setDepartments(filteredDepartments);
      } else if (deleteDialog.type === 'headquarters') {
        // Delete headquarters
        const filteredHqs = headquarters.filter(hq => hq.id !== deleteDialog.id);
        setHeadquarters(filteredHqs);
      }
      
      setDeleteDialog({ open: false, type: '', id: null, name: '' });
      setSuccess(`${deleteDialog.type === 'department' ? 'Department' : 'Headquarters'} deleted successfully`);
    } catch (err) {
      setError(`Failed to delete ${deleteDialog.type}. Please try again later.`);
      console.error('Error deleting:', err);
    }
  };
  
  if (loading) {
    return (
      <PageContainer title="System Settings">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer title="System Settings">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Settings />} label="General" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Business />} label="Departments" />
          <Tab icon={<LocationOn />} label="Headquarters" />
        </Tabs>
      </Paper>
      
      {/* General Settings Tab */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            General Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Company Name"
                name="companyName"
                value={generalSettings.companyName}
                onChange={handleGeneralSettingsChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Default Daily Allowance"
                name="defaultDailyAllowance"
                type="number"
                value={generalSettings.defaultDailyAllowance}
                onChange={handleGeneralSettingsChange}
                fullWidth
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.allowUserRegistration}
                    onChange={handleGeneralSettingsChange}
                    name="allowUserRegistration"
                  />
                }
                label="Allow User Self-Registration"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.requireManagerApproval}
                    onChange={handleGeneralSettingsChange}
                    name="requireManagerApproval"
                  />
                }
                label="Require Manager Approval for Expenses"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.notifyAdminsOnRegistration}
                    onChange={handleGeneralSettingsChange}
                    name="notifyAdminsOnRegistration"
                  />
                }
                label="Notify Admins on New Registrations"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.daAutoCalculation}
                    onChange={handleGeneralSettingsChange}
                    name="daAutoCalculation"
                  />
                }
                label="Auto-Calculate Daily Allowance"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.allowExpenseEditing}
                    onChange={handleGeneralSettingsChange}
                    name="allowExpenseEditing"
                  />
                }
                label="Allow Editing of Submitted Expenses"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveGeneralSettings}
              startIcon={<Save />}
            >
              Save Settings
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Security Settings Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Minimum Password Length"
                name="passwordMinLength"
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={handleSecuritySettingsChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Session Timeout (minutes)"
                name="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={handleSecuritySettingsChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Max Login Attempts"
                name="maxLoginAttempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={handleSecuritySettingsChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.mfaEnabled}
                    onChange={handleSecuritySettingsChange}
                    name="mfaEnabled"
                  />
                }
                label="Enable Multi-Factor Authentication"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.passwordRequireUppercase}
                    onChange={handleSecuritySettingsChange}
                    name="passwordRequireUppercase"
                  />
                }
                label="Require Uppercase Letters in Password"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.passwordRequireNumber}
                    onChange={handleSecuritySettingsChange}
                    name="passwordRequireNumber"
                  />
                }
                label="Require Numbers in Password"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.passwordRequireSymbol}
                    onChange={handleSecuritySettingsChange}
                    name="passwordRequireSymbol"
                  />
                }
                label="Require Symbols in Password"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveSecuritySettings}
              startIcon={<Save />}
            >
              Save Settings
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Notification Settings Tab */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationSettingsChange}
                    name="emailNotifications"
                  />
                }
                label="Enable Email Notifications"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.approvalEmails}
                    onChange={handleNotificationSettingsChange}
                    name="approvalEmails"
                  />
                }
                label="Send Approval Notifications"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.rejectionEmails}
                    onChange={handleNotificationSettingsChange}
                    name="rejectionEmails"
                  />
                }
                label="Send Rejection Notifications"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.reminderEmails}
                    onChange={handleNotificationSettingsChange}
                    name="reminderEmails"
                  />
                }
                label="Send Reminder Emails"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Summary Email Frequency"
                name="summaryEmailFrequency"
                value={notificationSettings.summaryEmailFrequency}
                onChange={handleNotificationSettingsChange}
                fullWidth
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="never">Never</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveNotificationSettings}
              startIcon={<Save />}
            >
              Save Settings
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Departments Tab */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Departments
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddDepartment}
            >
              Add Department
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <List>
            {departments.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                No departments found. Add your first department.
              </Typography>
            ) : (
              departments.map(department => (
                <ListItem key={department.id} divider>
                  <ListItemText primary={department.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditDepartment(department)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteDepartment(department)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
      
      {/* Headquarters Tab */}
      {tabValue === 4 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Headquarters
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddHq}
            >
              Add Headquarters
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <List>
            {headquarters.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                No headquarters found. Add your first headquarters.
              </Typography>
            ) : (
              headquarters.map(hq => (
                <ListItem key={hq.id} divider>
                  <ListItemText 
                    primary={hq.name} 
                    secondary={hq.location}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditHq(hq)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteHq(hq)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
      
      {/* Department Dialog */}
      <Dialog
        open={departmentDialog}
        onClose={() => setDepartmentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {departmentEditMode ? 'Edit Department' : 'Add Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Department Name"
              name="name"
              value={currentDepartment.name}
              onChange={handleDepartmentInputChange}
              fullWidth
              required
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepartmentDialog(false)}>Cancel</Button>
          <Button
            onClick={saveDepartment}
            variant="contained"
            color="primary"
            disabled={!currentDepartment.name}
          >
            {departmentEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Headquarters Dialog */}
      <Dialog
        open={hqDialog}
        onClose={() => setHqDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {hqEditMode ? 'Edit Headquarters' : 'Add Headquarters'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Headquarters Name"
              name="name"
              value={currentHq.name}
              onChange={handleHqInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Location"
              name="location"
              value={currentHq.location}
              onChange={handleHqInputChange}
              fullWidth
              required
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHqDialog(false)}>Cancel</Button>
          <Button
            onClick={saveHq}
            variant="contained"
            color="primary"
            disabled={!currentHq.name || !currentHq.location}
          >
            {hqEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title={`Delete ${deleteDialog.type === 'department' ? 'Department' : 'Headquarters'}`}
        message={`Are you sure you want to delete ${deleteDialog.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}
      />
    </PageContainer>
  );
};

export default SystemSettings;
                  
                  