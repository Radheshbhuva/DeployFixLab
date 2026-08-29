/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'rgb(var(--bg-primary) / <alpha-value>)',
        'bg-surface': 'rgb(var(--bg-surface) / <alpha-value>)',
        'bg-raised': 'rgb(var(--bg-raised) / <alpha-value>)',
        'border-default': 'rgb(var(--border-default) / <alpha-value>)',
        'border-subtle': 'rgb(var(--border-subtle) / <alpha-value>)',
        'brand-primary': 'rgb(var(--brand-primary) / <alpha-value>)',
        'brand-hover': 'rgb(var(--brand-hover) / <alpha-value>)',
        'status-success': 'rgb(var(--status-success) / <alpha-value>)',
        'status-success-dim': 'rgb(var(--status-success-dim) / <alpha-value>)',
        'status-danger': 'rgb(var(--status-danger) / <alpha-value>)',
        'status-danger-dim': 'rgb(var(--status-danger-dim) / <alpha-value>)',
        'status-warning': 'rgb(var(--status-warning) / <alpha-value>)',
        'status-warning-dim': 'rgb(var(--status-warning-dim) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'terminal-bg': 'rgb(var(--terminal-bg) / <alpha-value>)',
        'terminal-border': 'rgb(var(--terminal-border) / <alpha-value>)',
        'terminal-text': 'rgb(var(--terminal-text) / <alpha-value>)',
        'terminal-green': 'rgb(var(--terminal-green) / <alpha-value>)',
        'terminal-red': 'rgb(var(--terminal-red) / <alpha-value>)',
        'terminal-amber': 'rgb(var(--terminal-amber) / <alpha-value>)',
        'terminal-cyan': 'rgb(var(--terminal-cyan) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
