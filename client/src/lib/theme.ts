/**
 * Kosdok Design System - Theme Configuration
 * 
 * This file contains the design tokens used throughout the application.
 * Use these constants instead of hardcoded values for consistency.
 */

export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      DEFAULT: "#4793ff",
      light: "#6AA8FF",
      lighter: "#e0efff",
      lightest: "#f0f7ff",
    },
    
    // Text colors
    text: {
      primary: "#494e60",      // Main headings, important text
      secondary: "#757b8c",     // Body text, descriptions
      muted: "#9fa4b4",        // Labels, captions, meta info
      light: "#8c92a3",        // Lighter text variations
      placeholder: "#bbb",      // Input placeholders
    },
    
    // Background colors
    background: {
      DEFAULT: "#ffffff",       // Main background
      page: "#f8f8f8",          // Page background (gray)
      muted: "#fafafa",         // Slightly off-white
      card: "#ffffff",          // Card backgrounds
    },
    
    // Border colors
    border: {
      DEFAULT: "#dedede",       // Standard borders
      light: "#f0f0f0",         // Light dividers
      focus: "#4793ff",         // Focus states
    },
    
    // Status/Feedback colors
    status: {
      success: "#7ED321",       // Success, open, available
      error: "#FF1F3A",         // Error, closed, unavailable
      warning: "#f5a623",       // Warnings, attention
      info: "#4793ff",          // Information
    },
    
    // Star rating
    star: {
      filled: "#FFB800",        // Filled star color
      empty: "#E5E5E5",         // Empty star color
    },
    
    // Dark backgrounds
    dark: {
      DEFAULT: "#242936",       // Footer, dark sections
      light: "#818798",         // Dark section text
      lighter: "#97A4B4",       // Dark section muted text
    },
    
    // Service category colors (for pills, badges)
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
    },
  },
  
  // Spacing scale (matches Tailwind defaults)
  spacing: {
    0: "0",
    1: "0.25rem",   // 4px
    2: "0.5rem",    // 8px
    3: "0.75rem",   // 12px
    4: "1rem",      // 16px
    5: "1.25rem",   // 20px
    6: "1.5rem",    // 24px
    8: "2rem",      // 32px
    10: "2.5rem",   // 40px
    12: "3rem",     // 48px
    16: "4rem",     // 64px
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: '"Titillium Web", sans-serif',
    },
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  
  // Border radius
  borderRadius: {
    none: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  
  // Breakpoints
  breakpoints: {
    sm: "480px",
    md: "768px",
    lg: "976px",
    xl: "1440px",
  },
} as const;

// Tailwind class helpers
export const tw = {
  // Text colors
  textPrimary: "text-text-primary",
  textSecondary: "text-text-secondary", 
  textMuted: "text-text-muted",
  
  // Backgrounds
  bgPage: "bg-background-page",
  bgCard: "bg-background-card",
  bgMuted: "bg-background-muted",
  
  // Borders
  borderDefault: "border-border",
  borderLight: "border-border-light",
  
  // Status badges
  statusOpen: "bg-status-success",
  statusClosed: "bg-status-error",
  
  // Common patterns
  cardBase: "bg-white border border-border",
  inputBase: "border border-border focus:border-primary focus:outline-none",
  buttonPrimary: "bg-primary text-white hover:bg-primary/90",
  buttonSecondary: "bg-white border border-border text-text-primary hover:border-primary",
} as const;

export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
