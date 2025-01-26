/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: ['./src/**/*.{html,ts}'],
  safelist: ['badge-info', 'badge-success', 'badge-warning', 'badge-error'],

  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['winter'],
  },
  plugins: [require('daisyui')],
};
