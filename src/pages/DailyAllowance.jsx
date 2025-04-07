import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Alert, CircularProgress, Tabs, Tab
} from '@mui/material';
import { Add } from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import AllowanceList from '../components/allowances/AllowanceList';
import DailyAllowanceForm from '../components/allowances/DailyAllowanceForm';
import AllowanceDetails from '../components/allowances/AllowanceDetails';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { DailyAllowanceService } from '../services/allowance.service';
import '../styles/components/allowances.css';

const DailyAllowance = () => {
  const { currentUser, isManager } = useAuth();
  const [allowances, setAllowances] = useState([]);
  const [teamAllowances, setTeamAllowances] = useState([]);
  const [selectedAllowance, setSelectedAllowance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchAllowances();
    if (isManager()) {
      fetchTeamAllowances();
    }
  }, [isManager]);
  
  const fetchAllowances = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await DailyAllowanceService.getUserAllowances();
      setAllowances(response);
    } catch (err) {
      setError('Failed to load allowances. Please try again later.');
      console.error('Error fetching allowances:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTeamAllowances = async () => {
    try {
      const response = await DailyAllowanceService.getTeamAllowances();
      setTeamAllowances(response);
    } catch (err) {
      console.error('Error fetching team allowances:', err);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleCreateNew = () => {
    setSelectedAllowance(null);
    setEditMode(false);
    setFormOpen(true);
  };
  
  const handleEdit = (allowance) => {
    setSelectedAllowance(allowance);
    setEditMode(true);
    setFormOpen(true);
  };
  
  const handleView = (allowance) => {
    setSelectedAllowance(allowance);
    setDetailsOpen(true);
  };
  
  const handleDelete = (allowance) => {
    setSelectedAllowance(allowance);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await DailyAllowanceService.deleteAllowance(selectedAllowance.id);
      setDeleteConfirmOpen(false);
      fetchAllowances();
    } catch (err) {
      setError('Failed to delete allowance. Please try again later.');
      console.error('Error deleting allowance:', err);
    }
  };
  
  const handleFormSubmit = async (formData) => {
    try {
      if (editMode) {
        await DailyAllowanceService.updateAllowance(selectedAllowance.id, formData);
      } else {
        await DailyAllowanceService.createAllowance(formData);
      }
      
      setFormOpen(false);
      fetchAllowances();
    } catch (err) {
      setError('Failed to save allowance. Please try again later.');
      console.error('Error saving allowance:', err);
    }
  };
  
  const handleApprove = async (id) => {
    try {
      await DailyAllowanceService.updateStatus(id, 'APPROVED');
      fetchTeamAllowances();
      setDetailsOpen(false);
    } catch (err) {
      setError('Failed to approve allowance. Please try again later.');
      console.error('Error approving allowance:', err);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await DailyAllowanceService.updateStatus(id, 'REJECTED');
      fetchTeamAllowances();
      setDetailsOpen(false);
    } catch (err) {
      setError('Failed to reject allowance. Please try again later.');
      console.error('Error rejecting allowance:', err);
    }
  };
  
  const renderContent = () => {
    if (loading && !allowances.length) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }
    
    if (isManager() && tabValue === 1) {
      return (
        <AllowanceList 
          allowances={teamAllowances} 
          type="da"
          onView={handleView}
          editable={false}
        />
      );
    }
    
    return (
      <AllowanceList 
        allowances={allowances} 
        type="da"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };
  
  return (
    <PageContainer 
      title="Daily Allowance" 
      actions={
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreateNew}
        >
          New Allowance
        </Button>
      }
    >
      {isManager() && (
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="My Allowances" />
            <Tab label="Team Allowances" />
          </Tabs>
        </Paper>
      )}
      
      {renderContent()}
      
      {/* Daily Allowance Form Dialog */}
      <DailyAllowanceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editMode ? selectedAllowance : null}
        isEditMode={editMode}
      />
      
      {/* Daily Allowance Details Dialog */}
      <AllowanceDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        allowance={selectedAllowance}
        type="da"
        onApprove={handleApprove}
        onReject={handleReject}
        canApprove={isManager() && tabValue === 1}
      />
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Allowance"
        message="Are you sure you want to delete this allowance? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </PageContainer>
  );
};

export default DailyAllowance;