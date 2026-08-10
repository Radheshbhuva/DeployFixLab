import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          DeployFix <span className="text-blue-400">Lab</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Production-Style DevOps Task Management Platform</p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <Outlet />
      </div>

      {/* Footer copyright */}
      <footer className="mt-8 text-center text-xs text-slate-500 relative z-10">
        DeployFix Lab Engineering Environment • Phase 1
      </footer>
    </div>
  );
};
