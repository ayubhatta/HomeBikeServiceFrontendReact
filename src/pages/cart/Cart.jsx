import {
  AccessTime,
  CalendarMonth,
  CurrencyRupee,
  DeleteOutline,
  Payment,
  ShoppingCart,
  TwoWheeler,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  deleteCartItemApi,
  getCartApi,
  initializeKhaltiPaymentApi,
} from '../../api/api';

// Create a custom theme with blue as primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f8fd',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
  },
});

const CartItem = ({ item, onView, onRemove }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}>
      <Card sx={{ mb: 3, overflow: 'hidden' }}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={3}>
            <CardMedia
              component='img'
              height='160'
              image={item.bikePartDetails.imageUrl}
              alt={item.bikePartDetails.partName}
              sx={{ objectFit: 'cover' }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={9}>
            <CardContent sx={{ height: '100%', p: 3 }}>
              <Typography
                variant='h6'
                color='primary'
                gutterBottom
                sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {item.bikePartDetails.partName}
              </Typography>

              <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display='flex'
                  alignItems='center'>
                  <CalendarMonth
                    fontSize='small'
                    color='action'
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant='body2'
                    color='text.secondary'>
                    {new Date(item.dateAdded).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display='flex'
                  alignItems='center'>
                  <AccessTime
                    fontSize='small'
                    color='action'
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant='body2'
                    color='text.secondary'>
                    {new Date(item.dateAdded).toLocaleTimeString()}
                  </Typography>
                </Grid>
              </Grid>

              <Box
                display='flex'
                alignItems='center'
                sx={{ mt: 1.5 }}>
                <Typography
                  variant='body1'
                  color='text.secondary'
                  fontWeight={500}
                  sx={{ mr: 1 }}>
                  Quantity:
                </Typography>
                <Typography variant='body1'>{item.quantity}</Typography>
              </Box>

              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                sx={{ mt: 2 }}>
                <Box
                  display='flex'
                  alignItems='center'>
                  <CurrencyRupee
                    fontSize='small'
                    color='primary'
                  />
                  <Typography
                    variant='h6'
                    color='text.primary'
                    fontWeight='bold'>
                    {item.totalPrice.toFixed(2)}
                  </Typography>
                </Box>

                <Box>
                  <Button
                    variant='contained'
                    color='primary'
                    size='medium'
                    onClick={() => onView(item)}
                    sx={{ mr: 1.5 }}>
                    View Details
                  </Button>
                  <IconButton
                    color='error'
                    onClick={() => onRemove(item.id)}
                    aria-label='Remove from cart'>
                    <DeleteOutline />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </motion.div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    getCartApi()
      .then((res) => {
        if (res.data.success) {
          setCartItems(res.data.carts || []);
        } else {
          setError('Failed to fetch cart items');
        }
      })
      .catch((err) => {
        setError('Failed to fetch cart items');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.totalPrice, 0)
      .toFixed(2);
  };

  const handlePayment = async (totalPrice) => {
    try {
      const paymentResponse = await initializeKhaltiPaymentApi({
        cartItems: cartItems,
        totalPrice,
        website_url: window.location.origin,
      });
      if (paymentResponse.data.success) {
        const paymentUrl = paymentResponse.data.payment.payment_url;
        window.location.href = paymentUrl;
      } else {
        showSnackbar(
          'Failed to initialize payment. Please try again.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      showSnackbar(
        'Error processing payment: ' +
          (error.response?.data?.message || error.message || 'Unknown error'),
        'error'
      );
    }
  };

  const handleRemoveFromCart = (itemId) => {
    deleteCartItemApi(itemId)
      .then((res) => {
        if (res.status === 200) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
          showSnackbar('Item removed from cart successfully', 'success');
        } else {
          showSnackbar('Failed to remove item from cart', 'error');
        }
      })
      .catch((err) => {
        showSnackbar('Failed to remove item from cart', 'error');
        console.error(err);
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='80vh'>
        <CircularProgress
          color='primary'
          size={60}
          thickness={4}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='80vh'>
        <Alert
          severity='error'
          variant='filled'
          sx={{ maxWidth: 500 }}>
          <Typography
            variant='subtitle1'
            fontWeight='medium'>
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 5,
        }}>
        <Container maxWidth='lg'>
          <Typography
            variant='h4'
            component='h1'
            color='primary'
            gutterBottom
            sx={{ mb: 4, fontWeight: 'bold' }}>
            <ShoppingCart sx={{ mr: 1.5, mb: 0.5 }} />
            Your Cart
          </Typography>

          {cartItems.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'white',
                border: '1px dashed #1976d2',
              }}>
              <Typography
                variant='h6'
                color='text.secondary'>
                Your cart is empty
              </Typography>
              <Button
                variant='contained'
                color='primary'
                sx={{ mt: 2 }}
                href='/shop' // Adjust this route as needed
              >
                Continue Shopping
              </Button>
            </Paper>
          ) : (
            <>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onView={setSelectedItem}
                    onRemove={handleRemoveFromCart}
                  />
                ))}
              </AnimatePresence>

              <Box
                component={Paper}
                elevation={3}
                sx={{
                  p: 3,
                  mt: 4,
                  borderRadius: 2,
                  bgcolor: '#f8f9fc',
                }}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'>
                  <Box>
                    <Typography
                      variant='h6'
                      color='text.secondary'>
                      Cart Summary
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'>
                      {cartItems.length}{' '}
                      {cartItems.length === 1 ? 'item' : 'items'}
                    </Typography>
                  </Box>
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='flex-end'>
                    <Box
                      display='flex'
                      alignItems='center'>
                      <Typography
                        variant='h5'
                        fontWeight='bold'
                        color='primary'>
                        Total: Rs {calculateTotal()}
                      </Typography>
                    </Box>
                    <Button
                      variant='contained'
                      color='primary'
                      size='large'
                      startIcon={<Payment />}
                      onClick={() => handlePayment(calculateTotal())}
                      sx={{ mt: 1.5, px: 4, py: 1 }}>
                      Proceed to Payment
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          <Dialog
            open={selectedItem !== null}
            onClose={() => setSelectedItem(null)}
            maxWidth='sm'
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                overflow: 'hidden',
              },
            }}>
            {selectedItem && (
              <>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 2,
                    px: 3,
                  }}>
                  <DialogTitle
                    sx={{ p: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>
                    {selectedItem.bikePartDetails.partName}
                  </DialogTitle>
                </Box>
                <DialogContent sx={{ pt: 3 }}>
                  <CardMedia
                    component='img'
                    height='200'
                    image={selectedItem.bikePartDetails.imageUrl}
                    alt={selectedItem.bikePartDetails.partName}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />

                  <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}>
                    <Grid
                      item
                      xs={6}>
                      <Box
                        display='flex'
                        alignItems='center'>
                        <CalendarMonth
                          fontSize='small'
                          color='primary'
                          sx={{ mr: 1 }}
                        />
                        <Typography variant='body1'>
                          {new Date(
                            selectedItem.dateAdded
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Box
                        display='flex'
                        alignItems='center'>
                        <AccessTime
                          fontSize='small'
                          color='primary'
                          sx={{ mr: 1 }}
                        />
                        <Typography variant='body1'>
                          {new Date(
                            selectedItem.dateAdded
                          ).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Box
                        display='flex'
                        alignItems='center'>
                        <TwoWheeler
                          fontSize='small'
                          color='primary'
                          sx={{ mr: 1 }}
                        />
                        <Typography variant='body1'>
                          Quantity: {selectedItem.quantity}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={6}>
                      <Box
                        display='flex'
                        alignItems='center'>
                        <CurrencyRupee
                          fontSize='small'
                          color='primary'
                          sx={{ mr: 1 }}
                        />
                        <Typography
                          variant='body1'
                          fontWeight='bold'>
                          Rs {selectedItem.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      bgcolor: selectedItem.isPaymentDone
                        ? '#e6f7e6'
                        : '#fff4e5',
                      p: 1.5,
                      borderRadius: 1,
                    }}>
                    <Typography
                      color={
                        selectedItem.isPaymentDone
                          ? 'success.dark'
                          : 'warning.dark'
                      }>
                      Payment Status:{' '}
                      {selectedItem.isPaymentDone ? 'Paid' : 'Not Paid'}
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button
                    onClick={() => setSelectedItem(null)}
                    color='primary'
                    variant='contained'
                    fullWidth>
                    Close
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant='filled'
              sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Cart;
