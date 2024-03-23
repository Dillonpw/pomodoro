/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addUtilities }) {
      const newUtilities = {
        '.no-spinner': {
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
          },
          '&': {
            '-moz-appearance': 'textfield', // Note: This will not apply due to limitations with inline styles and Firefox.
          },
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
}
