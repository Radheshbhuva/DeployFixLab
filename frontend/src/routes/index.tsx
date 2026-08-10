import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { AdminRoute } from './AdminRoute';
import { Spinner } from '@/components/ui/Spinner';

// Asynchronous Lazy Loading per Routing.md & Performance Guidelines
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const TaskPage = lazy(() => import('@/pages/TaskPage').then((m) => ({ default: m.TaskPage })));
const LabCatalogPage = lazy(() => import('@/pages/LabCatalogPage').then((m) => ({ default: m.LabCatalogPage })));
const LabExecutionPage = lazy(() => import('@/pages/LabExecutionPage').then((m) => ({ default: m.LabExecutionPage })));
const LogViewerPage = lazy(() => import('@/pages/LogViewerPage').then((m) => ({ default: m.LogViewerPage })));
const ChaosControlPage = lazy(() => import('@/pages/ChaosControlPage').then((m) => ({ default: m.ChaosControlPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading Viewport..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  /* Public Auth Routes */
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <PageSuspense><LoginPage /></PageSuspense> },
          { path: '/register', element: <PageSuspense><RegisterPage /></PageSuspense> },
        ],
      },
    ],
  },
  /* Authenticated Protected Routes */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <PageSuspense><DashboardPage /></PageSuspense> },
          { path: '/tasks', element: <PageSuspense><TaskPage /></PageSuspense> },
          { path: '/labs', element: <PageSuspense><LabCatalogPage /></PageSuspense> },
          { path: '/labs/:id', element: <PageSuspense><LabExecutionPage /></PageSuspense> },
          { path: '/logs', element: <PageSuspense><LogViewerPage /></PageSuspense> },
          { path: '/profile', element: <PageSuspense><ProfilePage /></PageSuspense> },
          
          /* Admin / Instructor Guarded Routes */
          {
            element: <AdminRoute />,
            children: [
              { path: '/admin/chaos', element: <PageSuspense><ChaosControlPage /></PageSuspense> },
            ],
          },
        ],
      },
    ],
  },
  /* Fallback 404 Route */
  {
    path: '*',
    element: <PageSuspense><NotFoundPage /></PageSuspense>,
  },
]);
