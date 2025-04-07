import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      className="confirm-dialog"
    >
      <DialogTitle className="dialog-title">
        {title}
        <IconButton
          aria-label="close"
          onClick={onCancel}
          className="close-button"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="dialog-content">
        <DialogContentText className="dialog-message">
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions className="dialog-actions">
        <Button
          onClick={onCancel}
          variant="outlined"
          className="cancel-button"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          autoFocus
          className="confirm-button"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;