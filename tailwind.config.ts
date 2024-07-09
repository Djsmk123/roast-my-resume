// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media', // Enable dark mode based on system preferences
  theme: {
    extend: {
      colors: {
        'foreground-light': 'rgb(0, 0, 0)',
        'foreground-dark': 'rgb(255, 255, 255)',
        'background-start-light': 'rgb(214, 219, 220)',
        'background-end-light': 'rgb(255, 255, 255)',
        'background-start-dark': 'rgb(0, 0, 0)',
        'background-end-dark': 'rgb(0, 0, 0)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

export default config;
