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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center shadow-md text-brand-primary group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-text-primary tracking-tight">DeployFix</span>
                <span className="text-brand-primary font-mono font-bold text-base">Lab</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-brand-primary/10 text-brand-primary border border-brand-primary/20">v2.0</span>
              </div>
            </div>
          </Link>

          {/* Live System Operational Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational 99.98%</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link
            to="/register"
            id="header-getstarted-btn"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational (99.98%)</span>
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
