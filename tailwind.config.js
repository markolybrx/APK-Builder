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
          900: '#050505', // Deepest Black (Main BG)
          800: '#0a0a0a', // Secondary (Cards)
          700: '#121212', // Tertiary (Hovers)
          border: '#27272a', // Zinc 800 (Subtle borders)
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
      },
    },
  },
  plugins: [],
};
