import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, TableSortLabel, Paper,
  Checkbox, Typography, Box, Toolbar, IconButton,
  Tooltip, InputAdornment, TextField
} from '@mui/material';
import {
  FilterList, Search, Delete, Refresh
} from '@mui/icons-material';
import '../../styles/components/futuristic.css';

const DataTable = ({
  columns = [],
  data = [],
  title = '',
  selectable = false,
  onRowClick,
  onSelectionChange,
  actions = null,
  searchEnabled = true,
  searchFields = [],
  refreshEnabled = true,
  onRefresh,
  deleteEnabled = false,
  onDelete,
  loading = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState(columns[0]?.id || '');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState('');
  
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
  
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredData.map((n) => n.id);
      setSelected(newSelecteds);
      onSelectionChange && onSelectionChange(newSelecteds);
      return;
    }
    setSelected([]);
    onSelectionChange && onSelectionChange([]);
  };
  
  const handleClick = (event, id, row) => {
    if (selectable) {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
      
      if (selectedIndex === -1) {
        newSelected = [...selected, id];
      } else {
        newSelected = selected.filter(item => item !== id);
      }
      
      setSelected(newSelected);
      onSelectionChange && onSelectionChange(newSelected);
    } else if (onRowClick) {
      onRowClick(row);
    }
  };
  
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };
  
  const handleRefresh = () => {
    onRefresh && onRefresh();
  };
  
  const handleDelete = () => {
    onDelete && onDelete(selected);
    setSelected([]);
  };
  
  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  // Filter data based on search
  const filteredData = Array.isArray(data) ? (searchText && searchEnabled && searchFields.length > 0
    ? data.filter(row => 
        searchFields.some(field => 
          String(row[field])
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      )
    : data) : [];

  // Sort data
  const sortedData = filteredData.length > 0 ? [...filteredData].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return order === 'asc'
      ? aValue - bValue
      : bValue - aValue;
  }): [];
  
  // Paginate data
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  return (
    <Paper className="data-table-container">
      {(title || searchEnabled || refreshEnabled || deleteEnabled || actions) && (
        <Toolbar className="table-toolbar">
          <Box className="toolbar-left">
            {title && (
              <Typography variant="h6" className="table-title">
                {title}
              </Typography>
            )}
          </Box>
          
          <Box className="toolbar-right">
            {searchEnabled && (
              <TextField
                size="small"
                placeholder="Search"
                value={searchText}
                onChange={handleSearchChange}
                className="search-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            
            {refreshEnabled && (
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} className="refresh-button">
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
            
            {deleteEnabled && selected.length > 0 && (
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete} className="delete-button">
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
            
            {actions}
          </Box>
        </Toolbar>
      )}
      
      <TableContainer className="table-container">
        <Table aria-label={title || "data table"}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredData.length}
                    checked={filteredData.length > 0 && selected.length === filteredData.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all' }}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sortDirection={orderBy === column.id ? order : false}
                  className="table-header-cell"
                  style={{ width: column.width }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  align="center"
                  className="loading-cell"
                >
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  align="center"
                  className="no-data-cell"
                >
                  <Typography>No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const isItemSelected = selectable && isSelected(row.id);
                const labelId = `data-table-checkbox-${index}`;
                
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id, row)}
                    role={selectable ? "checkbox" : undefined}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id || index}
                    selected={isItemSelected}
                    className={`table-row ${isItemSelected ? 'selected' : ''}`}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell 
                          key={column.id} 
                          align={column.align || 'left'}
                          className="table-cell"
                        >
                          {column.render ? column.render(value, row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="table-pagination"
      />
    </Paper>
  );
};

export default DataTable;