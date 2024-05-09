import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        "connections-button": "rgb(239, 239, 230)",
        "connections-button-active": "rgb(90, 89, 78)",
      },
      colors: {
        "connections-button": "rgb(0, 0, 0)",
        "connections-button-active": "rgb(255, 255, 255)",
      },
    },
  },
  plugins: [],
};
export default config;
