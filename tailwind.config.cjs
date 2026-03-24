const daisyui = require('daisyui')

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        swiftbridge: {
          primary: '#2563eb',
          'primary-content': '#f5f7ff',
          secondary: '#7c3aed',
          accent: '#0ea5e9',
          neutral: '#1f2937',
          'base-100': '#f8fafc',
          'base-200': '#eef2ff',
          'base-300': '#dbeafe',
          info: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          '--rounded-box': '1.2rem',
          '--rounded-btn': '0.8rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.3s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.95',
        },
      },
      {
        'swiftbridge-dark': {
          primary: '#8b5cf6',
          'primary-content': '#0b0f19',
          secondary: '#f472b6',
          accent: '#38bdf8',
          neutral: '#0f172a',
          'base-100': '#0f172a',
          'base-200': '#111827',
          'base-300': '#1f2937',
          info: '#0ea5e9',
          success: '#22c55e',
          warning: '#facc15',
          error: '#f87171',
          '--rounded-box': '1.2rem',
          '--rounded-btn': '0.8rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.3s',
          '--animation-input': '0.2s',
          '--btn-focus-scale': '0.96',
        },
      },
    ],
  },
  plugins: [daisyui],
}
