import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SummaryCard = ({ title, mainValue, secondaryValue, icon, color }) => {
  return (
    <div className="summary-card">
      <div className="card-title">{title}</div>
      <div className="card-value" style={{ 
        background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text'
      }}>
        {mainValue}
      </div>
      <div className="card-subtitle">{secondaryValue}</div>
      <Box className="card-icon" sx={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.2, color }}>
        {icon}
      </Box>
    </div>
  );
};

export default SummaryCard;