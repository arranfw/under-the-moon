import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "top-[0%]",
    "top-[25%]",
    "top-[50%]",
    "top-[75%]",
    "left-[0%]",
    "left-[25%]",
    "left-[50%]",
    "left-[75%]",
    "ml-1",
    "ml-2",
    "ml-3",
    "ml-4",
    "ml-5",
    "bg-connections-yellow",
    "bg-connections-green",
    "bg-connections-blue",
    "bg-connections-purple",
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
        "connections-yellow": "rgb(var(--connections-yellow))",
        "connections-green": "rgb(var(--connections-green))",
        "connections-blue": "rgb(var(--connections-blue))",
        "connections-purple": "rgb(var(--connections-purple))",
      },
      colors: {
        "connections-button": "rgb(0, 0, 0)",
        "connections-button-active": "rgb(255, 255, 255)",
      },
      width: {
        "120": "30rem",
        "88": "22rem",
      },
      top: {
        "20": "5rem",
        "30": "7.5rem",
        "40": "10rem",
        "50": "12.5rem",
      },
      left: {
        "20": "5rem",
        "30": "7.5rem",
        "40": "10rem",
        "50": "12.5rem",
      },
      animation: {
        jiggleIncorrect: "jiggleIncorrect .25s ease-in-out infinite",
        jiggleCorrect: "jiggleCorrect 400ms ease-in-out",
        popIn: "popIn 500ms ease-in-out, fadeIn 500ms ease-in-out",
        slideDown: "slideDown 500ms ease-in-out, fadeIn 500ms ease-in-out",
      },
      keyframes: {
        jiggleIncorrect: {
          "0%, 100%": { transform: "translateX(0px)" },
          "33%": { transform: "translateX(4px)" },
          "77%": { transform: "translateX(-4px)" },
        },
        jiggleCorrect: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        popIn: {
          "0%": { transform: "scale(.8)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(10%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
