import React from 'react';
import { AuthSidebarShowcase } from '@/features/auth/components/AuthSidebarShowcase';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-bg-primary text-text-primary flex items-center justify-center p-2 sm:p-4 lg:p-6 relative font-sans select-none transition-colors">
      {/* Background Subtle Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b0f_1px,transparent_1px),linear-gradient(to_bottom,#64748b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Radial Glow Spotlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[350px] bg-brand-primary/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Split-Screen Container Card */}
      <div className="relative z-10 w-full max-w-5xl h-auto max-h-[95vh] rounded-2xl border border-border-default bg-bg-surface backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Telemetry & Social Proof Sidebar (5 cols, Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-5 h-full">
          <AuthSidebarShowcase />
        </div>

        {/* Right Column: Form Container (7 cols on desktop, 12 on mobile) */}
        <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center bg-bg-surface/50 overflow-y-auto max-h-[95vh]">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
};
