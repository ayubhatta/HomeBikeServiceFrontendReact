import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Pending as PendingIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import {
  AppBarComponent,
  SidebarComponent,
} from '../../../components/Navbar/MechanicNavbar';

// Mock data for tasks
const initialTasks = [
  {
    id: 1,
    title: 'Oil Change - Honda Civic',
    description: 'Complete oil change for Honda Civic (License: ABC123)',
    status: 'pending',
    vehicle: 'Honda Civic 2020',
    customer: 'John Smith',
    estimatedTime: '30 mins',
    assignedDate: '2025-03-04',
    notes: '',
  },
  {
    id: 2,
    title: 'Brake Replacement - Toyota Camry',
    description: 'Replace front and rear brake pads on Toyota Camry',
    status: 'pending',
    vehicle: 'Toyota Camry 2018',
    customer: 'Sarah Johnson',
    estimatedTime: '2 hours',
    assignedDate: '2025-03-04',
    notes: '',
  },
  {
    id: 3,
    title: 'Engine Diagnostic - Ford F-150',
    description: 'Diagnose check engine light and resolve issue',
    status: 'in-progress',
    vehicle: 'Ford F-150 2021',
    customer: 'Mike Thompson',
    estimatedTime: '1.5 hours',
    assignedDate: '2025-03-03',
    notes: 'Initial diagnostic shows potential fuel pump issue',
  },
  {
    id: 4,
    title: 'Tire Rotation - Chevrolet Malibu',
    description: 'Perform tire rotation and pressure check',
    status: 'completed',
    vehicle: 'Chevrolet Malibu 2019',
    customer: 'Emily Wilson',
    estimatedTime: '45 mins',
    assignedDate: '2025-03-02',
    completedDate: '2025-03-03',
    notes:
      'All tires were in good condition, replaced valve caps on rear tires',
  },
];

// Main Dashboard Component
function MechanicDashboard() {
  const theme = useTheme();
  const [tasks, setTasks] = useState(initialTasks);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  // Task status counts
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress'
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        // Add completedDate when task is marked as completed
        if (newStatus === 'completed') {
          updatedTask.completedDate = new Date().toISOString().split('T')[0];
        }
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);

    // If changing to completed, open the edit dialog
    if (newStatus === 'completed') {
      const task = tasks.find((t) => t.id === taskId);
      setEditedTask({ ...task, status: newStatus });
      setEditDialogOpen(true);
    }
  };

  const handleEditTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editedTask.id ? editedTask : task
    );
    setTasks(updatedTasks);
    setEditDialogOpen(false);
  };

  const handleTaskSelection = (task) => {
    setSelectedTask(task);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ color: theme.palette.warning.main }} />;
      case 'in-progress':
        return <TimelineIcon sx={{ color: theme.palette.info.main }} />;
      case 'completed':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'in-progress':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
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
                    <Typography variant='h4'>{completedTasks}</Typography>
                    <Typography variant='body1'>Completed</Typography>
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
              <Typography
                variant='h6'
                sx={{ mb: 2 }}>
                My Tasks
              </Typography>
              <Divider sx={{ mb: 2 }} />
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
                        <Typography variant='h6'>{task.title}</Typography>
                        {getStatusIcon(task.status)}
                      </Box>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 1 }}>
                        {task.description}
                      </Typography>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        sx={{ mt: 2 }}>
                        <Typography
                          variant='body2'
                          color='text.secondary'>
                          Vehicle: {task.vehicle}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'>
                          Est. Time: {task.estimatedTime}
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
                            handleStatusChange(task.id, 'in-progress');
                          }}>
                          Start Task
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Button
                          size='small'
                          variant='contained'
                          color='success'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'completed');
                          }}>
                          Complete Task
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditedTask({ ...task });
                            setEditDialogOpen(true);
                          }}>
                          View Details
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </List>
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
                    {selectedTask.title}
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{ mb: 3 }}>
                    {selectedTask.description}
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
                        {selectedTask.customer}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>Vehicle</Typography>
                      <Typography variant='body1'>
                        {selectedTask.vehicle}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>Assigned Date</Typography>
                      <Typography variant='body1'>
                        {selectedTask.assignedDate}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Typography variant='subtitle2'>
                        Estimated Time
                      </Typography>
                      <Typography variant='body1'>
                        {selectedTask.estimatedTime}
                      </Typography>
                    </Grid>
                    {selectedTask.completedDate && (
                      <Grid
                        item
                        xs={6}>
                        <Typography variant='subtitle2'>
                          Completed Date
                        </Typography>
                        <Typography variant='body1'>
                          {selectedTask.completedDate}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant='subtitle2'>Notes</Typography>
                    <Typography variant='body1'>
                      {selectedTask.notes || 'No notes available'}
                    </Typography>
                  </Box>

                  {selectedTask.status === 'pending' && (
                    <Button
                      variant='contained'
                      color='info'
                      sx={{ mt: 3 }}
                      onClick={() =>
                        handleStatusChange(selectedTask.id, 'in-progress')
                      }>
                      Start Task
                    </Button>
                  )}

                  {selectedTask.status === 'in-progress' && (
                    <Button
                      variant='contained'
                      color='success'
                      sx={{ mt: 3 }}
                      onClick={() =>
                        handleStatusChange(selectedTask.id, 'completed')
                      }>
                      Complete Task
                    </Button>
                  )}

                  {selectedTask.status === 'completed' && (
                    <Button
                      variant='outlined'
                      sx={{ mt: 3 }}
                      onClick={() => {
                        setEditedTask({ ...selectedTask });
                        setEditDialogOpen(true);
                      }}>
                      Edit Details
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

      {/* Edit Task Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth='md'>
        <DialogTitle>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='h6'>
              {editedTask?.status === 'completed'
                ? 'Task Completion Details'
                : 'Edit Task'}
            </Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {editedTask && (
            <Grid
              container
              spacing={3}>
              <Grid
                item
                xs={12}>
                <TextField
                  label='Task Title'
                  fullWidth
                  value={editedTask.title}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, title: e.target.value })
                  }
                  margin='normal'
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <TextField
                  label='Description'
                  fullWidth
                  multiline
                  rows={2}
                  value={editedTask.description}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                  margin='normal'
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  label='Vehicle'
                  fullWidth
                  value={editedTask.vehicle}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, vehicle: e.target.value })
                  }
                  margin='normal'
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  label='Customer'
                  fullWidth
                  value={editedTask.customer}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, customer: e.target.value })
                  }
                  margin='normal'
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <TextField
                  label='Notes'
                  fullWidth
                  multiline
                  rows={4}
                  value={editedTask.notes}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, notes: e.target.value })
                  }
                  margin='normal'
                  placeholder='Add details about the work performed, parts used, or any issues found'
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditTask}
            variant='contained'
            color='primary'>
            {editedTask?.status === 'completed'
              ? 'Save Changes'
              : 'Update Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MechanicDashboard;
