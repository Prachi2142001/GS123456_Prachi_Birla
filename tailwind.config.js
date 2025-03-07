/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
      },
      spacing: {
        'nav': '64px',
        'sidenav': '240px',
      },
      minWidth: {
        'app': '1080px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
