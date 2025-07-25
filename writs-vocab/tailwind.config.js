// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#FFFDF6',
        option:   '#F5F3EE',
        'brand-red':   '#C90000',
        'brand-navy':  '#002B42',
      },
      fontFamily: {
        heading: ['"Playfair Display"', '"Merriweather"', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn:  '12px',
      },
    },
  },
  plugins: [],
};
