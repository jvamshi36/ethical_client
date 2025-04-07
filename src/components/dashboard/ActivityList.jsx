import React from 'react';
import { 
  List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, Typography, Divider, Chip 
} from '@mui/material';
import { 
  AttachMoney, CardTravel, PersonAdd, 
  CheckCircle, Cancel, Pending 
} from '@mui/icons-material';
import { format } from 'date-fns';
import '../../styles/components/dashboard.css';

const ActivityList = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'DA':
        return <AttachMoney />;
      case 'TA':
        return <CardTravel />;
      case 'USER':
        return <PersonAdd />;
      default:
        return <AttachMoney />;
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle fontSize="small" />;
      case 'REJECTED':
        return <Cancel fontSize="small" />;
      default:
        return <Pending fontSize="small" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'warning';
    }
  };
  
  return (
    <List className="activity-list">
      {activities.length === 0 ? (
        <Typography variant="body2" className="empty-list">
          No recent activities
        </Typography>
      ) : (
        activities.map((activity, index) => (
          <React.Fragment key={activity.id || index}>
            <ListItem alignItems="flex-start" className="activity-item">
              <ListItemAvatar className="activity-avatar">
                <Avatar className={`avatar-${activity.type.toLowerCase()}`}>
                  {getIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" className="activity-title">
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className="activity-description"
                    >
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" className="activity-date">
                      {format(new Date(activity.date), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Chip
                icon={getStatusIcon(activity.status)}
                label={activity.status}
                color={getStatusColor(activity.status)}
                size="small"
                className="activity-status"
              />
            </ListItem>
            {index < activities.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default ActivityList;