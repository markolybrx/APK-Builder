/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The New "Matte Black" Palette
        matte: {
          900: '#050505', // Deepest Black (Main BG)
          800: '#0a0a0a', // Secondary (Cards)
          700: '#121212', // Tertiary (Hovers)
          border: '#27272a', // Zinc 800 (Subtle borders)
        },
        // The New Pastel Neon Accents
        neon: {
          blue: '#60a5fa',   // Soft Blue
          purple: '#c084fc', // Soft Purple
          cyan: '#22d3ee',   // Electric Cyan
          pink: '#f472b6',   // Cyber Pink
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // RESTORED: This gradient is useful for subtle fades
        'matte-gradient': 'linear-gradient(to bottom, #050505, #0a0a0a)',
      },
      // RESTORED: The animations needed for the "Glow" effects
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      // RESTORED: The keyframes that make the glow move
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #60a5fa' },
          '100%': { boxShadow: '0 0 20px #c084fc' },
        }
      }
    },
  },
  plugins: [],
};
