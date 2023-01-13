const config = require("tailwind/tailwind.config");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ...config.theme.extend,
      fontFamily: {
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
    },
  },
};
