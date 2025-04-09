import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Alert, CircularProgress, Tabs, Tab
} from '@mui/material';
import { Add, InfoOutlined } from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import AllowanceList from '../components/allowances/AllowanceList';
import TravelAllowanceForm from '../components/allowances/TravelAllowanceForm';
import AllowanceDetails from '../components/allowances/AllowanceDetails';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { TravelAllowanceService } from '../services/allowance.service';
import '../styles/components/allowances.css';

const TravelAllowance = () => {
  const { currentUser, isManager } = useAuth();
  const [allowances, setAllowances] = useState([]);
  const [teamAllowances, setTeamAllowances] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
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
    fetchUserRoutes();
    if (isManager()) {
      fetchTeamAllowances();
    }
  }, [isManager]);
  
  const fetchAllowances = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await TravelAllowanceService.getUserAllowances();
      setAllowances(response);
    } catch (err) {
      setError('Failed to load travel allowances. Please try again later.');
      console.error('Error fetching travel allowances:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserRoutes = async () => {
    try {
      const response = await TravelAllowanceService.getUserTravelRoutes();
      setUserRoutes(response);
    } catch (err) {
      console.error('Error fetching user travel routes:', err);
    }
  };
  
  const fetchTeamAllowances = async () => {
    try {
      const response = await TravelAllowanceService.getTeamAllowances();
      setTeamAllowances(response);
    } catch (err) {
      console.error('Error fetching team travel allowances:', err);
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
      await TravelAllowanceService.deleteAllowance(selectedAllowance.id);
      setDeleteConfirmOpen(false);
      fetchAllowances();
    } catch (err) {
      setError('Failed to delete travel allowance. Please try again later.');
      console.error('Error deleting travel allowance:', err);
    }
  };
  
  const handleFormSubmit = async (formData) => {
    try {
      if (editMode) {
        await TravelAllowanceService.updateAllowance(selectedAllowance.id, formData);
      } else {
        await TravelAllowanceService.createAllowance(formData);
      }
      
      setFormOpen(false);
      fetchAllowances();
    } catch (err) {
      setError('Failed to save travel allowance. Please try again later.');
      console.error('Error saving travel allowance:', err);
    }
  };
  
  const handleApprove = async (id) => {
    try {
      await TravelAllowanceService.updateStatus(id, 'APPROVED');
      fetchTeamAllowances();
      setDetailsOpen(false);
    } catch (err) {
      setError('Failed to approve travel allowance. Please try again later.');
      console.error('Error approving travel allowance:', err);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await TravelAllowanceService.updateStatus(id, 'REJECTED');
      fetchTeamAllowances();
      setDetailsOpen(false);
    } catch (err) {
      setError('Failed to reject travel allowance. Please try again later.');
      console.error('Error rejecting travel allowance:', err);
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
          type="ta"
          onView={handleView}
          editable={false}
        />
      );
    }
    
    // Check if user has any configured routes
    if (userRoutes && userRoutes.length === 0) {
      return (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center">
            <InfoOutlined sx={{ mr: 1 }} />
            <Box>
              <Typography variant="subtitle1">No Travel Routes Configured</Typography>
              <Typography variant="body2">
                You don't have any travel routes configured in your profile. Please contact your administrator to set up travel routes.
              </Typography>
            </Box>
          </Box>
        </Alert>
      );
    }
    
    return (
      <AllowanceList 
        allowances={allowances} 
        type="ta"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };
  
  return (
    <PageContainer 
      title="Travel Allowance" 
      actions={
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleCreateNew}
          disabled={userRoutes && userRoutes.length === 0}
        >
          New Travel
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
            <Tab label="My Travels" />
            <Tab label="Team Travels" />
          </Tabs>
        </Paper>
      )}
      
      {/* Information box about travel allowances */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center">
          <InfoOutlined sx={{ mr: 1 }} />
          <Typography>
            Travel allowances are based on predefined routes in your profile. Allowance amounts are calculated automatically based on the distance.
          </Typography>
        </Box>
      </Alert>
      
      {renderContent()}
      
      {/* Travel Allowance Form Dialog */}
      {formOpen && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <TravelAllowanceForm
              onSubmit={handleFormSubmit}
              initialData={editMode ? selectedAllowance : null}
              isEditMode={editMode}
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
        </Box>
      )}
      
      {/* Travel Allowance Details Dialog */}
      <AllowanceDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        allowance={selectedAllowance}
        type="ta"
        onApprove={handleApprove}
        onReject={handleReject}
        canApprove={isManager() && tabValue === 1}
      />
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Travel Allowance"
        message="Are you sure you want to delete this travel allowance? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </PageContainer>
  );
};

export default TravelAllowance;