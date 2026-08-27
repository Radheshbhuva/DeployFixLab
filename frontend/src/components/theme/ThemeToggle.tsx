import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeMode } from '@/store/themeStore';

interface ThemeToggleProps {
  showDropdown?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showDropdown = true, className = '' }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-cyan-400" /> },
    { mode: 'system', label: 'System', icon: <Laptop className="w-4 h-4 text-text-secondary" /> },
  ];

  if (!showDropdown) {
    return (
      <button
        onClick={toggleTheme}
        className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border-default bg-bg-surface hover:bg-bg-raised text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-cyan-400 transform transition-transform duration-300 rotate-0 hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transform transition-transform duration-300 rotate-0 hover:rotate-45" />
        )}
      </button>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div className="inline-flex items-center rounded-lg border border-border-default bg-bg-surface shadow-sm">
        {/* Quick Toggle Button */}
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center p-2 rounded-l-lg hover:bg-bg-raised text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          title={`Currently ${theme} theme (${resolvedTheme}). Click to toggle.`}
          aria-label={`Toggle theme: current is ${resolvedTheme}`}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-cyan-400 transform transition-transform duration-300 hover:-rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transform transition-transform duration-300 hover:rotate-45" />
          )}
        </button>

        {/* Dropdown Chevron */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border-l border-border-default rounded-r-lg hover:bg-bg-raised text-text-muted hover:text-text-primary transition-colors focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Select theme mode"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Theme Selection Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 py-1 bg-bg-surface border border-border-default rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Appearance
          </div>
          {options.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => {
                setTheme(opt.mode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                theme === opt.mode
                  ? 'bg-bg-raised text-brand-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised/70'
              }`}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                <span>{opt.label}</span>
              </div>
              {theme === opt.mode && <Check className="w-3.5 h-3.5 text-brand-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
