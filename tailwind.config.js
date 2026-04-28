/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        navy: {
          DEFAULT: '#0F172A',
          secondary: '#1E293B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F3F4F6',
        },
        text: {
          DEFAULT: '#111827',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        md: '0 10px 30px rgba(15, 23, 42, 0.10)',
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
};
