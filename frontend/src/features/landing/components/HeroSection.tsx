import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, PlayCircle, ArrowRight } from 'lucide-react';
import { InteractiveStudioPreview } from './InteractiveStudioPreview';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Background Radial Glow Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Announcement Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-8 hover:bg-cyan-500/15 transition-colors">
        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>DeployFix V2 Engine Active — Zero-Secret Multi-Source Analysis</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>

      {/* Main Display Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-50 tracking-tight max-w-4xl mx-auto leading-[1.15]">
        Stop Guessing in Production.{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
          Diagnose Broken Deployments
        </span>{' '}
        with Multi-Source Evidence.
      </h1>

      {/* Subheadline */}
      <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Ingest live health probes, Dockerfiles, GitHub commit diffs, and container logs into a deterministic AI reasoning engine. Get mathematical root-cause diagnosis, capped confidence scoring, and verified code diff remediation.
      </p>

      {/* CTA Button Group */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <Link
          to="/register"
          id="hero-signup-btn"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Sign Up Free (Launch Sandbox)</span>
        </Link>

        <Link
          to="/login"
          id="hero-demo-btn"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm backdrop-blur-md transition-all hover:border-slate-500"
        >
          <PlayCircle className="w-4 h-4 text-cyan-400" />
          <span>Live Demo Preview</span>
        </Link>
      </div>

      {/* Hero Interactive Studio Widget */}
      <div className="mt-16">
        <InteractiveStudioPreview />
      </div>
    </section>
  );
};
