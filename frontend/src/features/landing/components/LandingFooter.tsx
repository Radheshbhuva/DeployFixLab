import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Github, Twitter, MessageSquare } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Col (2 cols on mobile/tablet) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-slate-950 fill-current" />
              </div>
              <span className="font-bold text-base text-slate-100 font-sans tracking-tight">
                DeployFix <span className="text-cyan-400 font-mono">Lab</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              Evidence-Based Production Deployment Troubleshooting & Guided Recovery Platform. Deterministic AI diagnosis, containerized chaos labs, and zero-secret safety.
            </p>

            <div className="flex items-center gap-2 pt-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.98%)</span>
            </div>
          </div>

          {/* Col 1: Account & Platform */}
          <div className="space-y-3">
            <div className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Account & Workspace
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-cyan-400 font-semibold hover:underline transition-colors">
                  Sign In to Workspace →
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-emerald-400 font-semibold hover:underline transition-colors">
                  Create Free Account →
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-400 transition-colors">
                  Service Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyan-400 transition-colors">
                  Chaos Lab Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Documentation */}
          <div className="space-y-3">
            <div className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Documentation
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
                  Diagnostic Architecture
                </a>
              </li>
              <li>
                <a href="#sources" className="hover:text-cyan-400 transition-colors">
                  4 Context Sources V2
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-cyan-400 transition-colors">
                  Zero-Secret Security Policy
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-400 transition-colors">
                  Docker Deployment Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Social */}
          <div className="space-y-3">
            <div className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Community
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Radheshbhuva/DeployFixLab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Discord Server
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Twitter className="w-3.5 h-3.5" /> Twitter / X
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} DeployFix Lab. Built for high-reliability engineering.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 Compliant Architecture
            </span>
            <a href="#security" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#security" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
