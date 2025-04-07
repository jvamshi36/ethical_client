import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Grid, Box, Divider, Chip,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { format } from 'date-fns';
import StatusBadge from '../common/StatusBadge';

const AllowanceDetails = ({ 
  open, 
  onClose, 
  allowance, 
  type = 'da',  // 'da' or 'ta' 
  onApprove,
  onReject,
  canApprove = false
}) => {
  if (!allowance) {
    return null;
  }
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="allowance-details-dialog"
    >
      <DialogTitle className="dialog-title">
        {type === 'da' ? 'Daily' : 'Travel'} Allowance Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="close-button"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers className="dialog-content">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className="status-container">
              <Typography variant="subtitle2" className="field-label">
                Status:
              </Typography>
              <StatusBadge status={allowance.status} size="large" />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="field-label">
              Date:
            </Typography>
            <Typography variant="body1" className="field-value">
              {format(new Date(allowance.date), 'MMMM dd, yyyy')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="field-label">
              Amount:
            </Typography>
            <Typography variant="body1" className="field-value amount">
              ${parseFloat(allowance.amount).toFixed(2)}
            </Typography>
          </Grid>
          
          {type === 'ta' && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="field-label">
                  From:
                </Typography>
                <Typography variant="body1" className="field-value">
                  {allowance.fromCity}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="field-label">
                  To:
                </Typography>
                <Typography variant="body1" className="field-value">
                  {allowance.toCity}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="field-label">
                  Distance:
                </Typography>
                <Typography variant="body1" className="field-value">
                  {allowance.distance} km
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="field-label">
                  Travel Mode:
                </Typography>
                <Typography variant="body1" className="field-value">
                  {allowance.travelMode}
                </Typography>
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" className="field-label">
              Remarks:
            </Typography>
            <Typography variant="body1" className="field-value remarks">
              {allowance.remarks || 'No remarks provided'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider className="section-divider" />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="field-label">
              Submitted By:
            </Typography>
            <Typography variant="body1" className="field-value">
              {allowance.user?.full_name || 'Unknown'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="field-label">
              Submitted On:
            </Typography>
            <Typography variant="body1" className="field-value">
              {format(new Date(allowance.created_at), 'MMMM dd, yyyy HH:mm')}
            </Typography>
          </Grid>
          
          {allowance.status !== 'PENDING' && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="field-label">
                  {allowance.status === 'APPROVED' ? 'Approved' : 'Rejected'} By:
                </Typography>
                <Typography variant="body1" className="field-value">
                  {allowance.approver?.full_name || 'Unknown'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="field-label">
                  {allowance.status === 'APPROVED' ? 'Approved' : 'Rejected'} On:
                </Typography>
                <Typography variant="body1" className="field-value">
                  {allowance.approved_at ? format(new Date(allowance.approved_at), 'MMMM dd, yyyy HH:mm') : '-'}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} variant="outlined" className="cancel-button">
          Close
        </Button>
        
        {canApprove && allowance.status === 'PENDING' && (
          <>
            <Button 
              onClick={() => onApprove && onApprove(allowance.id)}
              variant="contained" 
              color="success"
              className="approve-button"
            >
              Approve
            </Button>
            <Button 
              onClick={() => onReject && onReject(allowance.id)}
              variant="contained" 
              color="error"
              className="reject-button"
            >
              Reject
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AllowanceDetails;