import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import PageContainer from '../../components/layout/PageContainer';
import { api } from '../../services/auth.service';
import '../../styles/pages/role-allowance.css';

const RoleAllowanceAdmin = () => {
  const [allowances, setAllowances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  
  useEffect(() => {
    fetchAllowances();
  }, []);
  
  const fetchAllowances = async () => {
    try {
      const response = await api.get('/role-allowances');
      setAllowances(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch role allowances');
      console.error('Error fetching role allowances:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (allowance) => {
    setEditingRole(allowance.role);
    setEditAmount(allowance.daily_amount.toString());
  };
  
  const handleCancel = () => {
    setEditingRole(null);
    setEditAmount('');
  };
  
  const handleSave = async (role) => {
    try {
      const amount = parseFloat(editAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      
      await api.put(`/role-allowances/${role}`, { amount });
      await fetchAllowances();
      setEditingRole(null);
      setEditAmount('');
      setError('');
    } catch (err) {
      setError('Failed to update allowance amount');
      console.error('Error updating allowance:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress className="loading-spinner" />
        <div>Loading role allowances...</div>
      </div>
    );
  }
  
  return (
    <div className="role-allowance-container">
      <div className="role-allowance-header">
        <h1 className="role-allowance-title">Role Allowance Management</h1>
      </div>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} className="error-container">
          <div className="error-message">{error}</div>
        </Alert>
      )}
      
      {/* Role Cards Grid */}
      <div className="role-cards-grid">
        {allowances.slice(0, 3).map((allowance) => (
          <div className="role-card" key={`card-${allowance.role}`}>
            <div className="role-card-header">
              <div className="role-name">{allowance.role}</div>
              {editingRole === allowance.role ? (
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => handleSave(allowance.role)}
                  className="action-button primary-button"
                >
                  Save
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleEdit(allowance)}
                  className="action-button secondary-button"
                >
                  Edit
                </Button>
              )}
            </div>
            
            <div className="role-details">
              <div className="role-detail-item">
                <span className="detail-label">Daily Allowance</span>
                {editingRole === allowance.role ? (
                  <TextField
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    size="small"
                    error={isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0}
                    helperText={isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0 ? 'Enter valid amount' : ''}
                    className="form-input"
                    InputProps={{
                      classes: { root: 'form-input' }
                    }}
                  />
                ) : (
                  <span className="detail-value">${parseFloat(allowance.daily_amount || 0).toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Role Table */}
      <Paper className="allowance-settings">
        <Typography variant="h6" gutterBottom>
          All Role Allowances
        </Typography>
        
        <TableContainer>
          <Table className="role-table">
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell align="right">Daily Allowance Amount ($)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allowances.map((allowance) => (
                <TableRow key={allowance.role}>
                  <TableCell className="role-name">{allowance.role}</TableCell>
                  <TableCell align="right">
                    {editingRole === allowance.role ? (
                      <TextField
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        size="small"
                        error={isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0}
                        helperText={isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0 ? 'Enter valid amount' : ''}
                        className="form-input"
                      />
                    ) : (
                      <span className="detail-value">${parseFloat(allowance.daily_amount || 0).toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editingRole === allowance.role ? (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleSave(allowance.role)}
                          size="small"
                          className="action-button primary-button"
                        >
                          <Save />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={handleCancel}
                          size="small"
                          className="action-button secondary-button"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(allowance)}
                        size="small"
                        className="action-button secondary-button"
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default RoleAllowanceAdmin;