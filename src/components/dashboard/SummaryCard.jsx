import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const SummaryCard = ({ title, mainValue, secondaryValue, icon, color }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 2,
          color: color || '#1976d2',
          opacity: 0.2,
          transform: 'scale(1.5)'
        }}
      >
        {icon}
      </Box>
      
      <Typography
        variant="subtitle2"
        color="textSecondary"
        gutterBottom
      >
        {title}
      </Typography>
      
      <Typography
        variant="h4"
        component="div"
        sx={{ 
          fontWeight: 'bold',
          color: color || '#1976d2',
          mb: 1
        }}
      >
        {mainValue}
      </Typography>
      
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mt: 'auto' }}
      >
        {secondaryValue}
      </Typography>
    </Paper>
  );
};

export default SummaryCard;