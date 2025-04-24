import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user != null && user.isAdmin ? <Outlet /> : <Navigate to={'/404notfound'} />;
};

export default AdminRoutes;
