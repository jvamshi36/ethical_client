import React from 'react';
import { Assignment } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const ActivityList = ({ activities = [] }) => {
  if (!activities.length) {
    return (
      <Box textAlign="center" py={2}>
        <Typography variant="body2" color="textSecondary">
          No recent activities to display
        </Typography>
      </Box>
    );
  }

  // Get status class based on status
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-success';
      case 'pending':
        return 'status-warning';
      case 'rejected':
        return 'status-danger';
      default:
        return '';
    }
  };

  // Get status background color
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'pending':
        return { backgroundColor: '#fff3e0', color: '#ef6c00' };
      case 'rejected':
        return { backgroundColor: '#fbe9e7', color: '#d32f2f' };
      default:
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
    }
  };

  // Get highlight color style for the vertical bar
  const getHighlightColor = (type) => {
    return type?.toLowerCase() === 'travel' ? '#00bcd4' : '#2196f3';
  };

  return (
    <div className="activity-list">
      {activities.map((activity, index) => (
        <div 
          className="activity-item" 
          key={index}
          style={{ 
            position: 'relative', 
            padding: '16px 16px 16px 32px',
            borderLeft: `4px solid ${getHighlightColor(activity.type)}`,
            marginBottom: '10px',
            backgroundColor: '#f9f9f9',
            borderRadius: '0 4px 4px 0'
          }}
        >
          <Box position="absolute" left="10px" top="50%" sx={{ transform: 'translateY(-50%)' }}>
            <Assignment style={{ color: getHighlightColor(activity.type) }} />
          </Box>
          
          <div className="activity-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="activity-title" style={{ fontWeight: 500 }}>
                {activity.title || (activity.type === 'travel' ? 'Travel Allowance' : 'Daily Allowance')}
              </div>
              {activity.status && (
                <span 
                  style={{ 
                    ...getStatusStyle(activity.status),
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'uppercase'
                  }}
                >
                  {activity.status}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;