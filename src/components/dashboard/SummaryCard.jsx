import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import '../../styles/components/dashboard.css';

const SummaryCard = ({ title, mainValue, secondaryValue, icon, color }) => {
  return (
    <Card className="summary-card">
      <CardContent>
        <Box className="card-header">
          <Avatar className="card-icon" style={{ backgroundColor: color }}>
            {icon}
          </Avatar>
          <Typography variant="subtitle1" className="card-title">
            {title}
          </Typography>
        </Box>
        
        <Typography variant="h4" className="card-value">
          {mainValue}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" className="card-subvalue">
          {secondaryValue}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;