import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return user != null && user != user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={'/login'} />
  );
};

export default UserRoutes;
