import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { Toaster } from '@/components/ui/Toast';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
    </ErrorBoundary>
  );
};

export default App;
