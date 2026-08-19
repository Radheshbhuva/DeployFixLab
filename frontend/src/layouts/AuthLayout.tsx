import React from 'react';
import { AuthSidebarShowcase } from '@/features/auth/components/AuthSidebarShowcase';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden font-sans">
      {/* Background Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Radial Glow Spotlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Split-Screen Container Card */}
      <div className="relative z-10 w-full max-w-6xl rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Telemetry & Social Proof Sidebar (5 cols, Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5">
          <AuthSidebarShowcase />
        </div>

        {/* Right Column: Form Container (7 cols on desktop, 12 on mobile) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center bg-slate-950/40">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
};
