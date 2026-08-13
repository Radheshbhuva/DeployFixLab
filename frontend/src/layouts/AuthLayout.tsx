import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #475569 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial Blue Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Auth Container Card */}
      <div className="relative z-10 w-full max-w-md bg-bg-surface border border-slate-700 rounded-xl p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-sm animate-in fade-in duration-300">
        {children}
      </div>
    </div>
  );
};
