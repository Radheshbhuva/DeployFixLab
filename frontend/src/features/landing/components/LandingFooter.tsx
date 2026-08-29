import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Github, Twitter, MessageSquare } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-border-default bg-bg-surface text-text-secondary text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Col (2 cols on mobile/tablet) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shadow-md text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-base text-text-primary font-sans tracking-tight">
                DeployFix <span className="text-brand-primary font-mono">Lab</span>
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-sm">
              Evidence-Based Production Deployment Troubleshooting & Guided Recovery Platform. Deterministic AI diagnosis, containerized chaos labs, and zero-secret safety.
            </p>

            <div className="flex items-center gap-2 pt-2 text-status-success">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span>All Systems Operational (99.98%)</span>
            </div>
          </div>

          {/* Col 1: Account & Platform */}
          <div className="space-y-3">
            <div className="text-text-primary font-semibold uppercase tracking-wider text-[11px]">
              Account & Workspace
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-brand-primary font-semibold hover:underline transition-colors">
                  Sign In to Workspace →
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-status-success font-semibold hover:underline transition-colors">
                  Create Free Account →
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-primary transition-colors">
                  Service Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-primary transition-colors">
                  Chaos Lab Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Documentation */}
          <div className="space-y-3">
            <div className="text-text-primary font-semibold uppercase tracking-wider text-[11px]">
              Documentation
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="hover:text-brand-primary transition-colors">
                  Diagnostic Architecture
                </a>
              </li>
              <li>
                <a href="#sources" className="hover:text-brand-primary transition-colors">
                  4 Context Sources V2
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-brand-primary transition-colors">
                  Zero-Secret Security Policy
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-primary transition-colors">
                  Docker Deployment Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Social */}
          <div className="space-y-3">
            <div className="text-text-primary font-semibold uppercase tracking-wider text-[11px]">
              Community
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Radheshbhuva/DeployFixLab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Discord Server
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors flex items-center gap-1.5"
                >
                  <Twitter className="w-3.5 h-3.5" /> Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-muted">
          <div>
            © {new Date().getFullYear()} DeployFix Lab. Built for high-reliability engineering.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-text-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              SOC2 Compliant Architecture
            </span>
            <a href="#security" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#security" className="hover:text-text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
