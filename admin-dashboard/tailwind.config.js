/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"Titillium Web"', "sans-serif"] },
      colors: {
        primary: { DEFAULT: "#4793ff", light: "#6AA8FF", lightest: "#f0f7ff" },
        text: { primary: "#494e60", secondary: "#757b8c", muted: "#9fa4b4" },
        background: { page: "#f8f8f8", card: "#ffffff" },
        border: { DEFAULT: "#dedede", light: "#f0f0f0" },
        status: { success: "#7ED321", error: "#FF1F3A", warning: "#f5a623" },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
