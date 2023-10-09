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
          DEFAULT: "#E3E29C",
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#FEFEFB",
          300: "#F5F5DC",
          400: "#ECEBBC",
          500: "#E3E29C",
          600: "#D7D570",
          700: "#CAC845",
          800: "#A7A62F",
          900: "#7C7A23",
          950: "#66651D",
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
