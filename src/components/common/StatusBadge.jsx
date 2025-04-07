import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Cancel, Pending } from '@mui/icons-material';

const StatusBadge = ({ status, size = 'small' }) => {
  let color, icon, label;
  
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      color = 'success';
      icon = <CheckCircle fontSize="small" />;
      label = 'Approved';
      break;
    case 'REJECTED':
      color = 'error';
      icon = <Cancel fontSize="small" />;
      label = 'Rejected';
      break;
    case 'PENDING':
      color = 'warning';
      icon = <Pending fontSize="small" />;
      label = 'Pending';
      break;
    case 'ACTIVE':
      color = 'success';
      icon = <CheckCircle fontSize="small" />;
      label = 'Active';
      break;
    case 'INACTIVE':
      color = 'default';
      icon = <Cancel fontSize="small" />;
      label = 'Inactive';
      break;
    default:
      color = 'default';
      icon = <Pending fontSize="small" />;
      label = status || 'Unknown';
  }
  
  return (<Chip
    icon={icon}
    label={label}
    color={color}
    size={size}
    className={`status-badge status-${label.toLowerCase()}`}
  />
);
};

export default StatusBadge;