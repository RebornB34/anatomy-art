/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0a',
        'cyber-dark': '#1a1a2e',
        'cyber-blue': '#00d4ff',
        'cyber-crimson': '#ff006e',
        'cyber-purple': '#7209b7',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.6)',
        'glow-crimson': '0 0 20px rgba(255, 0, 110, 0.6)',
      },
    },
  },
  plugins: [],
}
