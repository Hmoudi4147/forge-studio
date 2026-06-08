/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        surface: "#111113",
        border: "#1E1E22",
        gold: "#C9A84C",
        "gold-light": "#E8D5A3",
        text: "#F5F5F0",
        muted: "#6B6B7A",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
