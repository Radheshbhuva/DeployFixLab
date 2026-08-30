import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/guards/PublicOnlyRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';

import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LabCatalogPage } from '@/features/labs/LabCatalogPage';
import { LabExecutionPage } from '@/features/labs/LabExecutionPage';
import { LogViewerPage } from '@/features/logs/LogViewerPage';
import { DiagnosisPage } from '@/features/diagnosis/DiagnosisPage';
import { ChaosControlPage } from '@/features/admin/ChaosControlPage';
import { UserManagementPage } from '@/features/admin/UserManagementPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/labs',
        element: <LabCatalogPage />,
      },
      {
        path: '/labs/:labId',
        element: <LabExecutionPage />,
      },
      {
        path: '/logs',
        element: <LogViewerPage />,
      },
      {
        path: '/diagnosis',
        element: <DiagnosisPage />,
      },
      {
        path: '/admin',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
            <ChaosControlPage />
          </RoleGuard>
        ),
      },
      {
        path: '/admin/chaos',
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'INSTRUCTOR']}>
            <ChaosControlPage />
          </RoleGuard>
        ),
      },
      {
        path: '/admin/users',
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <UserManagementPage />
          </RoleGuard>
        ),
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
