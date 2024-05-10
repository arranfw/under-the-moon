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
        "connections-difficulty-1": "rgb(249, 223, 109)",
        "connections-difficulty-2": "rgb(160, 195, 90)",
        "connections-difficulty-3": "rgb(176, 196, 239)",
        "connections-difficulty-4": "rgb(186, 129, 197)",
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
