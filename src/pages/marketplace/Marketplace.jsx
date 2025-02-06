import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Skeleton,
  Slider,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addToCartApi, getAllBikePartsApi } from '../../api/api';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllBikePartsApi();
        const bikeParts = response.data.bikeParts;
        setProducts(bikeParts);

        // Find max price for slider
        const maxPrice = Math.max(...bikeParts.map((product) => product.price));
        setPriceRange([0, maxPrice]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    const applyFilters = () => {
      let result = [...products];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (product) =>
            product.partName.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
        );
      }

      // Apply price range filter
      result = result.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Apply sorting
      if (sortBy) {
        switch (sortBy) {
          case 'price_asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            result.sort((a, b) => b.price - a.price);
            break;

          default:
            break;
        }
      }

      setFilteredProducts(result);
    };

    applyFilters();
  }, [products, searchQuery, priceRange, sortBy]);

  const handleAddToCart = async (product) => {
    try {
      const data = {
        bikePartsId: product.id,
        quantity: 1,
      };

      await addToCartApi(data);
      setCartCount((prevCount) => prevCount + 1);
      toast.success(`${product.partName} added to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, Math.max(...products.map((product) => product.price))]);
    setSortBy('');
  };

  // Loading skeletons for products
  const ProductSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton
        variant='rectangular'
        height={250}
      />
      <CardContent>
        <Skeleton
          variant='text'
          height={30}
          width='80%'
        />
        <Skeleton
          variant='text'
          height={20}
          width='40%'
        />
        <Skeleton
          variant='text'
          height={20}
          width='60%'
        />
      </CardContent>
      <CardActions>
        <Skeleton
          variant='rectangular'
          height={36}
          width={120}
        />
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth='lg'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}>
          <Typography
            variant='h4'
            component='h1'
            fontWeight='bold'>
            Bike Parts Marketplace
          </Typography>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <OutlinedInput
            fullWidth
            placeholder='Search for bike parts...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
            sx={{ mb: searchQuery ? 2 : 0 }}
          />
          {searchQuery && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => setSearchQuery('')}
                color='primary'
                size='small'
              />
            </Box>
          )}
        </Paper>

        <Grid
          container
          spacing={3}>
          {/* Filters panel */}
          <Grid
            item
            xs={12}
            md={3}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ mr: 1 }} />
                  <Typography variant='h6'>Filters</Typography>
                </Box>
                <Button
                  size='small'
                  onClick={handleClearFilters}
                  disabled={!searchQuery && sortBy === ''}>
                  Clear All
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant='subtitle2'
                gutterBottom>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay='auto'
                min={0}
                max={Math.max(
                  ...products.map((product) => product.price),
                  2000
                )}
                valueLabelFormat={(value) => `Rs.${value}`}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1,
                  mb: 3,
                }}>
                <Typography variant='body2'>Rs.{priceRange[0]}</Typography>
                <Typography variant='body2'>Rs.{priceRange[1]}</Typography>
              </Box>

              <Typography
                variant='subtitle2'
                gutterBottom>
                Sort By
              </Typography>
              <FormControl
                fullWidth
                size='small'>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty>
                  <MenuItem value=''>Default</MenuItem>
                  <MenuItem value='price_asc'>Price: Low to High</MenuItem>
                  <MenuItem value='price_desc'>Price: High to Low</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'>
                  {filteredProducts.length} products found
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Products grid */}
          <Grid
            item
            xs={12}
            md={9}>
            {loading ? (
              <Grid
                container
                spacing={3}>
                {[...Array(6)].map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}>
                    <ProductSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : filteredProducts.length > 0 ? (
              <Grid
                container
                spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={product.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}>
                      <CardMedia
                        component='img'
                        height='250'
                        image={
                          product.partImage ||
                          'https://via.placeholder.com/300x250?text=No+Image'
                        }
                        alt={product.partName}
                        sx={{
                          objectFit: 'cover',
                          maxHeight: '200px',
                          minHeight: '200px',
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}>
                          <Typography
                            variant='h6'
                            component='h2'
                            gutterBottom>
                            {product.partName}
                          </Typography>
                          {product.discount && (
                            <Chip
                              label={`${product.discount}% OFF`}
                              color='error'
                              size='small'
                            />
                          )}
                        </Box>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 1 }}>
                          {product.category && (
                            <Chip
                              label={product.category}
                              size='small'
                              variant='outlined'
                              sx={{ mr: 0.5 }}
                            />
                          )}
                          {product.condition && (
                            <Chip
                              label={product.condition}
                              size='small'
                              variant='outlined'
                              color={
                                product.condition === 'New'
                                  ? 'success'
                                  : product.condition === 'Used'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                          )}
                        </Typography>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 2 }}>
                          {product.description &&
                          product.description.length > 80
                            ? `${product.description.substring(0, 80)}...`
                            : product.description}
                        </Typography>

                        <Typography
                          variant='h6'
                          color='primary'
                          fontWeight='bold'>
                          Rs. {product.price.toFixed(2)}
                        </Typography>

                        {product.inStock === false && (
                          <Typography
                            variant='body2'
                            color='error'
                            sx={{ mt: 1 }}>
                            Out of stock
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => handleAddToCart(product)}
                          startIcon={<ShoppingCartIcon />}
                          disabled={product.inStock === false}>
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography
                  variant='h6'
                  color='text.secondary'
                  gutterBottom>
                  No products found
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'>
                  Try adjusting your filters or search criteria
                </Typography>
                <Button
                  variant='outlined'
                  sx={{ mt: 2 }}
                  onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Marketplace;
