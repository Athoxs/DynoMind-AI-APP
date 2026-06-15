/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        yamaha: { red: '#E60012', dark: '#121212', lightDark: '#1E1E1E', gray: '#F5F5F7' }
      }
    },
  },
  plugins: [],
}