/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-raised': 'var(--bg-raised)',
        'border-default': 'var(--border-default)',
        'border-subtle': 'var(--border-subtle)',
        'brand-primary': 'var(--brand-primary)',
        'brand-hover': 'var(--brand-hover)',
        'status-success': 'var(--status-success)',
        'status-success-dim': 'var(--status-success-dim)',
        'status-danger': 'var(--status-danger)',
        'status-danger-dim': 'var(--status-danger-dim)',
        'status-warning': 'var(--status-warning)',
        'status-warning-dim': 'var(--status-warning-dim)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'terminal-bg': 'var(--terminal-bg)',
        'terminal-border': 'var(--terminal-border)',
        'terminal-text': 'var(--terminal-text)',
        'terminal-green': 'var(--terminal-green)',
        'terminal-red': 'var(--terminal-red)',
        'terminal-amber': 'var(--terminal-amber)',
        'terminal-cyan': 'var(--terminal-cyan)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
