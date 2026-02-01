import { theme } from './src/config/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.light.colors.primary,
        secondary: theme.light.colors.secondary,
        accent: theme.light.colors.accent,
        surface: theme.light.colors.surface,
        'text-secondary': theme.light.colors.textSecondary,
        success: theme.light.colors.success,
        error: theme.light.colors.error,
        warning: theme.light.colors.warning,
        info: theme.light.colors.info,
      },
    },
  },
  plugins: [],
}
