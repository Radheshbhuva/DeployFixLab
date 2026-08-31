import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertOctagon, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-bg-surface border border-border-default rounded-xl p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-bg-raised text-status-warning flex items-center justify-center mx-auto mb-4">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary mb-2">404</h1>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Route Not Found</h2>
        <p className="text-xs text-text-secondary mb-6">
          The requested path does not exist in the DeployFix Lab environment hierarchy.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')} className="w-full">
          <Home className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
