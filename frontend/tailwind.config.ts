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
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1440px",
        "2xl": "1896px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C2C4C0",
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#FFFFFF",
          300: "#EBEBEA",
          400: "#D6D8D5",
          500: "#C2C4C0",
          600: "#A6A9A3",
          700: "#8A8E86",
          800: "#6E716A",
          900: "#52544F",
          950: "#444642",
        },
        dark: {
          DEFAULT: "#0F1015",
          dim: "#13141B",
          "semi-dim": "#1F2329",
          "semi-light": "#4B5563",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
