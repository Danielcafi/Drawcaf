/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        drawcaf: {
          green: "#008060",
          emerald: "#10B981",
          dark: "#030712",
          surface: "#0b0f19",
          card: "#111827",
          border: "#1f2937",
          muted: "#9ca3af"
        },
        primary: {
          100: "#1E3A8B",
          200: "#93C5FD",
          300: "#1E3A5F"
        },
        black: {
          100: "#212625",
          200: "#424C4A",
          300: "#57605E",
          400: "#82918E",
          500: "#212326"
        },
        secondary: {
          200: "#FFBC9F"
        },
        tertiary: {
          200: "#FFDB95",
          300: "#FBF7EC"
        }
      },
      fontFamily: {
        "head": ["Poppins", "sans-serif"],
        "body": ["Poppins", "sans-serif"],
        "jakarta": ["Plus Jakarta Sans", "sans-serif"],
        "dm": ["DM Sans", "sans-serif"]
      },
      opacity: {
        "15": ".15"
      }
    },
  },
  plugins: [],
}
