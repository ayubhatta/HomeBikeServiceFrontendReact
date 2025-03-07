import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.isAdmin || user.role === 'Mechanic') return null;

  // Primary color palette
  const primaryColor = '#3b82f6'; // Bright blue as primary color
  const primaryDark = '#1e40af'; // Darker shade of primary
  const primaryLight = '#93c5fd'; // Lighter shade of primary

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', url: '/aboutus' },
        { name: 'Terms & Conditions', url: '/terms' },
        { name: 'Privacy Policy', url: '/privacy' },
      ],
    },
    {
      title: 'Contact Us',
      links: [
        { name: '+977 9863589173', url: 'tel:+9779863589173' },
        {
          name: 'bhatta.ayub1263@gmail.com',
          url: 'mailto:bhatta.ayub1263@gmail.com',
        },
        {
          name: 'Dillibazzar Pipalbot, Kathmandu',
          url: 'https://goo.gl/maps/yourLocationLink',
        },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z',
      url: 'https://facebook.com',
    },
    {
      name: 'Twitter',
      icon: 'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z',
      url: 'https://twitter.com',
    },
    {
      name: 'Instagram',
      icon: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
      url: 'https://instagram.com',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.footer
      className='tw-w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      {/* Main footer section */}
      <div
        style={{
          background: `linear-gradient(to bottom, #0f172a, ${primaryDark})`,
        }}
        className='tw-py-16 tw-text-white'>
        <div className='tw-container tw-mx-auto tw-px-6'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-10'>
            {/* Brand section */}
            <motion.div
              variants={itemVariants}
              className='tw-space-y-6'>
              <div className='tw-flex tw-items-center'>
                <svg
                  className='tw-w-10 tw-h-10 tw-mr-3'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M14 3v4a1 1 0 0 0 1 1h4'
                    stroke={primaryColor}
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z'
                    stroke={primaryColor}
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    d='M9 9h1M9 13h6M9 17h6'
                    stroke={primaryColor}
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                <h2
                  className='tw-text-3xl tw-font-bold'
                  style={{ color: primaryLight }}>
                  Ride Revive
                </h2>
              </div>
              <p className='tw-text-gray-300 tw-max-w-xs'>
                Professional bike maintenance and repair at your doorstep. We
                bring expert service to you, saving you time and hassle.
              </p>
              <div
                className='tw-p-4 tw-rounded-lg tw-mt-4'
                style={{
                  backgroundColor: `rgba(59, 130, 246, 0.1)`,
                  borderLeft: `4px solid ${primaryColor}`,
                }}>
                <p className='tw-text-sm tw-text-gray-300'>
                  Available 7 days a week
                  <br />
                  <span
                    className='tw-font-semibold'
                    style={{ color: primaryLight }}>
                    8:00 AM - 8:00 PM
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Footer sections */}
            {footerSections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='tw-space-y-4'>
                <h3
                  className='tw-text-xl tw-font-semibold'
                  style={{ color: primaryLight }}>
                  {section.title}
                </h3>
                <ul className='tw-space-y-3'>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.url}
                        className='tw-text-gray-300 hover:tw-text-white tw-flex tw-items-center tw-group'>
                        <span
                          className='tw-w-1 tw-h-1 tw-rounded-full tw-mr-2 tw-transition-all tw-duration-300 tw-group-hover:tw-w-2'
                          style={{ backgroundColor: primaryColor }}></span>
                        {link.name}
                        <span className='tw-ml-1 tw-transform tw-translate-x-0 tw-opacity-0 tw-transition-all tw-duration-300 tw-group-hover:tw-translate-x-1 tw-group-hover:tw-opacity-100'>
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Social section */}
            <motion.div
              variants={itemVariants}
              className='tw-space-y-4'>
              <h3
                className='tw-text-xl tw-font-semibold'
                style={{ color: primaryLight }}>
                Connect With Us
              </h3>
              <p className='tw-text-gray-300 tw-mb-4'>
                Follow us on social media for updates, tips, and exclusive
                offers.
              </p>
              <div className='tw-flex tw-space-x-3'>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-300'
                    style={{
                      backgroundColor: `rgba(59, 130, 246, 0.1)`,
                      border: `1px solid ${primaryColor}`,
                    }}
                    aria-label={social.name}>
                    <svg
                      className='tw-w-5 tw-h-5 tw-fill-current tw-text-gray-300 hover:tw-text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 512 512'>
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
              <div className='tw-mt-6'>
                <h4
                  className='tw-text-sm tw-font-semibold tw-mb-3'
                  style={{ color: primaryLight }}>
                  Subscribe to our newsletter
                </h4>
                <div className='tw-flex'>
                  <input
                    type='email'
                    placeholder='Your email'
                    className='tw-py-2 tw-px-3 tw-rounded-l-md tw-w-full tw-text-gray-800 tw-outline-none focus:tw-ring-2'
                    style={{ borderColor: primaryColor }}
                  />
                  <button
                    type='button'
                    className='tw-py-2 tw-px-4 tw-rounded-r-md tw-text-white'
                    style={{ backgroundColor: primaryColor }}>
                    →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Copyright section */}
      <div
        style={{ backgroundColor: primaryDark }}
        className='tw-py-4'>
        <div className='tw-container tw-mx-auto tw-px-6 tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center'>
          <p className='tw-text-gray-300 tw-text-sm'>
            &copy; {new Date().getFullYear()} Ride Revive. All rights reserved.
          </p>
          <div className='tw-flex tw-mt-2 md:tw-mt-0'>
            <a
              href='/sitemap'
              className='tw-text-gray-300 hover:tw-text-white tw-text-sm tw-mx-2'>
              Sitemap
            </a>
            <span className='tw-text-gray-500'>|</span>
            <a
              href='/cookies'
              className='tw-text-gray-300 hover:tw-text-white tw-text-sm tw-mx-2'>
              Cookies
            </a>
            <span className='tw-text-gray-500'>|</span>
            <a
              href='/accessibility'
              className='tw-text-gray-300 hover:tw-text-white tw-text-sm tw-mx-2'>
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
