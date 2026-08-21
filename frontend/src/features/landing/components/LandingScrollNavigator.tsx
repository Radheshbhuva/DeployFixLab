import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const LandingScrollNavigator: React.FC = () => {
  const [isAtOrPastFaq, setIsAtOrPastFaq] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        const rect = faqElement.getBoundingClientRect();
        // If FAQ top is within or above the viewport center, consider the user "at FAQ or below"
        if (rect.top <= window.innerHeight * 0.5) {
          setIsAtOrPastFaq(true);
        } else {
          setIsAtOrPastFaq(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isAtOrPastFaq) {
      // Scroll directly to the top-most part of the landing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll directly to the FAQ section
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isAtOrPastFaq ? 'Scroll directly to top' : 'Scroll directly to FAQ section'}
        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out select-none cursor-pointer hover:scale-105 active:scale-95 ${
          isAtOrPastFaq
            ? 'bg-slate-900/90 border-emerald-500/50 hover:border-emerald-400 text-emerald-300 shadow-[0_0_25px_-5px_rgba(16,185,129,0.35)]'
            : isHovered
            ? 'bg-slate-900/95 border-cyan-400 text-cyan-300 shadow-[0_0_30px_-5px_rgba(6,182,212,0.45)] ring-1 ring-cyan-400/50'
            : 'bg-slate-900/85 border-slate-700/80 hover:border-cyan-500/50 text-slate-200 shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)]'
        }`}
      >
        {isAtOrPastFaq ? (
          <>
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:-translate-y-0.5 transition-transform duration-200">
              <ChevronUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wide transition-all duration-200">
              Back to Top
            </span>
          </>
        ) : (
          <>
            <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 group-hover:translate-y-0.5 transition-transform duration-200">
              {isHovered ? (
                <ChevronDown className="w-4 h-4 text-cyan-300 animate-bounce" />
              ) : (
                <HelpCircle className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <span className="text-xs font-mono font-semibold tracking-wide transition-all duration-300">
              {isHovered ? (
                <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                  Go to FAQ
                </span>
              ) : (
                <span>FAQ Navigator</span>
              )}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                isHovered ? 'text-cyan-300 translate-y-0.5 opacity-100' : 'text-slate-400 opacity-60'
              }`}
            />
          </>
        )}
      </button>
    </div>
  );
};
