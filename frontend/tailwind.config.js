/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#06070f',
        panel: 'rgba(15, 18, 32, 0.72)',
        line: 'rgba(255,255,255,0.1)'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(99, 102, 241, 0.26)'
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 15% 15%, rgba(34,211,238,.24), transparent 26%), radial-gradient(circle at 82% 12%, rgba(168,85,247,.2), transparent 28%), radial-gradient(circle at 55% 88%, rgba(52,211,153,.15), transparent 30%)'
      }
    }
  },
  plugins: []
};
