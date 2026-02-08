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
        // The "Matte Black" Palette
        matte: {
          900: '#050505', // The Void (Main BG)
          800: '#0a0a0a', // Secondary (Cards)
          700: '#121212', // Teriary (Hovers)
          border: '#27272a', // Subtle borders
        },
        // Pastel Neon Accents
        neon: {
          blue: '#60a5fa',   // Soft Blue
          purple: '#c084fc', // Soft Purple
          cyan: '#22d3ee',   // Electric Cyan
          pink: '#f472b6',   // Cyber Pink
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'matte-gradient': 'linear-gradient(to bottom, #050505, #0a0a0a)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
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
