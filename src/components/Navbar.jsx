import React from 'react';
import AdminNavbar from './Navbar/AdminNavbar';
import UserNavbar from './Navbar/UserNavbar';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return null; // Do not render anything if user is null
  }

  return user.isAdmin ? <AdminNavbar /> : <UserNavbar />;
};

export default Navbar;
