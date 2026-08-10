import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const AdminRoute = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
