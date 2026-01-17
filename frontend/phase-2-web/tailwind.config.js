/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37',
        secondary: '#1a1a1a',
        dark: '#0F0F0F',
        danger: '#EF4444',
        gold: '#D4AF37',
        'gold-light': '#F4E4C1',
        'gold-dark': '#AA8C2E',
      },
      backgroundColor: {
        'luxury-dark': '#0F0F0F',
        'luxury-black': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
