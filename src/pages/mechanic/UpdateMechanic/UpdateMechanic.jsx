import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  getMechanicProfileApi,
  updateMechanicProfileApi,
} from '../../../api/api';
import {
  AppBarComponent,
  SidebarComponent,
} from '../../../components/Navbar/MechanicNavbar';

const UserProfileUpdate = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    PhoneNumber: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [id, setId] = useState('');

  // States for toast notification
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getMechanicProfileApi();
        setId(response.data.id);

        // Update form data with user information
        setFormData({
          fullName: response.data.name || '',
          PhoneNumber: response.data.phoneNumber || '',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
        showToast('Failed to load profile data', 'error');
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateMechanicProfileApi(id, formData);
      console.log('Profile Updated Successfully:', response.data);
      showToast('Profile updated successfully!', 'success');
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const showToast = (message, severity = 'success') => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <Container maxWidth='md'>
      {/* App Bar Component */}
      <AppBarComponent handleDrawerToggle={handleDrawerToggle} />

      {/* Sidebar Component */}
      <SidebarComponent
        drawerOpen={drawerOpen}
        handleDrawerClose={handleDrawerClose}
      />

      <Paper
        elevation={4}
        sx={{
          mt: 5,
          p: 4,
          borderRadius: 2,
          backgroundColor: '#fafafa',
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
            <PersonIcon fontSize='large' />
          </Avatar>
          <Typography
            variant='h4'
            component='h1'
            fontWeight='500'>
            Profile Settings
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {loading && !error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert
            severity='error'
            sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='h6'
                gutterBottom
                color='primary'
                sx={{ fontWeight: 500 }}>
                Personal Information
              </Typography>

              <TextField
                label='Full Name'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                margin='normal'
                required
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <BadgeIcon
                      color='action'
                      sx={{ mr: 1 }}
                    />
                  ),
                }}
              />

              <TextField
                label='Phone Number'
                name='PhoneNumber'
                type='tel'
                value={formData.PhoneNumber}
                onChange={handleChange}
                fullWidth
                margin='normal'
                required
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <PhoneIcon
                      color='action'
                      sx={{ mr: 1 }}
                    />
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{
                  mt: 2,
                  px: 4,
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}>
                {loading ? (
                  <CircularProgress
                    size={24}
                    color='inherit'
                  />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </Box>
          </form>
        )}
      </Paper>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant='filled'
          sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfileUpdate;
