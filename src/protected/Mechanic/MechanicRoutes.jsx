import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const MechanicRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user != null && user.role === 'Mechanic' ? (
    <Outlet />
  ) : (
    <Navigate to={'/login'} />
  );
};

export default MechanicRoutes;
