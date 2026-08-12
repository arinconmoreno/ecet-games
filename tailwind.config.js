/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0A',
          card: '#151515',
          nav: '#111111',
          input: '#0A0A0A',
        },
        border: {
          card: '#222222',
          input: '#333333',
        },
        sofka: {
          orange: '#FF7E08',
          'orange-hover': '#E06B00',
          teal: '#06C8C8',
          violet: '#9747FF',
          pink: '#FE9CAB',
          green: '#42D36F',
          danger: '#E5484D',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#888888',
          tertiary: '#666666',
          muted: '#555555',
        },
        medal: {
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
        },
      },
      fontFamily: {
        clash: ['Clash Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
        badge: '4px',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
