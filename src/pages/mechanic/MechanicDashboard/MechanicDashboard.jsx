import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ShoppingCart as ShoppingCartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  Paper,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  getMechanicByIdApi,
  updateBookingStatusApi,
  updateBookingStatusToCompletedApi,
  userID,
} from '../../../api/api';
import {
  AppBarComponent,
  SidebarComponent,
} from '../../../components/Navbar/MechanicNavbar';

// Main Dashboard Component
function MechanicDashboard() {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  /**
   * Maps API response data to the task format required by the MechanicDashboard component
   * @param {Object} apiResponse - The raw API response
   * @returns {Object} - A properly formatted task object
   */
  const mapApiResponseToTask = (apiResponse) => {
    // Extract the booking details for easier access
    const booking = apiResponse.bookingDetails;
    const user = booking.userDetails;
    const bike = booking.bikeDetails;

    // Format the booking time for better display
    const formatTime = (timeString) => {
      if (!timeString) return 'N/A';
      try {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${period}`;
      } catch (e) {
        return timeString;
      }
    };

    // Calculate total cost of parts
    const calculatePartsCost = () => {
      if (!user.cart || !Array.isArray(user.cart) || user.cart.length === 0) {
        return 0;
      }
      return user.cart.reduce((total, item) => {
        return total + item.quantity * item.cartDetails.price;
      }, 0);
    };

    const partsCost = calculatePartsCost();

    // Create a properly formatted task object
    return {
      id: booking.id,
      status: booking.status || 'pending', // Using the status from the booking
      title: `Service for ${bike.bikeName} ${bike.bikeModel}`,
      description:
        booking.bikeDescription || 'Standard service and maintenance',

      // Vehicle information
      vehicle: `${bike.bikeName} ${bike.bikeModel}`,
      vehicleDetails: `${bike.bikeName} ${bike.bikeModel} (${booking.bikeNumber})`,

      // Customer information
      customer: user.fullName,
      customerName: user.fullName,

      // Dates and times
      assignedDate: booking.bookingDate,
      bookingTime: formatTime(booking.bookingTime),
      estimatedTime: formatTime(booking.bookingTime),
      bookingId: booking.id,

      // Cost information
      serviceCost: booking.total || bike.bikePrice,
      partsCost: partsCost,
      totalCost: (booking.total || bike.bikePrice) + partsCost,

      // Parts information
      parts: user.cart || [],
      hasParts: user.cart && user.cart.length > 0,

      // Additional details that might be useful
      serviceType: 'Bike Service',
      notes: `
            Address: ${booking.bookingAddress || 'N/A'}
            Contact: ${user.phoneNumber} / ${user.email}
            Estimated Service Cost: $${booking.total || bike.bikePrice}
            Parts Cost: $${partsCost}
            Total Cost: $${(booking.total || bike.bikePrice) + partsCost}`,

      // Original data preserved for reference if needed
      rawData: {
        mechanic: {
          id: apiResponse.id,
          name: apiResponse.name,
          phoneNumber: apiResponse.phoneNumber,
        },
        booking: booking,
        customer: user,
        bike: bike,
        cart: user.cart || [],
      },
    };
  };

  // Fetch assigned tasks from API
  const fetchAssignedTasks = async () => {
    try {
      setLoading(true);
      // Assuming you have the mechanic ID from auth or context
      const mechanicId = userID;

      const response = await getMechanicByIdApi(mechanicId);

      // Set tasks from API response
      if (response && response.data) {
        let formattedTasks = [];

        // Check if bookingDetails exists and is an array
        if (
          response.data.bookingDetails &&
          Array.isArray(response.data.bookingDetails)
        ) {
          // Map each booking in the bookingDetails array
          formattedTasks = response.data.bookingDetails.map((booking) => {
            return mapApiResponseToTask({
              id: response.data.id,
              name: response.data.name,
              phoneNumber: response.data.phoneNumber,
              bookingDetails: booking,
            });
          });
        } else if (Array.isArray(response.data)) {
          // Fallback to original logic if response.data is an array
          formattedTasks = response.data.map(mapApiResponseToTask);
        } else {
          // Handle single booking case
          formattedTasks = [mapApiResponseToTask(response.data)];
        }

        setTasks(formattedTasks);

        // If there are tasks, select the first one by default
        if (formattedTasks.length > 0) {
          setSelectedTask(formattedTasks[0]);
        }

        setSnackbar({
          open: true,
          message: 'Tasks loaded successfully',
          severity: 'success',
        });
      } else {
        // If response is empty or invalid
        setTasks([]);
        setSnackbar({
          open: true,
          message: 'No tasks available at the moment',
          severity: 'info',
        });
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching assigned tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      setSnackbar({
        open: true,
        message: 'Failed to load tasks. Using sample data instead.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  // Task status counts
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'In-Progress'
  ).length;
  const completeTasks = tasks.filter(
    (task) => task.status === 'Complete'
  ).length;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      let apiResponse;
      console.log('Task ID:', taskId);

      // Determine which API function to call based on the new status
      if (newStatus === 'In-Progress') {
        const data = {
          isAssignedTo: taskId,
        };
        apiResponse = await updateBookingStatusApi(data);
      } else if (newStatus === 'Complete') {
        const data = {
          isAssignedTo: [taskId],
        };
        apiResponse = await updateBookingStatusToCompletedApi(data);
      }

      // If the API call is successful, update the local state
      if (apiResponse?.status === 200) {
        const updatedTasks = tasks.map((task) => {
          if (task.id === taskId) {
            const updatedTask = { ...task, status: newStatus };
            if (newStatus === 'Complete') {
              updatedTask.completeDate = new Date().toISOString().split('T')[0];
            }
            return updatedTask;
          }
          return task;
        });

        setTasks(updatedTasks);

        // Update selectedTask if it's the one being updated
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask((prev) => ({ ...prev, status: newStatus }));
        }

        // Show success message
        setSnackbar({
          open: true,
          message: `Task status updated to ${newStatus}`,
          severity: 'success',
        });

        // If changing to complete, open the edit dialog
        if (newStatus === 'Complete') {
          const task = tasks.find((t) => t.id === taskId);
        }
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
    }
  };

  const handleTaskSelection = (task) => {
    setSelectedTask(task);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const openCartDialog = (task) => {
    setSelectedTask(task);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ color: theme.palette.warning.main }} />;
      case 'In-Progress':
        return <TimelineIcon sx={{ color: theme.palette.info.main }} />;
      case 'Complete':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'In-Progress':
        return theme.palette.info.main;
      case 'Complete':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Get a displayed value safely from a task
  const getTaskValue = (task, field, defaultValue = 'Not available') => {
    return task[field] || defaultValue;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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
          width: { sm: `calc(100% - 240px)` },
          mt: 8,
          backgroundColor: '#f5f5f5',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}>
        {/* Status Cards */}
        <Grid
          container
          spacing={3}
          sx={{ mb: 3 }}>
          <Grid
            item
            xs={12}
            sm={4}>
            <Card>
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'>
                  <PendingIcon
                    sx={{
                      color: theme.palette.warning.main,
                      fontSize: 40,
                      mr: 2,
                    }}
                  />
                  <Box>
                    <Typography variant='h4'>{pendingTasks}</Typography>
                    <Typography variant='body1'>Pending Tasks</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}>
            <Card>
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'>
                  <TimelineIcon
                    sx={{ color: theme.palette.info.main, fontSize: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography variant='h4'>{inProgressTasks}</Typography>
                    <Typography variant='body1'>In Progress</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}>
            <Card>
              <CardContent>
                <Box
                  display='flex'
                  alignItems='center'>
                  <CheckCircleIcon
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: 40,
                      mr: 2,
                    }}
                  />
                  <Box>
                    <Typography variant='h4'>{completeTasks}</Typography>
                    <Typography variant='body1'>Complete</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Task List and Details */}
        <Grid
          container
          spacing={3}>
          {/* Task List */}
          <Grid
            item
            xs={12}
            md={6}>
            <Paper sx={{ p: 2 }}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={2}>
                <Typography variant='h6'>My Tasks</Typography>
                <Button
                  variant='outlined'
                  size='small'
                  disabled={loading}
                  onClick={fetchAssignedTasks}>
                  Refresh
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  py={4}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box
                  textAlign='center'
                  py={4}>
                  <Typography color='error'>{error}</Typography>
                  <Button
                    variant='contained'
                    sx={{ mt: 2 }}
                    onClick={fetchAssignedTasks}>
                    Retry
                  </Button>
                </Box>
              ) : tasks.length === 0 ? (
                <Box
                  textAlign='center'
                  py={4}>
                  <Typography>No tasks assigned at the moment.</Typography>
                </Box>
              ) : (
                <List>
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      sx={{
                        mb: 2,
                        border: `1px solid ${getStatusColor(task.status)}`,
                        cursor: 'pointer',
                        backgroundColor:
                          selectedTask?.id === task.id ? '#f0f7ff' : 'white',
                      }}
                      onClick={() => handleTaskSelection(task)}>
                      <CardContent>
                        <Box
                          display='flex'
                          justifyContent='space-between'
                          alignItems='center'>
                          <Typography variant='h6'>
                            {getTaskValue(
                              task,
                              'title',
                              task.serviceType || 'Service Task'
                            )}
                          </Typography>
                          <Box
                            display='flex'
                            alignItems='center'>
                            {task.hasParts && (
                              <ShoppingCartIcon
                                sx={{
                                  color: theme.palette.primary.main,
                                  mr: 1,
                                  fontSize: 20,
                                }}
                              />
                            )}
                            {getStatusIcon(task.status)}
                          </Box>
                        </Box>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mt: 1 }}>
                          {getTaskValue(task, 'description')}
                        </Typography>
                        <Box
                          display='flex'
                          justifyContent='space-between'
                          sx={{ mt: 2 }}>
                          <Typography
                            variant='body2'
                            color='text.secondary'>
                            Vehicle:{' '}
                            {getTaskValue(task, 'vehicleDetails', task.vehicle)}
                          </Typography>
                          <Typography
                            variant='body2'
                            color='text.secondary'>
                            Est. Time: {getTaskValue(task, 'estimatedTime')}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        {task.status === 'pending' && (
                          <Button
                            size='small'
                            variant='contained'
                            color='info'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task.id, 'In-Progress');
                            }}>
                            Start Task
                          </Button>
                        )}
                        {task.status === 'In-Progress' && (
                          <Button
                            size='small'
                            variant='contained'
                            color='success'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(task.id, 'Complete');
                            }}>
                            Complete Task
                          </Button>
                        )}
                        {task.status === 'Complete' && (
                          <Button
                            size='small'
                            variant='outlined'
                            onClick={(e) => {
                              e.stopPropagation();
                            }}>
                            View Details
                          </Button>
                        )}
                        {task.hasParts && (
                          <Button
                            size='small'
                            startIcon={<ShoppingCartIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              openCartDialog(task);
                            }}>
                            View Parts
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Task Details */}
          <Grid
            item
            xs={12}
            md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              {selectedTask ? (
                <>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    sx={{ mb: 2 }}>
                    <Typography variant='h6'>Task Details</Typography>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: getStatusColor(selectedTask.status),
                        color: 'white',
                      }}>
                      <Typography variant='body2'>
                        {selectedTask.status.charAt(0).toUpperCase() +
                          selectedTask.status.slice(1).replace('-', ' ')}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Typography
                    variant='h5'
                    sx={{ mb: 2 }}>
                    {getTaskValue(
                      selectedTask,
                      'title',
                      selectedTask.serviceType || 'Service Task'
                    )}
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{ mb: 3 }}>
                    {getTaskValue(selectedTask, 'description')}
                  </Typography>

                  <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>Customer</Typography>
                      <Typography variant='body1'>
                        {getTaskValue(
                          selectedTask,
                          'customerName',
                          selectedTask.customer
                        )}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>Vehicle</Typography>
                      <Typography variant='body1'>
                        {getTaskValue(
                          selectedTask,
                          'vehicleDetails',
                          selectedTask.vehicle
                        )}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>
                        Appointment Date
                      </Typography>
                      <Typography variant='body1'>
                        {getTaskValue(selectedTask, 'assignedDate')}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>
                        Appointment Time
                      </Typography>
                      <Typography variant='body1'>
                        {getTaskValue(
                          selectedTask,
                          'bookingTime',
                          getTaskValue(selectedTask, 'estimatedTime')
                        )}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>Booking ID</Typography>
                      <Typography variant='body1'>
                        {getTaskValue(selectedTask, 'bookingId')}
                      </Typography>
                    </Grid>
                    {selectedTask.completeDate && (
                      <Grid
                        item
                        xs={6}>
                        <Typography variant='subtitle2'>
                          Complete Date
                        </Typography>
                        <Typography variant='body1'>
                          {selectedTask.completeDate}
                        </Typography>
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={12}>
                      <Typography variant='subtitle2'>Contact Info</Typography>
                      <Typography variant='body1'>
                        {selectedTask.rawData?.customer?.phoneNumber || 'N/A'} /{' '}
                        {selectedTask.rawData?.customer?.email || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}>
                      <Typography variant='subtitle2'>
                        Service Location
                      </Typography>
                      <Typography variant='body1'>
                        {selectedTask.rawData?.booking?.bookingAddress || 'N/A'}
                      </Typography>
                    </Grid>

                    {/* Cost Information */}
                    <Grid
                      item
                      xs={12}>
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant='subtitle1'>
                            Cost Information
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid
                            container
                            spacing={2}>
                            <Grid
                              item
                              xs={6}>
                              <Typography variant='subtitle2'>
                                Service Cost
                              </Typography>
                              <Typography variant='body1'>
                                ${selectedTask.serviceCost}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}>
                              <Typography variant='subtitle2'>
                                Parts Cost
                              </Typography>
                              <Typography variant='body1'>
                                ${selectedTask.partsCost}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}>
                              <Divider sx={{ my: 1 }} />
                              <Box
                                display='flex'
                                justifyContent='space-between'>
                                <Typography
                                  variant='subtitle1'
                                  fontWeight='bold'>
                                  Total Cost
                                </Typography>
                                <Typography
                                  variant='subtitle1'
                                  fontWeight='bold'>
                                  ${selectedTask.totalCost}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>

                    {/* Parts Information */}
                    {selectedTask.hasParts && (
                      <Grid
                        item
                        xs={12}>
                        <Accordion sx={{ mt: 2 }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                            }}>
                            <Box
                              display='flex'
                              alignItems='center'>
                              <ShoppingCartIcon sx={{ mr: 1 }} />
                              <Typography variant='subtitle1'>
                                Parts Information
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <List>
                              {selectedTask.parts.map((item, index) => (
                                <Card
                                  key={index}
                                  sx={{ mb: 1, p: 1 }}>
                                  <Box
                                    display='flex'
                                    justifyContent='space-between'
                                    alignItems='center'>
                                    <Box>
                                      <Typography variant='subtitle2'>
                                        {item.cartDetails.partName}
                                      </Typography>
                                      <Typography
                                        variant='body2'
                                        color='text.secondary'>
                                        {item.cartDetails.description}
                                      </Typography>
                                    </Box>
                                    <Box textAlign='right'>
                                      <Chip
                                        label={`${item.quantity}x`}
                                        size='small'
                                        color='primary'
                                        sx={{ mb: 1 }}
                                      />
                                      <Typography variant='body2'>
                                        ${item.cartDetails.price} each
                                      </Typography>
                                      <Typography
                                        variant='subtitle2'
                                        fontWeight='bold'>
                                        Total: $
                                        {item.quantity * item.cartDetails.price}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              ))}
                            </List>
                            <Divider sx={{ my: 1 }} />
                            <Box
                              display='flex'
                              justifyContent='space-between'>
                              <Typography
                                variant='subtitle1'
                                fontWeight='bold'>
                                Parts Total
                              </Typography>
                              <Typography
                                variant='subtitle1'
                                fontWeight='bold'>
                                ${selectedTask.partsCost}
                              </Typography>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>Notes</Typography>
                    <Typography variant='body1'>
                      {getTaskValue(
                        selectedTask,
                        'notes',
                        'No notes available'
                      )}
                    </Typography>
                  </Box>

                  {selectedTask.status === 'pending' && (
                    <Button
                      variant='contained'
                      color='info'
                      sx={{ mt: 3 }}
                      onClick={() =>
                        handleStatusChange(selectedTask.id, 'In-Progress')
                      }>
                      Start Task
                    </Button>
                  )}

                  {selectedTask.status === 'In-Progress' && (
                    <Button
                      variant='contained'
                      color='success'
                      sx={{ mt: 3 }}
                      onClick={() =>
                        handleStatusChange(selectedTask.id, 'Complete')
                      }>
                      Complete Task
                    </Button>
                  )}
                </>
              ) : (
                <Box
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  justifyContent='center'
                  sx={{ height: '100%' }}>
                  <AssignmentIcon
                    sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }}
                  />
                  <Typography
                    variant='h6'
                    color='text.secondary'>
                    Select a task to view details
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MechanicDashboard;
