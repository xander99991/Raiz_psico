import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial del Manual de Identidad RAÍZ
        marino: { DEFAULT: '#2E7092', 900: '#1C4A63', 800: '#245C79', 50: '#EAF3F7' },
        celeste: { DEFAULT: '#78CDD0', 100: '#DDF3F3' },
        agua: { DEFAULT: '#99D0A9', 100: '#E3F3E7' },
        turquesa: { DEFAULT: '#1AB099', 600: '#13917E', 100: '#D3F1EB' },
        hueso: { DEFAULT: '#FCFFF5', 200: '#F1F6E6' },
        tinta: '#1E3440',
      },
      fontFamily: {
        display: ['Comfortaa', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['"Nunito Sans Variable"', '"Nunito Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { blob: '2.5rem' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: { marquee: 'marquee 40s linear infinite', float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
export default config;
