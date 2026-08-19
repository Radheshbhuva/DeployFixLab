import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../data/landingData';

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold">
          Transparent Developer Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mt-2 tracking-tight">
          Invest in Rapid Incident Resolution
        </h2>
        <p className="text-slate-400 mt-4 text-base leading-relaxed">
          Start troubleshooting for free with local Docker sandboxes, or unlock unlimited AI root-cause correlation for your engineering team.
        </p>

        {/* Monthly / Annual Toggle Switch */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-xs font-mono font-medium ${!isAnnual ? 'text-slate-200 font-bold' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 transition-colors focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-5 h-5 rounded-full bg-cyan-400 shadow-md transform transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-mono font-medium ${isAnnual ? 'text-slate-200 font-bold' : 'text-slate-400'}`}>
              Annual
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-2xl relative ${
                plan.isPopular
                  ? 'border-2 border-cyan-500/80 bg-slate-900/90 ring-1 ring-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)] lg:-translate-y-2'
                  : 'border border-slate-800 bg-slate-900/60 backdrop-blur-xl'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular for Engineers
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-100">{plan.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-800">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-50 tracking-tight">
                    ${price}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {plan.priceMonthly > 0 ? '/ month' : 'forever'}
                  </span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Included Features:
                  </div>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={plan.ctaHref}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-center font-mono flex items-center justify-center gap-2 transition-all ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02]'
                    : 'border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>{plan.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};
