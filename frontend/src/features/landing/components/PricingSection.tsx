import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../data/landingData';

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border-default">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-brand-primary font-mono text-xs uppercase tracking-widest font-semibold">
          Transparent Developer Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2 tracking-tight">
          Invest in Rapid Incident Resolution
        </h2>
        <p className="text-text-secondary mt-4 text-base leading-relaxed">
          Start troubleshooting for free with local Docker sandboxes, or unlock unlimited AI root-cause correlation for your engineering team.
        </p>

        {/* Monthly / Annual Toggle Switch */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-xs font-mono font-medium ${!isAnnual ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 rounded-full bg-bg-raised border border-border-default p-0.5 transition-colors focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-5 h-5 rounded-full bg-brand-primary shadow-md transform transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-mono font-medium ${isAnnual ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
              Annual
            </span>
            <span className="px-2 py-0.5 rounded-full bg-status-success-dim border border-status-success/20 text-status-success text-[10px] font-mono font-semibold">
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
                  ? 'border-2 border-brand-primary/80 bg-bg-surface ring-1 ring-brand-primary/30 shadow-2xl lg:-translate-y-2'
                  : 'border border-border-default bg-bg-surface/80 backdrop-blur-xl'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular for Engineers
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-border-default">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-text-primary tracking-tight">
                    ${price}
                  </span>
                  <span className="text-xs font-mono text-text-secondary">
                    {plan.priceMonthly > 0 ? '/ month' : 'forever'}
                  </span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-muted font-semibold mb-2">
                    Included Features:
                  </div>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-text-secondary leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/register"
                className={`w-full py-3 px-4 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  plan.isPopular
                    ? 'bg-brand-primary hover:bg-brand-hover text-white shadow-lg shadow-brand-primary/25 hover:scale-[1.02]'
                    : 'bg-bg-raised hover:bg-bg-surface text-text-primary border border-border-default'
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
