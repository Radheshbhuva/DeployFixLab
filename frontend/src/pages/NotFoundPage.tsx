import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-slate-100 font-mono">404</h1>
        <h2 className="text-xl font-bold text-slate-200 mt-2">Route Not Found</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          The specified client route does not exist in the DeployFix Lab navigation table.
        </p>
      </div>
      <Link to="/dashboard">
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
