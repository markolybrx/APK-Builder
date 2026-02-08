/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // Standard
    "./src/**/*.{js,ts,jsx,tsx,mdx}",      // If you use src/ dir
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Safety check
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1e293b', 
          900: '#0f172a', 
          950: '#020617',
        }
      },
    },
  },
  plugins: [],
};
