/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F172A',
        'bg-surface': '#1E293B',
        'bg-raised': '#334155',
        'border-default': '#475569',
        'brand-primary': '#3B82F6',
        'brand-hover': '#2563EB',
        'status-success': '#22C55E',
        'status-success-dim': '#166534',
        'status-danger': '#EF4444',
        'status-danger-dim': '#7F1D1D',
        'status-warning': '#F59E0B',
        'status-warning-dim': '#78350F',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
        'terminal-green': '#4ADE80',
        'terminal-red': '#F87171',
        'terminal-amber': '#FCD34D',
        'terminal-cyan': '#67E8F9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
