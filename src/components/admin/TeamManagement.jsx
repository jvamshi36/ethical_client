import React, { useState, useEffect } from 'react';
import { 
  Typography, Paper, FormControl, InputLabel, Select, 
  MenuItem, Box, Chip, Avatar, Button, Divider,
  List, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, 
  IconButton, Alert 
} from '@mui/material';
import { PersonAdd, Delete } from '@mui/icons-material';
import { api } from '../../services/auth.service';
import '../../styles/components/admin.css';

const TeamManagement = ({ managerId, initialTeam = [] }) => {
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(initialTeam);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  
  useEffect(() => {
    fetchAvailableMembers();
  }, [managerId]);
  
  const fetchAvailableMembers = async () => {
    try {
      // Fetch potential team members (lower-level roles)
      const response = await api.get('/users?roles=BE,BM,SBM');
      
      // Filter out already selected members
      const availableUsers = response.data.filter(
        user => !selectedMembers.some(member => member.id === user.id)
      );
      
      setAvailableMembers(availableUsers);
    } catch (error) {
      console.error('Error fetching available members:', error);
      setError('Failed to load available team members');
    }
  };
  
  const handleAddMember = () => {
    if (!selectedMember) return;
    
    const memberToAdd = availableMembers.find(member => member.id === selectedMember);
    if (memberToAdd) {
      setSelectedMembers([...selectedMembers, memberToAdd]);
      setAvailableMembers(availableMembers.filter(member => member.id !== selectedMember));
      setSelectedMember('');
    }
  };
  
  const handleRemoveMember = (memberId) => {
    const memberToRemove = selectedMembers.find(member => member.id === memberId);
    if (memberToRemove) {
      setSelectedMembers(selectedMembers.filter(member => member.id !== memberId));
      setAvailableMembers([...availableMembers, memberToRemove]);
    }
  };
  
  const handleSaveTeam = async () => {
    try {
      await api.post(`/users/${managerId}/team`, {
        teamMembers: selectedMembers.map(member => member.id)
      });
      
      alert('Team saved successfully');
    } catch (error) {
      console.error('Error saving team:', error);
      setError('Failed to save team. Please try again.');
    }
  };
  
  return (
    <Paper className="team-management">
      <Typography variant="h6" className="section-title">
        Team Management
      </Typography>
      
      {error && <Alert severity="error" className="error-alert">{error}</Alert>}
      
      <Box className="add-member-container">
        <FormControl fullWidth className="member-select">
          <InputLabel>Add Team Member</InputLabel>
          <Select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            label="Add Team Member"
          >
            <MenuItem value="">Select a member</MenuItem>
            {availableMembers.map(member => (
              <MenuItem key={member.id} value={member.id}>
                {member.full_name} ({member.role})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={handleAddMember}
          disabled={!selectedMember}
          className="add-button"
        >
          Add
        </Button>
      </Box>
      
      <Divider className="divider" />
      
      <Typography variant="subtitle1" className="section-subtitle">
        Current Team Members
      </Typography>
      
      {selectedMembers.length === 0 ? (
        <Typography variant="body2" color="textSecondary" className="empty-message">
          No team members assigned yet
        </Typography>
      ) : (
        <List className="member-list">
          {selectedMembers.map(member => (
            <ListItem key={member.id} className="member-item">
              <ListItemAvatar className="member-avatar">
                <Avatar>{member.full_name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.full_name}
                secondary={member.role}
                className="member-text"
              />
              <ListItemSecondaryAction className="member-action">
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveMember(member.id)}
                  className="remove-button"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      
      <Box className="actions-container">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveTeam}
          className="save-button"
        >
          Save Team
        </Button>
      </Box>
    </Paper>
  );
};

export default TeamManagement;