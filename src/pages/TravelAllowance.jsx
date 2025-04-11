import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, Grid, Box, Paper, Alert, CircularProgress, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { Add, InfoOutlined, Close } from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import AllowanceList from '../components/allowances/AllowanceList';
import TravelAllowanceForm from '../components/allowances/TravelAllowanceForm';
import AllowanceDetails from '../components/allowances/AllowanceDetails';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { TravelAllowanceService } from '../services/allowance.service';
import '../styles/components/allowances.css';
import '../styles/pages/travel-allowance.css';

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
  
  const handleFormClose = () => {
    setFormOpen(false);
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
        <div className="loading-container">
          <CircularProgress className="loading-spinner" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="error-container">
          <Alert severity="error" className="error-message">
            {error}
          </Alert>
        </div>
      );
    }
    
    if (tabValue === 1) {
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
    <PageContainer>
      <div className="travel-allowance-container">
        <div className="page-header-container">
          <h1 className="travel-allowance-title">
            Travel Allowance
          </h1>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNew}
            className="new-allowance-button"
          >
            NEW TRAVEL ALLOWANCE
          </Button>
        </div>
        
        <div className="tabs-container">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            className="allowance-tabs"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#00bcd4',
                height: '3px'
              }
            }}
          >
            <Tab label="MY ALLOWANCES" className={tabValue === 0 ? 'active-tab' : ''} />
            <Tab label="TEAM ALLOWANCES" className={tabValue === 1 ? 'active-tab' : ''} />
          </Tabs>
        </div>
        
        <div className="route-section chart-section">
          {renderContent()}
        </div>
        
        {/* Modal Dialog for the form */}
        <Dialog 
          open={formOpen} 
          onClose={handleFormClose}
          maxWidth="md"
          fullWidth
          className="form-dialog"
        >
          <DialogTitle className="dialog-title">
            <Typography variant="h6">
              {editMode ? 'Edit Travel Allowance' : 'New Travel Allowance'}
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
          <DialogContent className="dialog-content">
            {formOpen && (
              <TravelAllowanceForm
                editMode={editMode}
                initialData={selectedAllowance}
                onSubmit={handleFormSubmit}
                onClose={handleFormClose}
                userRoutes={userRoutes}
              />
            )}
          </DialogContent>
        </Dialog>
        
        <AllowanceDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          allowance={selectedAllowance}
          type="ta"
          onApprove={handleApprove}
          onReject={handleReject}
          isManager={isManager()}
        />
        
        <ConfirmDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Travel Allowance"
          content="Are you sure you want to delete this travel allowance? This action cannot be undone."
        />
      </div>
    </PageContainer>
  );
};

export default TravelAllowance;