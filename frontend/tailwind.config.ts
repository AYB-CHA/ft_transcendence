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
          DEFAULT: "#1fc857",
          "50": "#f0fdf4",
          "100": "#dbfde6",
          "200": "#aef7c5",
          "300": "#84f1a7",
          "400": "#47e17a",
          "500": "#1fc857",
          "600": "#13a644",
          "700": "#138238",
          "800": "#146731",
          "900": "#13542b",
          "950": "#042f14",
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
