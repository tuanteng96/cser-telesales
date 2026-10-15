/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // Keep Tailwind classes separate from the existing Bootstrap utilities.
  prefix: 'tw-',
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        primary: 'var(--bs-primary)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
