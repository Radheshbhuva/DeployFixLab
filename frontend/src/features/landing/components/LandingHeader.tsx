import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: '4-Source Context', href: '#sources' },
    { label: 'Chaos Labs', href: '#labs' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border-default bg-bg-surface/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Brand Logo + Operational Pill */}
        <div className="flex items-center gap-3.5 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center shadow-sm text-brand-primary group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-text-primary tracking-tight">DeployFix</span>
              <span className="text-brand-primary font-mono font-bold text-base">Lab</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-brand-primary/10 text-brand-primary border border-brand-primary/20">v2.0</span>
            </div>
          </Link>

          {/* Live System Operational Capsule Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] leading-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-semibold text-[10px]">Operational</span>
              <span className="text-[10px] opacity-90">99.98%</span>
            </div>
          </div>
        </div>

        {/* Center Section: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs xl:text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Section: Theme Toggle + Sign In + Get Started Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <ThemeToggle />

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-brand-primary transition-colors"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            id="header-getstarted-btn"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Get Started</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-bg-raised border border-border-default text-text-secondary hover:text-text-primary ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border-default bg-bg-surface px-4 py-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            <ThemeToggle />
          </div>

          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-raised hover:text-brand-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-border-default flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl bg-bg-raised border border-border-default text-text-primary font-semibold text-sm hover:bg-bg-surface transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center rounded-xl bg-brand-primary text-white font-bold text-sm shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
