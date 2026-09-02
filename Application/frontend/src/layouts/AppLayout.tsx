import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex overflow-hidden">
      {/* Desktop Sidebar (fixed 240px) */}
      <div className="hidden lg:block w-60 h-screen flex-shrink-0 sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-60 h-full">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-md text-text-muted hover:text-text-primary bg-bg-surface border border-border-default z-20"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 flex flex-col overflow-hidden w-full animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
