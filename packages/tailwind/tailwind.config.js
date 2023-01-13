const { fontFamily } = require("tailwindcss/defaultTheme");
const { grayDark, amber, greenDark } = require("@radix-ui/colors");

function expandColors(colors, colorName) {
  return Object.keys(colors).reduce(
    (dict, _, i) => ({
      ...dict,
      [i + 1]: colors[`${colorName}${i + 1}`],
    }),
    {}
  );
}

/**
 * colors guide: https://www.radix-ui.com/docs/colors/palette-composition/understanding-the-scale
 *
 * bg
 * 1  - App background
 * 2  - Subtle background
 *
 * bg
 * 3  - UI element background
 * 4  - Hovered UI element background
 * 5  - Active / Selected UI element background
 *
 * borders
 * 6  - Subtle borders and separators
 * 7  - UI element border and focus rings
 * 8  - Hovered UI element border
 *
 * solid
 * 9  - Solid backgrounds
 * 10 - Hovered solid backgrounds
 *
 * text
 * 11 - Low-contrast text
 * 12 - High-contrast text
 *
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../apps/extension/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        gray: expandColors(grayDark, "gray"),
        amber: expandColors(amber, "amber"),
        green: expandColors(greenDark, "green"),
      },
    },
  },
  plugins: [],
};
