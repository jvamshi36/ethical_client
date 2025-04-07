import React from 'react';
import { Container, Paper, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PageContainer = ({ 
  title, 
  breadcrumbs = [], 
  actions = null, 
  children,
  maxWidth = 'lg',
  padding = true
}) => {
  return (
    <Container maxWidth={maxWidth} className="page-container">
      <div className="page-header">
        <div>
          <Typography variant="h4" className="page-title">{title}</Typography>
          
          {breadcrumbs.length > 0 && (
            <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
              <Link component={RouterLink} to="/" color="inherit">Home</Link>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography key={index} color="textPrimary">{crumb.label}</Typography>
                ) : (
                  <Link 
                    key={index} 
                    component={RouterLink} 
                    to={crumb.path} 
                    color="inherit"
                  >
                    {crumb.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
        </div>
        
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      
      <Paper 
        elevation={2} 
        className={`page-content ${padding ? 'with-padding' : ''}`}
      >
        {children}
      </Paper>
    </Container>
  );
};

export default PageContainer;