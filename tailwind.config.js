/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Where Tailwind looks for class names
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // 2. Brand colors
      colors: {
        // page background
        cream:    '#FFFDF6',
        // option buttons default
        'option-bg': '#F5F3EE',
        // brand palette
        'brand-red':   '#C90000',
        'brand-navy':  '#002B42',
      },
      // 3. Typography
      fontFamily: {
        heading: ['"Playfair Display"', '"Merriweather"', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      // 4. Border-radius tokens
      borderRadius: {
        card: '16px',
        btn:  '12px',
      },
      // 5. Spacing tokens
      spacing: {
        'btn-h': '56px',  // uniform button height
        'gap-y': '20px',  // gap between option buttons
      },
    },
  },
  plugins: [],
  darkMode: false, // or 'media' / 'class' if you add a dark theme later
};
