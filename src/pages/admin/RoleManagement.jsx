import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Alert, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Switch, FormGroup, FormControlLabel, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Edit, Save, Add } from '@mui/icons-material';
import PageContainer from '../../components/layout/PageContainer';
import { ROLES, ROLE_DISPLAY_NAMES } from '../../constants/roles';
import { api } from '../../services/auth.service';
import '../styles/components/admin.css';

const RoleManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionDialog, setPermissionDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  
  // Custom role dialog
  const [customRoleDialog, setCustomRoleDialog] = useState(false);
  const [customRoleData, setCustomRoleData] = useState({
    name: '',
    displayName: '',
    description: ''
  });
  
  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);
  
  const fetchRolesAndPermissions = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would be an API call
      // Simulating API response
      
      setTimeout(() => {
        // Define permissions
        const perms = [
          { id: 'view_da', name: 'View Daily Allowance', description: 'View daily allowance records' },
          { id: 'create_da', name: 'Create Daily Allowance', description: 'Create new daily allowance records' },
          { id: 'edit_da', name: 'Edit Daily Allowance', description: 'Edit existing daily allowance records' },
          { id: 'delete_da', name: 'Delete Daily Allowance', description: 'Delete daily allowance records' },
          { id: 'view_ta', name: 'View Travel Allowance', description: 'View travel allowance records' },
          { id: 'create_ta', name: 'Create Travel Allowance', description: 'Create new travel allowance records' },
          { id: 'edit_ta', name: 'Edit Travel Allowance', description: 'Edit existing travel allowance records' },
          { id: 'delete_ta', name: 'Delete Travel Allowance', description: 'Delete travel allowance records' },
          { id: 'approve_allowances', name: 'Approve Allowances', description: 'Approve allowance requests' },
          { id: 'reject_allowances', name: 'Reject Allowances', description: 'Reject allowance requests' },
          { id: 'view_team', name: 'View Team', description: 'View team members' },
          { id: 'manage_team', name: 'Manage Team', description: 'Manage team members' },
          { id: 'view_reports', name: 'View Reports', description: 'View reports and analytics' },
          { id: 'export_data', name: 'Export Data', description: 'Export data and reports' },
          { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, and delete users' },
          { id: 'manage_roles', name: 'Manage Roles', description: 'Manage roles and permissions' },
          { id: 'manage_settings', name: 'Manage Settings', description: 'Manage system settings' }
        ];
        
        setPermissions(perms);
        
        // Define roles with permissions
        const rolesList = [
          {
            id: ROLES.BE,
            name: ROLES.BE,
            displayName: ROLE_DISPLAY_NAMES[ROLES.BE],
            description: 'Basic user role with limited access to personal allowances',
            permissions: ['view_da', 'create_da', 'view_ta', 'create_ta'],
            editable: false
          },
          {
            id: ROLES.BM,
            name: ROLES.BM,
            displayName: ROLE_DISPLAY_NAMES[ROLES.BM],
            description: 'Business Manager with access to personal allowances',
            permissions: ['view_da', 'create_da', 'edit_da', 'view_ta', 'create_ta', 'edit_ta'],
            editable: false
          },
          {
            id: ROLES.SBM,
            name: ROLES.SBM,
            displayName: ROLE_DISPLAY_NAMES[ROLES.SBM],
            description: 'Senior Business Manager with expanded personal access',
            permissions: ['view_da', 'create_da', 'edit_da', 'delete_da', 'view_ta', 'create_ta', 'edit_ta', 'delete_ta'],
            editable: false
          },
          {
            id: ROLES.ABM,
            name: ROLES.ABM,
            displayName: ROLE_DISPLAY_NAMES[ROLES.ABM],
            description: 'Area Business Manager with team management capabilities',
            permissions: ['view_da', 'create_da', 'edit_da', 'delete_da', 'view_ta', 'create_ta', 'edit_ta', 'delete_ta', 'approve_allowances', 'reject_allowances', 'view_team', 'view_reports'],
            editable: true
          },
          {
            id: ROLES.RBM,
            name: ROLES.RBM,
            displayName: ROLE_DISPLAY_NAMES[ROLES.RBM],
            description: 'Regional Business Manager with broader team oversight',
            permissions: ['view_da', 'create_da', 'edit_da', 'delete_da', 'view_ta', 'create_ta', 'edit_ta', 'delete_ta', 'approve_allowances', 'reject_allowances', 'view_team', 'manage_team', 'view_reports', 'export_data'],
            editable: true
          },
          {
            id: ROLES.ZBM,
            name: ROLES.ZBM,
            displayName: ROLE_DISPLAY_NAMES[ROLES.ZBM],
            description: 'Zonal Business Manager with multi-team management',
            permissions: ['view_da', 'create_da', 'edit_da', 'delete_da', 'view_ta', 'create_ta', 'edit_ta', 'delete_ta', 'approve_allowances', 'reject_allowances', 'view_team', 'manage_team', 'view_reports', 'export_data'],
            editable: true
          },
          {
            id: ROLES.DGM,
            name: ROLES.DGM,
            displayName: ROLE_DISPLAY_NAMES[ROLES.DGM],
            description: 'Deputy General Manager with senior management access',
            permissions: ['view_da', 'create_da', 'edit_da', 'delete_da', 'view_ta', 'create_ta', 'edit_ta', 'delete_ta', 'approve_allowances', 'reject_allowances', 'view_team', 'manage_team', 'view_reports', 'export_data'],
            editable: true
          },
          {
            id: ROLES.ADMIN,
            name: ROLES.ADMIN,
            displayName: ROLE_DISPLAY_NAMES[ROLES.ADMIN],
            description: 'Administrator with system management capabilities',
            permissions: perms.map(p => p.id),
            editable: false
          },
          {
            id: ROLES.SUPER_ADMIN,
            name: ROLES.SUPER_ADMIN,
            displayName: ROLE_DISPLAY_NAMES[ROLES.SUPER_ADMIN],
            description: 'Super Administrator with full system access',
            permissions: perms.map(p => p.id),
            editable: false
          },
          {
            id: 'CUSTOM_ROLE',
            name: 'CUSTOM_ROLE',
            displayName: 'Custom Role',
            description: 'Custom role with specific permissions',
            permissions: ['view_da', 'create_da', 'view_ta', 'create_ta', 'view_reports'],
            editable: true
          }
        ];
        
        setRoles(rolesList);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError('Failed to load roles and permissions. Please try again later.');
      console.error('Error fetching roles and permissions:', err);
      setLoading(false);
    }
  };
  
  const handleEditRole = (role) => {
    setCurrentRole(role);
    setPermissionDialog(true);
  };
  
  const handlePermissionChange = (permissionId) => {
    const currentPermissions = [...currentRole.permissions];
    const index = currentPermissions.indexOf(permissionId);
    
    if (index > -1) {
      currentPermissions.splice(index, 1);
    } else {
      currentPermissions.push(permissionId);
    }
    
    setCurrentRole({
      ...currentRole,
      permissions: currentPermissions
    });
  };
  
  const saveRolePermissions = async () => {
    try {
      // Update the role in the roles array
      const updatedRoles = roles.map(role => 
        role.id === currentRole.id ? currentRole : role
      );
      
      setRoles(updatedRoles);
      setPermissionDialog(false);
      setSuccess('Role permissions updated successfully');
    } catch (err) {
      setError('Failed to update role permissions. Please try again later.');
      console.error('Error updating role permissions:', err);
    }
  };
  
  const handleAddCustomRole = () => {
    setCustomRoleData({
      name: '',
      displayName: '',
      description: ''
    });
    setCustomRoleDialog(true);
  };
  
  const handleCustomRoleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomRoleData({
      ...customRoleData,
      [name]: value
    });
  };
  
  const saveCustomRole = async () => {
    if (!customRoleData.name || !customRoleData.displayName) {
      setError('Role name and display name are required');
      return;
    }
    
    try {
      // Create a new role
      const newRole = {
        id: customRoleData.name.toUpperCase().replace(/\s+/g, '_'),
        name: customRoleData.name.toUpperCase().replace(/\s+/g, '_'),
        displayName: customRoleData.displayName,
        description: customRoleData.description,
        permissions: ['view_da', 'view_ta'], // Default permissions
        editable: true
      };
      
      setRoles([...roles, newRole]);
      setCustomRoleDialog(false);
      setSuccess('Custom role created successfully');
    } catch (err) {
      setError('Failed to create custom role. Please try again later.');
      console.error('Error creating custom role:', err);
    }
  };
  
  if (loading) {
    return (
      <PageContainer title="Role Management">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer 
      title="Role Management"
      actions={
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCustomRole}
        >
          Add Custom Role
        </Button>
      }
    >
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
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Roles
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Manage role permissions and access rights for the system. Some built-in roles cannot be edited.
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{role.displayName}</Typography>
                    <Typography variant="caption" color="textSecondary">{role.name}</Typography>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {role.permissions.length > 3 ? (
                        <>
                          {role.permissions.slice(0, 3).map(permId => {
                            const perm = permissions.find(p => p.id === permId);
                            return (
                              <Chip
                                key={permId}
                                label={perm ? perm.name : permId}
                                size="small"
                                variant="outlined"
                              />
                            );
                          })}
                          <Chip
                            label={`+${role.permissions.length - 3} more`}
                            size="small"
                            color="primary"
                          />
                        </>
                      ) : (
                        role.permissions.map(permId => {
                          const perm = permissions.find(p => p.id === permId);
                          return (
                            <Chip
                              key={permId}
                              label={perm ? perm.name : permId}
                              size="small"
                              variant="outlined"
                            />
                          );
                        })
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditRole(role)}
                      disabled={!role.editable}
                    >
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Role Permissions Dialog */}
      <Dialog
        open={permissionDialog}
        onClose={() => setPermissionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Permissions for {currentRole?.displayName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Select the permissions you want to grant to this role.
          </Typography>
          
          <Grid container spacing={2}>
            {permissions.map(permission => (
              <Grid item xs={12} sm={6} key={permission.id}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentRole?.permissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                        name={permission.id}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">{permission.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {permission.description}
                        </Typography>
                      </Box>
                    }
                  />
                </FormGroup>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionDialog(false)}>Cancel</Button>
          <Button
            onClick={saveRolePermissions}
            variant="contained"
            color="primary"
            startIcon={<Save />}
          >
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Custom Role Dialog */}
      <Dialog
        open={customRoleDialog}
        onClose={() => setCustomRoleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add Custom Role
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Role Name"
              name="name"
              value={customRoleData.name}
              onChange={handleCustomRoleInputChange}
              fullWidth
              required
              margin="normal"
              helperText="A unique identifier (will be converted to uppercase with underscores)"
            />
            <TextField
              label="Display Name"
              name="displayName"
              value={customRoleData.displayName}
              onChange={handleCustomRoleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={customRoleData.description}
              onChange={handleCustomRoleInputChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomRoleDialog(false)}>Cancel</Button>
          <Button
            onClick={saveCustomRole}
            variant="contained"
            color="primary"
            disabled={!customRoleData.name || !customRoleData.displayName}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default RoleManagement;