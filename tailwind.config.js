/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          "50": "#e6f9ee",
          "100": "#c1f0d5",
          "200": "#9ce7bc",
          "300": "#78dea3",
          "400": "#53d58a",
          "500": "#2ecc71",
          "600": "#26a85d",
          "700": "#1e8349",
          "800": "#155f34",
          "900": "#0d3a20",
        },
        primary: {
          "50": "#86a2b3",
          "100": "#728a99",
          "200": "#5d7380",
          "300": "#495b66",
          "400": "#34444d",
          "500": "#202c33",
          "600": "#182126",
          "700": "#10161a",
          "800": "#080b0d",
          "900": "#000000",
        },
        gray: {
          "50": "#ffffff",
          "100": "#e7eaec",
          "200": "#cfd5d9",
          "300": "#b6c0c6",
          "400": "#9eabb3",
          "500": "#8696a0",
          "600": "#717f88",
          "700": "#5d6971",
          "800": "#485259",
          "900": "#333b41",
        },
      },
    },
    fontFamily: {
      sans: ["Tajawal"],
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
