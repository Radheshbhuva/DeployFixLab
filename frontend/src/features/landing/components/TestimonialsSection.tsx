import React from 'react';
import { TESTIMONIALS_DATA } from '../data/landingData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold">
          Proven Engineering Impact
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mt-2 tracking-tight">
          Trusted by SREs, DevOps & Platform Teams
        </h2>
        <p className="text-slate-400 mt-4 text-base leading-relaxed">
          See how engineering teams use DeployFix Lab to eliminate alert fatigue and accelerate incident resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS_DATA.map((item) => (
          <div
            key={item.id}
            className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between shadow-xl relative"
          >
            <div>
              {/* Highlight Metric Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-semibold mb-6">
                <span>{item.metricHighlight}</span>
              </div>

              {/* Quote Text */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                "{item.quote}"
              </p>
            </div>

            {/* Author Profile */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <img
                src={item.avatarUrl}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="text-sm font-bold text-slate-100">{item.name}</div>
                <div className="text-xs text-slate-400 font-mono">
                  {item.role}, {item.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
