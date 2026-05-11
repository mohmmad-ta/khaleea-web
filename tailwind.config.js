/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: '#F15A29',
          primary: '#231F20',
          secondary: '#717171',
          soft: '#FFF4EF',
          warm: '#FFE1D6',
        },
      },
      boxShadow: {
        glow: '0 30px 80px rgba(241, 90, 41, 0.18)',
        card: '0 16px 40px rgba(35, 31, 32, 0.10)',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at top left, rgba(241, 90, 41, 0.35), transparent 35%), radial-gradient(circle at right, rgba(255, 255, 255, 0.14), transparent 30%)',
      },
      fontFamily: {
        display: ['"Almarai"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Almarai"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  plugins: [],
}
