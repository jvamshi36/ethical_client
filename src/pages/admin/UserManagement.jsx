import React, { useState, useEffect } from 'react';
import { Typography,
  Button, Box, Alert, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogActions, Chip, Tooltip,
  TextField, MenuItem, InputAdornment, IconButton
} from '@mui/material';
import { 
  Add, Search, Edit, Delete, Visibility, VisibilityOff,
  Person, VerifiedUser, PersonAdd
} from '@mui/icons-material';
import PageContainer from '../../components/layout/PageContainer';
import DataTable from '../../components/common/DataTable';
import UserForm from '../../components/admin/UserForm';
import TeamManagement from '../../components/admin/TeamManagement';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormField from '../../components/common/FormField';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/user.service';
import { ROLES, ROLE_DISPLAY_NAMES } from '../../constants/roles';
import '../../styles/components/admin.css';

const UserManagement = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User form state
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Password reset dialog
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });
  
  // Team management dialog
  const [teamManagementOpen, setTeamManagementOpen] = useState(false);
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Search and filters
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      
      try {
        console.log('Fetching users with filters:', {
          search: searchText,
          role: roleFilter,
          status: statusFilter
        });
        
        const filters = {
          search: searchText,
          role: roleFilter,
          status: statusFilter
        };
        
        const response = await UserService.getUsers(filters);
        
        console.log('Users API Response:', response);
        
        // Validate response
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format');
        }
        
        setUsers(response);
      } catch (err) {
        console.error('Full error details:', err);
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchText, roleFilter, statusFilter]);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters = {};
      if (searchText) filters.search = searchText;
      if (roleFilter) filters.role = roleFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      
      const response = await UserService.getUsers(filters);
      setUsers(response);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    fetchUsers();
  };
  
  const handleCreateUser = () => {
    setSelectedUser(null);
    setEditMode(false);
    setFormOpen(true);
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setFormOpen(true);
  };
  
  const handleViewTeam = (user) => {
    setSelectedUser(user);
    setTeamManagementOpen(true);
  };
  
  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setPasswordData({
      newPassword: '',
      confirmPassword: '',
      showPassword: false
    });
    setPasswordResetOpen(true);
  };
  
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await UserService.deleteUser(selectedUser.id);
      setDeleteConfirmOpen(false);
      setSuccess(`User ${selectedUser.username} has been deleted`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user. Please try again later.');
      console.error('Error deleting user:', err);
    }
  };
  
  const handleUserFormSubmit = async (userData) => {
    try {
      if (editMode) {
        await UserService.updateUser(selectedUser.id, userData);
        setSuccess(`User ${userData.username} has been updated`);
      } else {
        await UserService.createUser(userData);
        setSuccess(`User ${userData.username} has been created`);
      }
      
      setFormOpen(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to save user. Please try again later.');
      console.error('Error saving user:', err);
    }
  };
  
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const togglePasswordVisibility = () => {
    setPasswordData({
      ...passwordData,
      showPassword: !passwordData.showPassword
    });
  };
  
  const handleResetPasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await UserService.resetPassword(selectedUser.id, passwordData.newPassword);
      setPasswordResetOpen(false);
      setSuccess(`Password for user ${selectedUser.username} has been reset`);
    } catch (err) {
      setError('Failed to reset password. Please try again later.');
      console.error('Error resetting password:', err);
    }
  };
  
  // Table columns configuration
  const columns = [
    { 
      id: 'fullName', 
      label: 'Name',
      render: (value, row) => `${value} (${row.username})`
    },
    { id: 'email', label: 'Email' },
    { 
      id: 'role', 
      label: 'Role',
      render: (value) => (
        <Chip 
          label={ROLE_DISPLAY_NAMES[value] || value} 
          color={
            ['ADMIN', 'SUPER_ADMIN'].includes(value) ? 'error' :
            ['ZBM', 'DGM'].includes(value) ? 'warning' :
            ['ABM', 'RBM'].includes(value) ? 'info' : 'default'
          }
          size="small"
        />
      )
    },
    { id: 'department', label: 'Department' },
    { id: 'headquarters', label: 'Headquarters' },
    {
      id: 'isActive',
      label: 'Status',
      render: (value) => (
        <Chip 
          label={value ? 'Active' : 'Inactive'} 
          color={value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Box>
          <Tooltip title="Edit User">
            <IconButton size="small" onClick={() => handleEditUser(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {['ABM', 'RBM', 'ZBM', 'DGM'].includes(row.role) && (
            <Tooltip title="Manage Team">
              <IconButton size="small" onClick={() => handleViewTeam(row)}>
                <PersonAdd fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Reset Password">
            <IconButton size="small" onClick={() => handleResetPassword(row)}>
              <VerifiedUser fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete User">
            <IconButton 
              size="small" 
              onClick={() => handleDeleteUser(row)}
              disabled={row.id === currentUser.id}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];
  
  return (
    <PageContainer 
      title="User Management"
      actions={
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreateUser}
        >
          Add User
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
      
      {/* Search and filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ width: 300 }}
        />
        
        <TextField
          select
          label="Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          {Object.entries(ROLE_DISPLAY_NAMES).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        
        <Button 
          variant="contained"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
      
      {/* Users Data Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        title="Users"
      />
      
      {/* User Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <UserForm
            initialData={selectedUser}
            isEditMode={editMode}
            onSubmit={handleUserFormSubmit}
          />
        </DialogContent>
      </Dialog>
      
      {/* Password Reset Dialog */}
      <Dialog
        open={passwordResetOpen}
        onClose={() => setPasswordResetOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Reset password for user: <strong>{selectedUser?.username}</strong>
            </Typography>
            
            <TextField
              label="New Password"
              name="newPassword"
              type={passwordData.showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {passwordData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={passwordData.showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              required
              margin="normal"
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
              helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordResetOpen(false)}>Cancel</Button>
          <Button
            onClick={handleResetPasswordSubmit}
            variant="contained"
            color="primary"
            disabled={!passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Team Management Dialog */}
      <Dialog
        open={teamManagementOpen}
        onClose={() => setTeamManagementOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Team</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <TeamManagement
              managerId={selectedUser.id}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamManagementOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete User"
        message={`Are you sure you want to delete the user "${selectedUser?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </PageContainer>
  );
};

export default UserManagement;