import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addToBookingApi, getSingleBike, userID } from '../../api/api';

const ConfirmBooking = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    bikeName: '',
    bookingDate: null,
    bookingTime: null,
    bikeDescription: '',
    bikeNumber: '',
    bookingAddress: '',
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [timeError, setTimeError] = useState(false);
  // Dialog state for terms and conditions
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      bookingDate: date,
    }));
  };

  const handleTimeChange = (time) => {
    // Check if time is within allowed range (8 AM to 8 PM)
    if (time) {
      const hours = time.hour();
      const isValidTime = hours >= 8 && hours < 20;

      setTimeError(!isValidTime);

      if (isValidTime) {
        setFormData((prevData) => ({
          ...prevData,
          bookingTime: time,
        }));
      }
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to open terms and conditions dialog
  const openTermsDialog = (e) => {
    e.preventDefault();
    setTermsDialogOpen(true);
  };

  // Function to close terms and conditions dialog
  const closeTermsDialog = () => {
    setTermsDialogOpen(false);
  };

  // Function to accept terms and close dialog
  const acceptTerms = () => {
    setIsChecked(true);
    setTermsDialogOpen(false);
  };

  const params = useParams();

  useEffect(() => {
    getSingleBike(params.id)
      .then((res) => {
        setFormData((prevData) => ({
          ...prevData,
          bikeName: `${res.data.bike.bikeName} ${res.data.bike.bikeModel}`,
        }));
        setTotal(res.data.bike.bikePrice);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Failed to fetch bike details',
          severity: 'error',
        });
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format date and time for API
    const formattedDate = formData.bookingDate
      ? formData.bookingDate.format('YYYY-MM-DD')
      : '';

    const formattedTime = formData.bookingTime
      ? formData.bookingTime.format('HH:mm')
      : '';

    const data = {
      ...formData,
      bookingDate: formattedDate,
      bookingTime: formattedTime,
      userId: userID,
      bikeId: params.id,
      total: total,
    };

    setLoading(true);
    addToBookingApi(data)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            setSnackbar({
              open: true,
              message: res.data.message,
              severity: 'success',
            });
            setTimeout(() => {
              window.location.href = '/user/booking';
            }, 1500);
          } else if (res.data.success === false) {
            setSnackbar({
              open: true,
              message: res.data.message,
              severity: 'error',
            });
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          setSnackbar({
            open: true,
            message: err.response.data.message,
            severity: 'error',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Something went wrong',
            severity: 'error',
          });
        }
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'>
        <CircularProgress
          size={60}
          thickness={4}
        />
      </Box>
    );
  }

  // Get today's date for date picker minimum date
  const today = dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container
        maxWidth='lg'
        sx={{ py: 6 }}>
        <Typography
          variant='h3'
          component='h1'
          align='center'
          gutterBottom
          fontWeight='bold'
          color='primary.dark'>
          Confirm Your Booking
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Card elevation={6}>
            <CardHeader
              title='Booking Details'
              titleTypographyProps={{ variant: 'h5', fontWeight: 'medium' }}
              sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
            />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid
                  container
                  spacing={3}>
                  <Grid
                    item
                    xs={12}
                    md={6}>
                    <TextField
                      fullWidth
                      label='Bike Name'
                      name='bikeName'
                      value={formData.bikeName}
                      disabled
                      variant='outlined'
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}>
                    <TextField
                      fullWidth
                      label='Bike Number'
                      name='bikeNumber'
                      value={formData.bikeNumber}
                      onChange={handleInputChange}
                      variant='outlined'
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}>
                    <DatePicker
                      label='Booking Date'
                      value={formData.bookingDate}
                      onChange={handleDateChange}
                      minDate={today}
                      sx={{ width: '100%' }}
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}>
                    <TimePicker
                      label='Booking Time (8am - 8pm only)'
                      value={formData.bookingTime}
                      onChange={handleTimeChange}
                      sx={{ width: '100%' }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          variant: 'outlined',
                          error: timeError,
                          helperText: timeError
                            ? 'Please select a time between 8:00 AM and 8:00 PM'
                            : '',
                        },
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}>
                    <TextField
                      fullWidth
                      label='Bike Description'
                      name='bikeDescription'
                      value={formData.bikeDescription}
                      onChange={handleInputChange}
                      variant='outlined'
                      multiline
                      rows={3}
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}>
                    <TextField
                      fullWidth
                      label='Booking Address'
                      name='bookingAddress'
                      value={formData.bookingAddress}
                      onChange={handleInputChange}
                      variant='outlined'
                      required
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          color='primary'
                        />
                      }
                      label={
                        <Typography variant='body2'>
                          I agree to the{' '}
                          <Link
                            href='#'
                            color='primary'
                            underline='hover'
                            onClick={openTermsDialog}
                            sx={{ cursor: 'pointer' }}>
                            Terms and Conditions
                          </Link>
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Button
                    type='submit'
                    variant='contained'
                    fullWidth
                    disabled={
                      !isChecked ||
                      loading ||
                      timeError ||
                      !formData.bookingTime
                    }
                    size='large'
                    sx={{ py: 1.5 }}>
                    {loading ? (
                      <CircularProgress
                        size={24}
                        color='inherit'
                      />
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>

          <Card
            elevation={6}
            sx={{ mt: 4 }}>
            <CardHeader
              title='Booking Summary'
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ bgcolor: 'grey.100' }}
            />
            <CardContent>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'>
                <Typography
                  variant='body1'
                  color='text.secondary'>
                  Bike Price:
                </Typography>
                <Typography
                  variant='body1'
                  fontWeight='medium'>
                  Rs {total.toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'>
                <Typography
                  variant='h6'
                  fontWeight='medium'>
                  Total:
                </Typography>
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  color='primary.main'>
                  Rs {total.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Terms and Conditions Dialog */}
        <Dialog
          open={termsDialogOpen}
          onClose={closeTermsDialog}
          maxWidth='md'
          scroll='paper'
          aria-labelledby='terms-dialog-title'
          aria-describedby='terms-dialog-description'>
          <DialogTitle
            id='terms-dialog-title'
            sx={{ fontWeight: 'bold' }}>
            Ride Revive - Terms and Conditions
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText
              id='terms-dialog-description'
              tabIndex={-1}>
              <Typography
                variant='h6'
                gutterBottom>
                1. SERVICE BOOKING
              </Typography>
              <Typography paragraph>
                1.1. By booking a service with Ride Revive, you agree to provide
                accurate information about your bike and service requirements.
              </Typography>
              <Typography paragraph>
                1.2. Booking is subject to availability of service slots at your
                chosen date and time.
              </Typography>
              <Typography paragraph>
                1.3. Ride Revive reserves the right to reschedule your booking
                if necessary, with prior notice.
              </Typography>

              <Typography
                variant='h6'
                gutterBottom>
                2. SERVICE AND REPAIRS
              </Typography>
              <Typography paragraph>
                2.1. Our mechanics will perform only the services agreed upon
                during booking.
              </Typography>
              <Typography paragraph>
                2.2. Additional repairs identified during service will be
                communicated to you for approval before proceeding.
              </Typography>
              <Typography paragraph>
                2.3. Ride Revive is not responsible for any pre-existing
                conditions or issues not directly related to the service
                provided.
              </Typography>

              <Typography
                variant='h6'
                gutterBottom>
                3. PAYMENT TERMS
              </Typography>
              <Typography paragraph>
                3.1. Full payment is required upon completion of service.
              </Typography>
              <Typography paragraph>
                3.2. We accept cash, credit/debit cards, and online payments.
              </Typography>
              <Typography paragraph>
                3.3. Prices are subject to change without prior notice, but
                confirmed bookings will be honored at the quoted price.
              </Typography>

              <Typography
                variant='h6'
                gutterBottom>
                4. CANCELLATION POLICY
              </Typography>
              <Typography paragraph>
                4.1. Cancellations made at least 24 hours before the scheduled
                service time will not incur charges.
              </Typography>
              <Typography paragraph>
                4.2. Late cancellations (less than 24 hours) may incur a
                cancellation fee of up to 25% of the booked service.
              </Typography>
              <Typography paragraph>
                4.3. No-shows will be charged a fee equivalent to 50% of the
                booked service.
              </Typography>

              <Typography
                variant='h6'
                gutterBottom>
                5. WARRANTY
              </Typography>
              <Typography paragraph>
                5.1. All parts and labor are warranted for 30 days from the date
                of service.
              </Typography>
              <Typography paragraph>
                5.2. The warranty does not cover damage resulting from
                accidents, misuse, neglect, or further modifications.
              </Typography>
              <Typography paragraph>
                5.3. To claim warranty service, you must present your original
                receipt and the bike in question.
              </Typography>

              <Typography
                variant='h6'
                gutterBottom>
                6. PRIVACY POLICY
              </Typography>
              <Typography paragraph>
                6.1. We collect and process personal data in accordance with our
                Privacy Policy.
              </Typography>
              <Typography paragraph>
                6.2. Your information will be used only for service-related
                communications and will not be shared with third parties except
                as required by law.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeTermsDialog}
              color='primary'
              variant='outlined'>
              Close
            </Button>
            <Button
              onClick={acceptTerms}
              color='primary'
              variant='contained'
              autoFocus>
              Accept Terms
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant='filled'
            sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default ConfirmBooking;
