import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/landingData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-border-default">
      <div className="text-center mb-16">
        <span className="text-brand-primary font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2 tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-text-secondary mt-4 text-base leading-relaxed">
          Technical details regarding security, local Docker execution, and deterministic AI scoring.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-brand-primary/40 bg-bg-surface shadow-xl ring-1 ring-brand-primary/20'
                  : 'border-border-default bg-bg-surface/60 hover:border-brand-primary/30'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-base sm:text-lg font-semibold text-text-primary">
                  {faq.question}
                </span>
                <div
                  className={`p-1.5 rounded-lg bg-bg-raised border border-border-default text-text-muted transform transition-transform ${
                    isOpen ? 'rotate-180 text-brand-primary border-brand-primary/30' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-default font-normal">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
