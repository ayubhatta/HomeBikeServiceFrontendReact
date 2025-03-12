import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  getAssignedBookingMechanicApi,
  updateBookingStatusApi,
  updateBookingStatusToCompletedApi,
} from '../../../api/api';
import {
  AppBarComponent,
  SidebarComponent,
} from '../../../components/Navbar/MechanicNavbar';

const MechanicTask = () => {
  const [mechanicData, setMechanicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [loadingBookingId, setLoadingBookingId] = useState(null);

  // Drawer toggle handlers
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Fetch mechanic data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mechanicId = 10;
        const response = await getAssignedBookingMechanicApi(mechanicId);
        setMechanicData(response.data);
        setFilteredBookings(response.data.bookingDetails || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch mechanic data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever filter values or mechanic data changes
  useEffect(() => {
    if (!mechanicData || !mechanicData.bookingDetails) return;

    let filtered = [...mechanicData.bookingDetails];

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (booking) => booking.bookingDate === dateFilter
      );
    }

    setFilteredBookings(filtered);
  }, [statusFilter, dateFilter, mechanicData]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'success';
      case 'In-Progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Set loading state for this specific booking
      setStatusLoading(true);
      setLoadingBookingId(bookingId);

      let apiResponse;
      console.log('Booking ID:', bookingId);

      // Determine which API function to call based on the new status
      if (newStatus === 'In-Progress') {
        const data = {
          isAssignedTo: bookingId,
        };
        apiResponse = await updateBookingStatusApi(data);
      } else if (newStatus === 'Complete') {
        const data = {
          isAssignedTo: [bookingId],
        };
        apiResponse = await updateBookingStatusToCompletedApi(data);
      }

      // If the API call is successful, update the local state
      if (apiResponse?.status === 200) {
        // Update the mechanicData state
        const updatedBookings = mechanicData.bookingDetails.map((booking) => {
          if (booking.id === bookingId) {
            const updatedBooking = { ...booking, status: newStatus };
            if (newStatus === 'Complete') {
              updatedBooking.completeDate = new Date()
                .toISOString()
                .split('T')[0];
            }
            return updatedBooking;
          }
          return booking;
        });

        setMechanicData({
          ...mechanicData,
          bookingDetails: updatedBookings,
        });

        // Update selectedBooking if it's the one being updated
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }

        // Show success message
        setSnackbar({
          open: true,
          message: `Task status updated to ${newStatus}`,
          severity: 'success',
        });
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update task status',
        severity: 'error',
      });
    } finally {
      // Clear loading state
      setStatusLoading(false);
      setLoadingBookingId(null);
    }
  };

  // Filter panel component
  const FilterPanel = () => {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant='h6'
            gutterBottom>
            Filter Tasks
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id='status-filter-label'>Status</InputLabel>
              <Select
                labelId='status-filter-label'
                value={statusFilter}
                label='Status'
                onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value='All'>All</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='In-Progress'>In Progress</MenuItem>
                <MenuItem value='Complete'>Complete</MenuItem>
                <MenuItem value='Cancelled'>Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label='Booking Date'
              type='date'
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Button
              variant='outlined'
              onClick={() => {
                setStatusFilter('All');
                setDateFilter('');
              }}>
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Content component to separate layout from content
  const ContentSection = () => {
    // Render loading state
    if (loading) {
      return (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}>
          <CircularProgress />
        </Container>
      );
    }

    // Render error state
    if (error) {
      return (
        <Container>
          <Typography
            color='error'
            variant='h6'>
            {error}
          </Typography>
        </Container>
      );
    }

    // Render data
    return (
      <Container
        maxWidth='lg'
        sx={{ py: 4 }}>
        {/* Filter Panel */}
        <FilterPanel />

        {/* Bookings Table */}
        <Typography
          variant='h5'
          component='div'
          gutterBottom
          sx={{ mt: 4, mb: 2 }}>
          Assigned Tasks
        </Typography>

        {filteredBookings.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>
                    <strong>Booking ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Bike</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Customer</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    hover>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.bookingDate}</TableCell>
                    <TableCell>{booking.bookingTime}</TableCell>
                    <TableCell>
                      {booking.bikeDetails.bikeName}{' '}
                      {booking.bikeDetails.bikeModel}
                      <br />
                      <Typography
                        variant='caption'
                        color='textSecondary'>
                        #{booking.bikeNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {booking.userDetails.fullName}
                      <br />
                      <Typography
                        variant='caption'
                        color='textSecondary'>
                        {booking.userDetails.phoneNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}>
                        <Button
                          variant='outlined'
                          size='small'
                          onClick={() => handleViewDetails(booking)}
                          disabled={
                            statusLoading && loadingBookingId === booking.id
                          }>
                          View Details
                        </Button>

                        {booking.status === 'pending' && (
                          <Button
                            variant='contained'
                            size='small'
                            color='primary'
                            onClick={() =>
                              handleStatusChange(booking.id, 'In-Progress')
                            }
                            disabled={
                              statusLoading && loadingBookingId === booking.id
                            }>
                            {statusLoading &&
                            loadingBookingId === booking.id ? (
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress
                                  size={16}
                                  color='inherit'
                                  sx={{ mr: 1 }}
                                />
                                Processing...
                              </Box>
                            ) : (
                              'Start Task'
                            )}
                          </Button>
                        )}

                        {booking.status === 'In-Progress' && (
                          <Button
                            variant='contained'
                            size='small'
                            color='success'
                            onClick={() =>
                              handleStatusChange(booking.id, 'Complete')
                            }
                            disabled={
                              statusLoading && loadingBookingId === booking.id
                            }>
                            {statusLoading &&
                            loadingBookingId === booking.id ? (
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress
                                  size={16}
                                  color='inherit'
                                  sx={{ mr: 1 }}
                                />
                                Processing...
                              </Box>
                            ) : (
                              'Mark Complete'
                            )}
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant='body1'>
              No tasks have been assigned to you
            </Typography>
          </Paper>
        )}
      </Container>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar Component */}
      <AppBarComponent handleDrawerToggle={handleDrawerToggle} />

      {/* Sidebar Component */}
      <SidebarComponent
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
      />

      {/* Main Content */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? 240 : 0}px)` },
          marginLeft: { sm: 0 },
          marginTop: '64px', // Adjust based on your AppBar height
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}>
        <ContentSection />
      </Box>

      {/* Global Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={statusLoading}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <CircularProgress color='inherit' />
          <Typography
            sx={{ mt: 2 }}
            variant='h6'>
            Updating Task Status...
          </Typography>
        </Box>
      </Backdrop>

      {/* Booking Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth='md'
        fullWidth>
        {selectedBooking && (
          <>
            <DialogTitle>
              Booking Details - #{selectedBooking.id}
              <Chip
                label={selectedBooking.status}
                color={getStatusColor(selectedBooking.status)}
                size='small'
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant='h6'
                  gutterBottom>
                  Customer Information
                </Typography>
                <Typography>
                  <strong>Name:</strong> {selectedBooking.userDetails.fullName}
                </Typography>
                <Typography>
                  <strong>Phone:</strong>{' '}
                  {selectedBooking.userDetails.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedBooking.userDetails.email}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant='h6'
                  gutterBottom>
                  Booking Information
                </Typography>
                <Typography>
                  <strong>Date:</strong> {selectedBooking.bookingDate}
                </Typography>
                <Typography>
                  <strong>Time:</strong> {selectedBooking.bookingTime}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {selectedBooking.status}
                </Typography>
                {selectedBooking.completeDate && (
                  <Typography>
                    <strong>Completed On:</strong>{' '}
                    {selectedBooking.completeDate}
                  </Typography>
                )}
                <Typography>
                  <strong>Address:</strong> {selectedBooking.bookingAddress}
                </Typography>
                <Typography>
                  <strong>Total Fee:</strong> $
                  {selectedBooking.total.toFixed(2)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant='h6'
                  gutterBottom>
                  Bike Information
                </Typography>
                <Typography>
                  <strong>Bike:</strong> {selectedBooking.bikeDetails.bikeName}{' '}
                  {selectedBooking.bikeDetails.bikeModel}
                </Typography>
                <Typography>
                  <strong>Bike Number:</strong> {selectedBooking.bikeNumber}
                </Typography>
                <Typography>
                  <strong>Base Price:</strong> $
                  {selectedBooking.bikeDetails.bikePrice.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Description:</strong>{' '}
                  {selectedBooking.bikeDescription}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedBooking.status === 'pending' && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, 'In-Progress');
                  }}
                  disabled={statusLoading}>
                  {statusLoading && loadingBookingId === selectedBooking.id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress
                        size={16}
                        color='inherit'
                        sx={{ mr: 1 }}
                      />
                      Processing...
                    </Box>
                  ) : (
                    'Start Task'
                  )}
                </Button>
              )}

              {selectedBooking.status === 'In-Progress' && (
                <Button
                  variant='contained'
                  color='success'
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, 'Complete');
                  }}
                  disabled={statusLoading}>
                  {statusLoading && loadingBookingId === selectedBooking.id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress
                        size={16}
                        color='inherit'
                        sx={{ mr: 1 }}
                      />
                      Processing...
                    </Box>
                  ) : (
                    'Mark Complete'
                  )}
                </Button>
              )}
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant='filled'>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MechanicTask;
