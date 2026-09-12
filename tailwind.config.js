/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        cyanx: "#00e5c3",
        bluex: "#3182ff",
        coralx: "#ff5c8a",
        amberx: "#ffb84d"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 45px rgba(0,229,195,.18)"
      }
    }
  },
  plugins: []
}