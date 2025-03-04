import React from 'react';
import AdminNavbar from './Navbar/AdminNavbar';
import { AppBarComponent } from './Navbar/MechanicNavbar';
import UserNavbar from './Navbar/UserNavbar';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return null; // Do not render anything if user is null
  }

  return user.isAdmin ? (
    <AdminNavbar />
  ) : user.role === 'Mechanic' ? (
    <AppBarComponent />
  ) : (
    <UserNavbar />
  );
};

export default Navbar;
