import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, Paper, Table, TableContainer, 
  TableHead, TableBody, TableRow, TableCell, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, FormHelperText, Snackbar, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../../services/auth.service';
import RoleAllowanceAdmin from '../../pages/admin/RoleAllowanceAdmin';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SystemSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentDialog, setDepartmentDialog] = useState(false);
  const [headquartersDialog, setHeadquartersDialog] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({ name: '', description: '' });
  const [currentHeadquarters, setCurrentHeadquarters] = useState({ name: '', location: '', address: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch departments
      const deptResponse = await api.get('/departments');
      setDepartments(deptResponse.data || []);
      
      // Fetch headquarters
      const hqResponse = await api.get('/headquarters');
      setHeadquarters(hqResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load data. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Department handlers
  const openDepartmentDialog = (department = null) => {
    if (department) {
      setCurrentDepartment(department);
      setIsEditMode(true);
    } else {
      setCurrentDepartment({ name: '', description: '' });
      setIsEditMode(false);
    }
    setErrors({});
    setDepartmentDialog(true);
  };
  
  const handleDepartmentChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartment({ ...currentDepartment, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateDepartment = () => {
    const newErrors = {};
    if (!currentDepartment.name) newErrors.name = 'Department name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const saveDepartment = async () => {
    if (!validateDepartment()) return;
    
    try {
      if (isEditMode) {
        await api.put(`/departments/${currentDepartment.id}`, currentDepartment);
        setSnackbar({
          open: true,
          message: 'Department updated successfully',
          severity: 'success'
        });
      } else {
        await api.post('/departments', currentDepartment);
        setSnackbar({
          open: true,
          message: 'Department added successfully',
          severity: 'success'
        });
      }
      
      // Refresh data
      fetchData();
      setDepartmentDialog(false);
    } catch (error) {
      console.error('Error saving department:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save department',
        severity: 'error'
      });
    }
  };
  
  const deleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    
    try {
      await api.delete(`/departments/${id}`);
      setSnackbar({
        open: true,
        message: 'Department deleted successfully',
        severity: 'success'
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error deleting department:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete department',
        severity: 'error'
      });
    }
  };
  
  // Headquarters handlers
  const openHeadquartersDialog = (hq = null) => {
    if (hq) {
      setCurrentHeadquarters(hq);
      setIsEditMode(true);
    } else {
      setCurrentHeadquarters({ name: '', location: '', address: '' });
      setIsEditMode(false);
    }
    setErrors({});
    setHeadquartersDialog(true);
  };
  
  const handleHeadquartersChange = (e) => {
    const { name, value } = e.target;
    setCurrentHeadquarters({ ...currentHeadquarters, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateHeadquarters = () => {
    const newErrors = {};
    if (!currentHeadquarters.name) newErrors.name = 'Headquarters name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const saveHeadquarters = async () => {
    if (!validateHeadquarters()) return;
    
    try {
      if (isEditMode) {
        await api.put(`/headquarters/${currentHeadquarters.id}`, currentHeadquarters);
        setSnackbar({
          open: true,
          message: 'Headquarters updated successfully',
          severity: 'success'
        });
      } else {
        await api.post('/headquarters', currentHeadquarters);
        setSnackbar({
          open: true,
          message: 'Headquarters added successfully',
          severity: 'success'
        });
      }
      
      // Refresh data
      fetchData();
      setHeadquartersDialog(false);
    } catch (error) {
      console.error('Error saving headquarters:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save headquarters',
        severity: 'error'
      });
    }
  };
  
  const deleteHeadquarters = async (id) => {
    if (!window.confirm('Are you sure you want to delete this headquarters?')) return;
    
    try {
      await api.delete(`/headquarters/${id}`);
      setSnackbar({
        open: true,
        message: 'Headquarters deleted successfully',
        severity: 'success'
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error deleting headquarters:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete headquarters',
        severity: 'error'
      });
    }
  };
  
  return (
    <Box>
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Departments" />
          <Tab label="Headquarters" />
          <Tab label="Role Allowances" />
        </Tabs>
        
        {/* Departments Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Departments</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => openDepartmentDialog()}
            >
              Add Department
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell width="150">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Loading...</TableCell>
                  </TableRow>
                ) : departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No departments found</TableCell>
                  </TableRow>
                ) : (
                  departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>{dept.name}</TableCell>
                      <TableCell>{dept.description}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => openDepartmentDialog(dept)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => deleteDepartment(dept.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Headquarters Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Headquarters</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => openHeadquartersDialog()}
            >
              Add Headquarters
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell width="150">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Loading...</TableCell>
                  </TableRow>
                ) : headquarters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No headquarters found</TableCell>
                  </TableRow>
                ) : (
                  headquarters.map((hq) => (
                    <TableRow key={hq.id}>
                      <TableCell>{hq.name}</TableCell>
                      <TableCell>{hq.location}</TableCell>
                      <TableCell>{hq.address}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => openHeadquartersDialog(hq)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => deleteHeadquarters(hq.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Role Allowances Tab */}
        <TabPanel value={tabValue} index={2}>
          <RoleAllowanceAdmin />
        </TabPanel>
      </Paper>
      
      {/* Department Dialog */}
      <Dialog 
        open={departmentDialog} 
        onClose={() => setDepartmentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditMode ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth error={!!errors.name} sx={{ mb: 2 }}>
              <TextField
                label="Department Name"
                name="name"
                value={currentDepartment.name}
                onChange={handleDepartmentChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </FormControl>
            
            <TextField
              label="Description"
              name="description"
              value={currentDepartment.description}
              onChange={handleDepartmentChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepartmentDialog(false)}>Cancel</Button>
          <Button 
            onClick={saveDepartment} 
            variant="contained" 
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Headquarters Dialog */}
      <Dialog 
        open={headquartersDialog} 
        onClose={() => setHeadquartersDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditMode ? 'Edit Headquarters' : 'Add Headquarters'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth error={!!errors.name} sx={{ mb: 2 }}>
              <TextField
                label="Headquarters Name"
                name="name"
                value={currentHeadquarters.name}
                onChange={handleHeadquartersChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </FormControl>
            
            <TextField
              label="Location"
              name="location"
              value={currentHeadquarters.location}
              onChange={handleHeadquartersChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Address"
              name="address"
              value={currentHeadquarters.address}
              onChange={handleHeadquartersChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHeadquartersDialog(false)}>Cancel</Button>
          <Button 
            onClick={saveHeadquarters} 
            variant="contained" 
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;