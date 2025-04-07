import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, TableSortLabel, Paper, 
  IconButton, Tooltip, Typography, Box 
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { format } from 'date-fns';
import StatusBadge from '../common/StatusBadge';

const AllowanceList = ({ 
  allowances = [], 
  type = 'da', // 'da' or 'ta'
  onView, 
  onEdit, 
  onDelete,
  editable = true
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };
  
  // Sort the data
  const sortedAllowances = Array.isArray(allowances) ? [...allowances].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    
    if (orderBy === 'date') {
      return order === 'asc' 
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }
    
    return order === 'asc'
      ? aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      : aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  }) : [];
  
  // Get the rows for the current page
  const paginatedAllowances = sortedAllowances.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const hasActionsColumn = !!onView || (editable && (!!onEdit || !!onDelete));
  
  const columns = type === 'da' 
    ? [
        { id: 'date', label: 'Date' },
        { id: 'amount', label: 'Amount', align: 'right' },
        { id: 'status', label: 'Status' },
        { id: 'remarks', label: 'Remarks' },
      ]
    : [
        { id: 'date', label: 'Date' },
        { id: 'fromCity', label: 'From' },
        { id: 'toCity', label: 'To' },
        { id: 'distance', label: 'Distance (km)', align: 'right' },
        { id: 'amount', label: 'Amount', align: 'right' },
        { id: 'status', label: 'Status' },
      ];
  
  if (hasActionsColumn) {
    columns.push({ id: 'actions', label: 'Actions', align: 'center' });
  }
  
  return (
    <Paper className="allowance-list-container">
      <TableContainer className="allowance-table-container">
        <Table aria-label={`${type === 'da' ? 'Daily' : 'Travel'} Allowances`}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sortDirection={orderBy === column.id ? order : false}
                  className="allowance-table-header-cell"
                >
                  {column.id !== 'actions' ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAllowances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body1" className="no-data-message">
                    No {type === 'da' ? 'daily' : 'travel'} allowances found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAllowances.map((allowance) => (
                <TableRow key={allowance.id} className="allowance-table-row">
                  <TableCell>
                    {format(new Date(allowance.date), 'MMM dd, yyyy')}
                  </TableCell>
                  
                  {type === 'ta' && (
                    <>
                      <TableCell>{allowance.fromCity}</TableCell>
                      <TableCell>{allowance.toCity}</TableCell>
                      <TableCell align="right">{allowance.distance}</TableCell>
                    </>
                  )}
                  
                  <TableCell align="right">
                    ${parseFloat(allowance.amount).toFixed(2)}
                  </TableCell>
                  
                  <TableCell>
                    <StatusBadge status={allowance.status} />
                  </TableCell>
                  
                  {type === 'da' && (
                    <TableCell>{allowance.remarks || '-'}</TableCell>
                  )}
                  
                  {hasActionsColumn && (
                    <TableCell align="center" className="actions-cell">
                      {onView && (
                        <Tooltip title="View details">
                          <IconButton 
                            size="small"
                            onClick={() => onView(allowance)}
                            className="view-button"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {editable && onEdit && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(allowance)}
                            disabled={allowance.status !== 'PENDING'}
                            className="edit-button"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {editable && onDelete && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(allowance.id)}
                            disabled={allowance.status !== 'PENDING'}
                            className="delete-button"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={allowances.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="table-pagination"
      />
    </Paper>
  );
};

export default AllowanceList;