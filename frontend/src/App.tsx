import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { Toaster } from '@/components/ui/Toast';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
