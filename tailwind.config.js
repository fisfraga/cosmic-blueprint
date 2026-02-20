/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fire Element - Warm oranges and reds
        fire: {
          300: '#FFB088',
          400: '#FF8C5A',
          500: '#FF6B35',
          600: '#E55A2B',
          700: '#CC4A22',
          primary: '#FF6B35',
          secondary: '#FFE66D',
          tertiary: '#F7C548',
        },
        // Earth Element - Greens and browns
        earth: {
          300: '#5D8A3D',
          400: '#3D6A20',
          500: '#2D5016',
          600: '#234012',
          700: '#1A300E',
          primary: '#2D5016',
          secondary: '#8B7355',
          tertiary: '#C4A77D',
        },
        // Air Element - Blues and light blues
        air: {
          300: '#7BB3E8',
          400: '#5CA1E0',
          500: '#4A90D9',
          600: '#3A7AC0',
          700: '#2D64A8',
          primary: '#4A90D9',
          secondary: '#87CEEB',
          tertiary: '#B8D4E3',
        },
        // Water Element - Teals and deep blues
        water: {
          300: '#3D8A9A',
          400: '#2A7589',
          500: '#1A5F7A',
          600: '#154D63',
          700: '#103B4C',
          primary: '#1A5F7A',
          secondary: '#57C5B6',
          tertiary: '#159895',
        },
        // Human Design - Amber/Gold
        humandesign: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          primary: '#F59E0B',
          secondary: '#FDE68A',
          tertiary: '#D97706',
        },
        // Gene Keys - Purple/Violet
        genekey: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          primary: '#8B5CF6',
          secondary: '#DDD6FE',
          tertiary: '#7C3AED',
        },
        // Numerology — Solar gold (Adam Apollo harmonic system)
        numerology: {
          50: '#fef9f0',
          100: '#fef0d3',
          200: '#fcd89a',
          300: '#f9bc5e',
          400: '#f5a623',
          500: '#d98c0a',
          600: '#b07205',
          700: '#7a4f00',
          800: '#4d3100',
          900: '#2e1d00',
        },
        // Alchemy — Deep violet (Hermetic/Kybalion tradition)
        alchemy: {
          50: '#f5f0ff',
          100: '#ede0ff',
          200: '#d8bfff',
          300: '#b994ff',
          400: '#9b6dff',
          500: '#7c3aed',
          600: '#6425cc',
          700: '#4c1da8',
          800: '#341580',
          900: '#1e0d52',
        },
        // Chakra — Rose/Magenta (energy body system)
        chakra: {
          50: '#fff0f9',
          100: '#ffe0f5',
          200: '#ffc0ec',
          300: '#ff90db',
          400: '#f05cbf',
          500: '#db2777',
          600: '#b81e60',
          700: '#8f1549',
          800: '#660d32',
          900: '#3d071e',
        },
        // Neutral - Dark theme colors
        neutral: {
          100: '#F5F5F7',
          200: '#E5E5E7',
          300: '#D1D1D3',
          400: '#A1A1A3',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#0D0D15',
          primary: '#1A1A2E',
          secondary: '#2D2D44',
          background: '#0D0D15',
          text: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
