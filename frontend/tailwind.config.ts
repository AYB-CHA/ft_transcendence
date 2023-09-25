import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00CE94",
          50: "#87FFDD",
          100: "#72FFD7",
          200: "#49FFCC",
          300: "#21FFC0",
          400: "#00F7B1",
          500: "#00CE94",
          600: "#00966C",
          700: "#005E43",
          800: "#00261B",
          900: "#000000",
          950: "#000000",
        },
        dark: {
          DEFAULT: "#0F1015",
          dim: "#171B24",
          "semi-dim": "#1F2329",
          "semi-light": "#4B5563",
        },
      },
    },
  },
  plugins: [],
};
export default config;
