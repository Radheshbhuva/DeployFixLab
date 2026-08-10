import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
