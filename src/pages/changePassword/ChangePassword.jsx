import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { changePasswordApi } from '../../api/api';

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const userID = 'user-id-here'; // Replace this with the actual user ID

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    // Calculate password strength when new password changes
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'error.main';
    if (passwordStrength < 75) return 'warning.main';
    return 'success.main';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setNotification({
        open: true,
        message: 'New passwords do not match!',
        severity: 'error',
      });
      return;
    }

    if (passwordStrength < 50) {
      setNotification({
        open: true,
        message: 'Please use a stronger password',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await changePasswordApi(passwordData);
      setNotification({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success',
      });
      // Clear form after successful password change
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setPasswordStrength(0);
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          'Error changing password. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper
        elevation={3}
        sx={{ mt: 5, p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LockIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
          <Typography
            variant='h5'
            component='h1'
            color='primary.main'>
            Change Password
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <form onSubmit={handleSubmit}>
          <TextField
            label='Current Password'
            name='oldPassword'
            type={showOldPassword ? 'text' : 'password'}
            value={passwordData.oldPassword}
            onChange={handleChange}
            fullWidth
            margin='normal'
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => togglePasswordVisibility('old')}
                    edge='end'>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography
              variant='subtitle2'
              color='text.secondary'
              gutterBottom>
              New Password
            </Typography>
          </Box>

          <TextField
            label='New Password'
            name='newPassword'
            type={showNewPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge='end'>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {passwordData.newPassword && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Grid
                container
                spacing={1}
                alignItems='center'>
                <Grid
                  item
                  xs>
                  <LinearProgress
                    variant='determinate'
                    value={passwordStrength}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getPasswordStrengthColor(),
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant='body2'
                    color={getPasswordStrengthColor()}>
                    {passwordStrength < 50
                      ? 'Weak'
                      : passwordStrength < 75
                      ? 'Medium'
                      : 'Strong'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'block', mt: 1 }}>
                Password must be at least 8 characters and include uppercase
                letters, numbers, and special characters.
              </Typography>
            </Box>
          )}

          <TextField
            label='Confirm New Password'
            name='confirmNewPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordData.confirmNewPassword}
            onChange={handleChange}
            fullWidth
            margin='normal'
            required
            error={
              passwordData.newPassword !== passwordData.confirmNewPassword &&
              passwordData.confirmNewPassword !== ''
            }
            helperText={
              passwordData.newPassword !== passwordData.confirmNewPassword &&
              passwordData.confirmNewPassword !== ''
                ? 'Passwords do not match'
                : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge='end'>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type='submit'
            variant='contained'
            fullWidth
            size='large'
            sx={{ mt: 3, mb: 1, py: 1.5 }}
            disabled={loading}>
            Update Password
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChangePassword;
