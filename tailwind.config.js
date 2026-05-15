/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#00243D',
        brandAccent: '#00537E',
      },
      boxShadow: {
        soft: '0 24px 60px rgba(0, 36, 61, 0.08)',
      },
    },
  },
  plugins: [],
}

