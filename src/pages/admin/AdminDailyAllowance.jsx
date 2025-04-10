import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Paper, Alert, CircularProgress, 
  TextField, InputAdornment, IconButton, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Search, FilterList, Refresh } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, subMonths, isValid } from 'date-fns';
import PageContainer from '../../components/layout/PageContainer';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AllowanceDetails from '../../components/allowances/AllowanceDetails';
import { DailyAllowanceService } from '../../services/allowance.service';

const AdminDailyAllowance = () => {
  const [allowances, setAllowances] = useState([]);
  const [filteredAllowances, setFilteredAllowances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAllowance, setSelectedAllowance] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });
  
  // Collect unique departments and headquarters for filtering
  const [departments, setDepartments] = useState([]);
  const [headquartersList, setHeadquartersList] = useState([]);
  
  // For filter UI control
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
    department: '',
    headquarters: ''
  });
  
  useEffect(() => {
    fetchAllowances();
  }, []);
  
  // Extract unique departments and headquarters after data is loaded
  useEffect(() => {
    if (allowances.length > 0) {
      const depts = [...new Set(allowances
        .filter(a => a.department)
        .map(a => a.department))];
      
      const hqs = [...new Set(allowances
        .filter(a => a.headquarters)
        .map(a => a.headquarters))];
      
      setDepartments(depts);
      setHeadquartersList(hqs);
    }
  }, [allowances]);
  
  useEffect(() => {
    applyFilters();
  }, [filters, allowances]);
  
  const fetchAllowances = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await DailyAllowanceService.getAllAllowances();
      setAllowances(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Failed to load daily allowances. Please try again later.');
      console.error('Error fetching daily allowances:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...allowances];
    
    // Filter by search term (user name, headquarters, department)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        (item.user_name && item.user_name.toLowerCase().includes(searchTerm)) ||
        (item.department && item.department.toLowerCase().includes(searchTerm)) ||
        (item.headquarters && item.headquarters.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    // Filter by date range
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    // Filter by department
    if (filters.department) {
      filtered = filtered.filter(item => 
        item.department && item.department.toLowerCase() === filters.department.toLowerCase()
      );
    }
    
    // Filter by headquarters
    if (filters.headquarters) {
      filtered = filtered.filter(item => 
        item.headquarters && item.headquarters.toLowerCase() === filters.headquarters.toLowerCase()
      );
    }
    
    setFilteredAllowances(filtered);
    setPage(0); // Reset to first page after filtering
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      startDate: subMonths(new Date(), 1),
      endDate: new Date(),
      department: '',
      headquarters: ''
    });
  };
  
  // View allowance details
  const handleViewAllowance = (allowance) => {
    setSelectedAllowance(allowance);
    setDetailsOpen(true);
  };
  
  // Handle approve allowance
  const handleApprove = async (id) => {
    try {
      await DailyAllowanceService.updateStatus(id, 'APPROVED');
      setDetailsOpen(false);
      fetchAllowances();
    } catch (err) {
      setError('Failed to approve allowance. Please try again later.');
      console.error('Error approving allowance:', err);
    }
  };
  
  // Handle reject allowance
  const handleReject = async (id) => {
    try {
      await DailyAllowanceService.updateStatus(id, 'REJECTED');
      setDetailsOpen(false);
      fetchAllowances();
    } catch (err) {
      setError('Failed to reject allowance. Please try again later.');
      console.error('Error rejecting allowance:', err);
    }
  };
  
  // Get paged data
  const getPagedData = () => {
    return filteredAllowances.slice(
      page * rowsPerPage, 
      page * rowsPerPage + rowsPerPage
    );
  };
  
  return (
    <PageContainer 
      title="Admin Daily Allowances" 
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => fetchAllowances()}
          >
            Refresh
          </Button>
        </Box>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name, department, or headquarters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept, index) => (
                  <MenuItem key={index} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Headquarters</InputLabel>
              <Select
                value={filters.headquarters}
                onChange={(e) => handleFilterChange('headquarters', e.target.value)}
                label="Headquarters"
              >
                <MenuItem value="">All Headquarters</MenuItem>
                {headquartersList.map((hq, index) => (
                  <MenuItem key={index} value={hq}>{hq}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', isValid(date) ? date : null)}
                renderInput={(params) => <TextField {...params} />}
                sx={{ minWidth: 150 }}
              />
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', isValid(date) ? date : null)}
                renderInput={(params) => <TextField {...params} />}
                sx={{ minWidth: 150 }}
              />
            </LocalizationProvider>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ mr: 1 }}
            >
              Reset Filters
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Allowances Table */}
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Headquarters</TableCell>
                    <TableCell align="right">Amount ($)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAllowances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No daily allowances found
                      </TableCell>
                    </TableRow>
                  ) : (
                    getPagedData().map((allowance) => (
                      <TableRow key={allowance.id}>
                        <TableCell>
                          {allowance.date && format(new Date(allowance.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{allowance.user_name}</TableCell>
                        <TableCell>{allowance.department}</TableCell>
                        <TableCell>{allowance.headquarters}</TableCell>
                        <TableCell align="right">
                          ${parseFloat(allowance.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={allowance.status} />
                        </TableCell>
                        <TableCell>
                          {allowance.remarks ? 
                            (allowance.remarks.length > 30 ? 
                              `${allowance.remarks.substring(0, 30)}...` : 
                              allowance.remarks) : 
                            '-'}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleViewAllowance(allowance)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={filteredAllowances.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      
      {/* Allowance Details Dialog */}
      <AllowanceDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        allowance={selectedAllowance}
        type="da"
        onApprove={handleApprove}
        onReject={handleReject}
        canApprove={true}
      />
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={() => {
          if (confirmDialog.onConfirm) confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </PageContainer>
  );
}

export default AdminDailyAllowance;