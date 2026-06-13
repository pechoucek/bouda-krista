import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  "#f2f7f2",
          100: "#e0ede0",
          200: "#c2dbc2",
          300: "#93bc93",
          400: "#5e975e",
          500: "#3a753a",
          600: "#2b5c2b",
          700: "#244924",
          800: "#1e3b1e",
          900: "#1a311a",
          950: "#0d1a0d",
        },
        stone: {
          warm: "#f5f0e8",
        },
        gold: "#c9a84c",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
