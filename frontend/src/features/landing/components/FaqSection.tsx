import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/landingData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
      <div className="text-center mb-16">
        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mt-2 tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-slate-400 mt-4 text-base leading-relaxed">
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
                  ? 'border-cyan-500/40 bg-slate-900/90 shadow-xl'
                  : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-base sm:text-lg font-semibold text-slate-100">
                  {faq.question}
                </span>
                <div
                  className={`p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 transform transition-transform ${
                    isOpen ? 'rotate-180 text-cyan-400 border-cyan-500/30' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 font-normal">
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
