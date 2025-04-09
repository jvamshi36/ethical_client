// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Box, Paper, Alert, CircularProgress,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import { 
  Add, Search, FilterList
} from '@mui/icons-material';
import PageContainer from '../../components/layout/PageContainer';
import DataTable from '../../components/common/DataTable';
import UserForm from '../../components/admin/UserForm';
import UserDetails from './UserDetails';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/user.service';
import { ROLE_DISPLAY_NAMES } from '../../constants/roles';
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
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Search and filters
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters = {};
      if (searchText) filters.search = searchText;
      if (roleFilter) filters.role = roleFilter;
      if (statusFilter !== 'all') filters.status = statusFilter === 'active';
      
      const response = await UserService.getUsers(filters);
      setUsers(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Failed to load users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
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

  const handleViewUserDetails = (user) => {
    setSelectedUserForDetails(user);
  };
  
  const handleCloseUserDetails = () => {
    setSelectedUserForDetails(null);
    fetchUsers(); // Refresh the list when closing details
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
      console.error('Error saving user:', err);
      setError('Failed to save user. Please try again later.');
    }
  };
  
  const handleSearch = () => {
    fetchUsers();
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
      render: (value) => ROLE_DISPLAY_NAMES[value] || value
    },
    { id: 'department', label: 'Department' },
    { id: 'headquarters', label: 'Headquarters' },
    {
      id: 'isActive',
      label: 'Status',
      render: (value) => value ? 'Active' : 'Inactive'
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => handleViewUserDetails(row)}
          >
            View Details
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => handleEditUser(row)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            color="error"
            onClick={() => handleDeleteUser(row)}
            disabled={row.id === currentUser?.id}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ];
  
  // If viewing user details, show that component
  if (selectedUserForDetails) {
    return (
      <UserDetails 
        user={selectedUserForDetails} 
        onBack={handleCloseUserDetails}
        onUserUpdate={fetchUsers}
      />
    );
  }
  
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
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Search"
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
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          
          <TextField
            select
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            SelectProps={{
              native: true,
            }}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <option value="">All Roles</option>
            {Object.entries(ROLE_DISPLAY_NAMES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </TextField>
          
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            SelectProps={{
              native: true,
            }}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </TextField>
          
          <Button 
            variant="contained" 
            startIcon={<FilterList />}
            onClick={handleSearch}
          >
            Filter
          </Button>
        </Box>
      </Paper>
      
      {/* Users Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
          />
        </Paper>
      )}
      
      {/* User Form Dialog */}
      {formOpen && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editMode ? 'Edit User' : 'Add New User'}
          </Typography>
          <UserForm
            initialData={selectedUser}
            isEditMode={editMode}
            onSubmit={handleUserFormSubmit}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={() => setFormOpen(false)}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
      
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