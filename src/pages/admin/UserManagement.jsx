import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, Button, Box, Paper, Alert, CircularProgress, 
  TextField, InputAdornment, IconButton, Collapse,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  Add, Search, FilterList, Close
} from '@mui/icons-material';
import PageContainer from '../../components/layout/PageContainer';
import DataTable from '../../components/common/DataTable';
import UserForm from '../../components/admin/UserForm';
import UserDetails from './UserDetails';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/user.service';
import { ROLE_DISPLAY_NAMES } from '../../constants/roles';
import '../../styles/pages/user-management.css';
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Create a ref for the UserForm component
  const formRef = useRef(null);
  
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
  
  const handleFormClose = () => {
    setFormOpen(false);
  };
  
  const handleSubmitForm = () => {
    // Check if the formRef exists and has a submitForm method
    if (formRef.current && typeof formRef.current.submitForm === 'function') {
      formRef.current.submitForm();
    } else {
      console.error('Form ref or submitForm method not available');
    }
  };
  
  const handleSearch = () => {
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchText('');
    setRoleFilter('');
    setStatusFilter('all');
    fetchUsers();
  };
  
  // Table columns configuration
  const columns = [
    { 
      id: 'fullName', 
      label: 'Name',
      render: (value, row) => `${value || 'undefined'} (${row.username})`
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
      render: (value) => {
        // Convert value to boolean to ensure proper rendering
        const isActiveBoolean = value === true || value === 'true' || value === 't';
        return (
          <span className={`user-status ${isActiveBoolean ? 'status-active' : 'status-inactive'}`}>
            {isActiveBoolean ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Box className="action-buttons">
          <Button 
            className="view-details-button"
            size="small" 
            variant="outlined" 
            onClick={() => handleViewUserDetails(row)}
          >
            VIEW DETAILS
          </Button>
          <Button 
            className="edit-button"
            size="small" 
            variant="outlined" 
            onClick={() => handleEditUser(row)}
          >
            EDIT
          </Button>
          <Button 
            className="delete-button"
            size="small" 
            variant="outlined" 
            onClick={() => handleDeleteUser(row)}
            disabled={row.id === currentUser?.id}
          >
            DELETE
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
    <div className="user-management-container">
      <div className="user-management-header">
        <h1 className="user-management-title">User Management</h1>
        
        <Button
          className="action-button primary-button"
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateUser}
        >
          ADD USER
        </Button>
      </div>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="filter-toggle-button"
        >
          {filtersOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')} className="error-container">
          <div className="error-message">{error}</div>
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      {/* User Stats Section */}
      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{users.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-value">{users.filter(user => user.isActive).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Inactive Users</div>
          <div className="stat-value">{users.filter(user => !user.isActive).length}</div>
        </div>
      </div>
      
      {/* Filters Section */}
      <Collapse in={filtersOpen}>
        <Paper className="filter-section">
          <div className="filter-grid">
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
              className="form-group"
              size="small"
              fullWidth
            />
            
            <TextField
              select
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              SelectProps={{
                native: true,
              }}
              className="form-group"
              size="small"
              fullWidth
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
              className="form-group"
              size="small"
              fullWidth
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </TextField>
          </div>
          
          <div className="filter-actions">
            <Button 
              className="action-button secondary-button"
              variant="outlined"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button 
              className="action-button primary-button"
              variant="contained" 
              onClick={handleSearch}
            >
              Apply Filters
            </Button>
          </div>
        </Paper>
      </Collapse>
      
      {/* Users Table */}
      {loading ? (
        <div className="loading-container">
          <CircularProgress className="loading-spinner" />
        </div>
      ) : (
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.id}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((column) => (
                    <td key={column.id}>
                      {column.render 
                        ? column.render(row[column.id], row) 
                        : row[column.id] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* User Form Modal Dialog */}
      <Dialog 
        open={formOpen} 
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        className="form-dialog"
      >
        <DialogTitle className="form-dialog-title">
          <Typography variant="h6">
            {editMode ? 'Edit User' : 'Add New User'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleFormClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <UserForm
            ref={formRef}
            initialData={selectedUser}
            isEditMode={editMode}
            onSubmit={handleUserFormSubmit}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
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
        className="dialog-container"
      />
    </div>
  );
};

export default UserManagement;