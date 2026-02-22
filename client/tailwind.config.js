/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Titillium Web"', "sans-serif"],
      },
      fontSize: {
        "xl-bold": [
          "2rem",
          {
            fontWeight: "700",
            letterSpacing: "0.56px",
            lineHeight: "1.15",
            fontFamily: "Titillium",
          },
        ],
        "xl-semibold": [
          "2rem",
          {
            fontWeight: "600",
            letterSpacing: "0.56px",
            lineHeight: "1.15",
            fontFamily: "Titillium",
          },
        ],
        "lg-bold": [
          "1.625rem",
          {
            fontWeight: "700",
            letterSpacing: "0.56px",
            lineHeight: "1.15",
            fontFamily: "Titillium",
          },
        ],
        "lg-semibold": [
          "1.625rem",
          {
            fontWeight: "600",
            letterSpacing: "0.56px",
            lineHeight: "1.15",
            fontFamily: "Titillium",
          },
        ],
        "md-bold": [
          "1.375rem",
          {
            fontWeight: "700",
            letterSpacing: "0.44px",
            lineHeight: "normal",
            fontFamily: "Titillium",
          },
        ],
        "md-semibold": [
          "1.375rem",
          {
            fontWeight: "600",
            letterSpacing: "0.44px",
            lineHeight: "normal",
            fontFamily: "Titillium",
          },
        ],
        "sm-bold": [
          "1.25rem",
          {
            fontWeight: "700",
            letterSpacing: "0.39px",
            lineHeight: "normal",
            fontFamily: "Titillium",
          },
        ],
        "sm-semibold": [
          "1.25rem",
          {
            fontWeight: "600",
            letterSpacing: "0.39px",
            lineHeight: "normal",
            fontFamily: "Titillium",
          },
        ],
        "xs-bold": [
          "1rem",
          {
            fontWeight: "700",
            letterSpacing: "0.39px",
            lineHeight: "normal",
            fontFamily: "Titillium",
          },
        ],
        "xs-semibold": [
          "1rem",
          {
            fontWeight: "600",
            letterSpacing: "0.39px",
            lineHeight: "normal",
            fontFamily: "Titillium",
          },
        ],
        "xs-regular": [
          "1rem",
          {
            fontWeight: "400",
            letterSpacing: "0.39px",
            lineHeight: "normal",
            fontFamily: "Titillium",
          },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: "#4793ff",
          light: "#6AA8FF",
          lighter: "#e0efff",
          lightest: "#f0f7ff",
        },
        secondary: {
          DEFAULT: "#6AA8FF",
        },
        
        // Text colors
        text: {
          primary: "#494e60",
          secondary: "#757b8c",
          muted: "#9fa4b4",
          light: "#8c92a3",
          placeholder: "#bbb",
        },
        
        // Background colors
        background: {
          DEFAULT: "#ffffff",
          page: "#f8f8f8",
          muted: "#fafafa",
          card: "#ffffff",
        },
        
        // Border colors
        border: {
          DEFAULT: "#dedede",
          light: "#f0f0f0",
          focus: "#4793ff",
        },
        
        // Status colors
        status: {
          success: "#7ED321",
          error: "#FF1F3A",
          warning: "#f5a623",
          info: "#4793ff",
        },
        
        // Star rating
        star: {
          DEFAULT: "#FFB800",
          empty: "#E5E5E5",
        },
        
        // Dark backgrounds (footer, etc)
        dark: {
          DEFAULT: "#242936",
          light: "#818798",
          lighter: "#97A4B4",
        },
        
        // Service category colors
        service: {
          blue: { bg: "#e3f2fd", text: "#1976d2" },
          purple: { bg: "#ede7f6", text: "#673ab7" },
          orange: { bg: "#fff3e0", text: "#ff9800" },
          red: { bg: "#ffebee", text: "#f44336" },
          teal: { bg: "#e0f2f1", text: "#009688" },
          pink: { bg: "#fce4ec", text: "#e91e63" },
          green: { bg: "#e8f5e9", text: "#4caf50" },
          indigo: { bg: "#e8eaf6", text: "#3f51b5" },
          cyan: { bg: "#e0f7fa", text: "#00bcd4" },
          amber: { bg: "#fff8e1", text: "#ffc107" },
          lime: { bg: "#f0f4c3", text: "#827717" },
          deepPurple: { bg: "#ede7f6", text: "#9c27b0" },
        },
        
        // Legacy aliases for backwards compatibility
        "blue-dark": {
          DEFAULT: "#242936",
        },
        "blue-light-one": {
          DEFAULT: "#818798",
        },
        "blue-light-two": {
          DEFAULT: "#97A4B4",
        },
        grey: {
          DEFAULT: "#A6A5A5",
        },
        "light-grey": {
          DEFAULT: "#dedede",
        },
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
