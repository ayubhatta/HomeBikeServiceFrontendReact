import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user != null && user.role === 'User' ? (
    <Outlet />
  ) : (
    <Navigate to={'/404notfound'} />
  );
};

export default UserRoutes;
