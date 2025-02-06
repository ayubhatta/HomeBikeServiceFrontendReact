import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaFilter,
  FaMotorcycle,
  FaShoppingCart,
  FaSortAmountDown,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getAllBikeApi, getAllBikePartsApi } from '../../api/api';

const Search = () => {
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('bikes');
  const [filters, setFilters] = useState({
    showFilters: false,
    priceRange: [0, 10000],
    sortOrder: 'asc',
  });

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = (type) => {
    setLoading(true);
    if (type === 'bikes') {
      getAllBikeApi()
        .then((res) => {
          console.log('Bikes:', res.data.bikes);
          setItems(res.data.bikes || []);
          setSearchResults(res.data.bikes || []);
        })
        .catch((error) => {
          console.error('Error fetching bikes:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      getAllBikePartsApi()
        .then((res) => {
          console.log('Bike parts:', res.data.bikeParts);
          setItems(res.data.bikeParts || []);
          setSearchResults(res.data.bikeParts || []);
        })
        .catch((error) => {
          console.error('Error fetching bike parts:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Apply all filters and search together
  const applyFiltersAndSearch = () => {
    let results = [...items];

    // Apply search term
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      results = results.filter((item) => {
        const name = activeTab === 'bikes' ? item.bikeName : item.partName;
        return name?.toLowerCase().includes(query);
      });
    }

    // Apply price filter
    results = results.filter((item) => {
      const price =
        activeTab === 'bikes'
          ? parseFloat(item.bikePrice || 0)
          : parseFloat(item.price || 0);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    results.sort((a, b) => {
      const priceA =
        activeTab === 'bikes'
          ? parseFloat(a.bikePrice || 0)
          : parseFloat(a.price || 0);
      const priceB =
        activeTab === 'bikes'
          ? parseFloat(b.bikePrice || 0)
          : parseFloat(b.price || 0);

      return filters.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    setSearchResults(results);
  };

  const debouncedSearch = debounce(() => {
    applyFiltersAndSearch();
  }, 300);

  useEffect(() => {
    debouncedSearch();
    // Cancel the debounce on useEffect cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, items, filters]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const toggleFilters = () => {
    setFilters({
      ...filters,
      showFilters: !filters.showFilters,
    });
  };

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    setFilters({
      ...filters,
      priceRange: newPriceRange,
    });
  };

  const toggleSortOrder = () => {
    setFilters({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  const getItemName = (item) =>
    activeTab === 'bikes' ? item.bikeName : item.partName;
  const getItemPrice = (item) =>
    activeTab === 'bikes' ? item.bikePrice : item.price;
  const getItemImage = (item) => {
    let imageSrc = '/placeholder.jpg'; // Default placeholder

    if (activeTab === 'bikes' && item.bikeImageUrl) {
      imageSrc = `${item.bikeImageUrl}`;
    } else if (activeTab === 'parts' && item.partImage) {
      imageSrc = `${item.partImage}`;
    }

    return imageSrc;
  };

  const addToCart = (item) => {
    // Implement cart functionality here
    console.log('Adding to cart:', item);
    // Call your addToCartApi here
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12'>
      <div className='container mx-auto px-4 max-w-7xl'>
        <h1 className='text-4xl font-bold text-center mb-8 flex items-center justify-center text-gray-800'>
          {activeTab === 'bikes' ? (
            <FaMotorcycle className='mr-4 text-blue-600' />
          ) : (
            <FaCog className='mr-4 text-blue-600 animate-spin-slow' />
          )}
          {activeTab === 'bikes' ? 'Motorcycle Search' : 'Parts Catalog'}
        </h1>

        {/* Tabs */}
        <div className='flex justify-center mb-8'>
          <div className='bg-white rounded-lg shadow-md p-1 inline-flex'>
            <button
              onClick={() => handleTabChange('bikes')}
              className={`px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === 'bikes'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <FaMotorcycle className='inline mr-2' />
              Bikes
            </button>
            <button
              onClick={() => handleTabChange('parts')}
              className={`px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === 'parts'
                  ? 'bg-blue-600 text-white font-medium shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <FaCog className='inline mr-2' />
              Parts
            </button>
          </div>
        </div>

        {/* Search area */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
          <div className='relative'>
            <input
              type='text'
              className='w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-gray-50'
              placeholder={`Search for ${
                activeTab === 'bikes' ? 'motorcycles' : 'parts'
              }...`}
              onChange={handleSearchChange}
              value={searchTerm}
            />

            <button
              onClick={toggleFilters}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors'
              title='Toggle filters'>
              <FaFilter />
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {filters.showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden mt-4 border-t pt-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Price Range
                    </label>
                    <div className='flex items-center space-x-4'>
                      <input
                        type='range'
                        min='0'
                        max='10000'
                        step='100'
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                      />
                      <span className='w-20 text-center'>
                        Rs {filters.priceRange[0]}
                      </span>
                    </div>
                    <div className='flex items-center space-x-4 mt-2'>
                      <input
                        type='range'
                        min='0'
                        max='10000'
                        step='100'
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                      />
                      <span className='w-20 text-center'>
                        Rs {filters.priceRange[1]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Sort Options
                    </label>
                    <button
                      onClick={toggleSortOrder}
                      className='flex items-center justify-between w-full p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition'>
                      <div className='flex items-center'>
                        <FaSortAmountDown className='mr-2' />
                        Price{' '}
                        {filters.sortOrder === 'asc'
                          ? 'Low to High'
                          : 'High to Low'}
                      </div>
                      {filters.sortOrder === 'asc' ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        {loading ? (
          <div className='flex flex-col justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4'></div>
            <p className='text-gray-600 animate-pulse'>
              Loading {activeTab}...
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            variants={containerVariants}
            initial='hidden'
            animate='visible'>
            {searchResults.map((item) => (
              <motion.div
                key={item.id}
                className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300'
                variants={itemVariants}
                whileHover={{ y: -5 }}>
                <div className='h-48 overflow-hidden'>
                  <img
                    src={getItemImage(item)}
                    alt={getItemName(item)}
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg'; // Fallback image
                    }}
                  />
                </div>
                <div className='p-6'>
                  <h2 className='text-xl font-semibold mb-2 text-gray-800'>
                    {getItemName(item)}
                  </h2>
                  <div className='flex justify-between items-center mb-4'>
                    <p className='text-gray-700 font-medium'>
                      Rs {getItemPrice(item)}
                    </p>
                    <span className='bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full'>
                      In Stock
                    </span>
                  </div>
                  <div className='flex space-x-2'>
                    <Link
                      to={`/${activeTab === 'bikes' ? 'bike' : 'part'}/${
                        item.bikeName
                      }`}
                      className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 text-center'>
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(item)}
                      className='bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition duration-300'
                      title='Add to cart'>
                      <FaShoppingCart className='text-gray-700' />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white border-l-4 border-yellow-500 text-gray-700 p-6 rounded-lg shadow-md'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-yellow-500'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-lg font-medium text-yellow-800'>
                  No results found
                </h3>
                <div className='mt-2 text-sm text-gray-600'>
                  <p>
                    We couldn't find any {activeTab} matching your search
                    criteria.
                  </p>
                  <ul className='list-disc pl-5 mt-2 space-y-1'>
                    <li>Try using different keywords</li>
                    <li>Check your spelling</li>
                    <li>Try adjusting your filters</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
