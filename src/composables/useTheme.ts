import { ref, watch } from 'vue';
import { ThemeType } from '../types/config';

const THEME_STORAGE_KEY = 'algorithm-playbook-theme';

const currentTheme = ref<ThemeType>(ThemeType.Light);

export function useTheme() {
  // Initialize theme from localStorage or default to light
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && Object.values(ThemeType).includes(savedTheme as ThemeType)) {
      currentTheme.value = savedTheme as ThemeType;
    } else {
      currentTheme.value = ThemeType.Light;
    }
    applyTheme(currentTheme.value);
  };

  // Apply theme to document
  const applyTheme = (theme: ThemeType) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'colorful');
    
    // Add the current theme class
    root.classList.add(theme);
  };

  // Set theme and persist to localStorage
  const setTheme = (theme: ThemeType) => {
    currentTheme.value = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  };

  // Watch for theme changes
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme);
  });

  // Initialize on first use
  if (typeof window !== 'undefined' && !document.documentElement.classList.contains('light') && !document.documentElement.classList.contains('dark') && !document.documentElement.classList.contains('colorful')) {
    initializeTheme();
  }

  return {
    currentTheme,
    setTheme,
  };
}
