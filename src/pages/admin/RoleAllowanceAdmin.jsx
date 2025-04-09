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
  Box
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import PageContainer from '../../components/layout/PageContainer';
import { api } from '../../services/auth.service';

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
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <PageContainer title="Role Allowance Management">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper>
        <TableContainer>
          <Table>
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
                  <TableCell>{allowance.role}</TableCell>
                  <TableCell align="right">
                    {editingRole === allowance.role ? (
                      <TextField
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        size="small"
                        error={isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0}
                        helperText={isNaN(parseFloat(editAmount)) || parseFloat(editAmount) <= 0 ? 'Enter valid amount' : ''}
                      />
                    ) : (
                      `$${parseFloat(allowance.daily_amount || 0).toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {editingRole === allowance.role ? (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleSave(allowance.role)}
                          size="small"
                        >
                          <Save />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={handleCancel}
                          size="small"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(allowance)}
                        size="small"
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
    </PageContainer>
  );
};

export default RoleAllowanceAdmin;