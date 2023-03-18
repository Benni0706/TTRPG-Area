/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{ejs,html,js}'],
  theme: {
    extend: {
      backgroundImage: {
        'checkboxEmpty': "url('/ttrpg-area/CheckboxEmpty.png')",
        'checkboxCrossed': "url('/ttrpg-area/CheckboxCrossed.png')",
      }
    },
  },
  plugins: [],
}
