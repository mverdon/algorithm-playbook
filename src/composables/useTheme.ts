import { ref, watch } from 'vue';

const THEME_STORAGE_KEY = 'algorithm-playbook-theme';

const isDark = ref<boolean>(false);
let isInitialized = false;

// Get system theme preference
const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply theme class to document
const applyTheme = (dark: boolean) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme !== null) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = getSystemTheme();
  }
  applyTheme(isDark.value);
  isInitialized = true;
};

// Watch for theme changes and persist
watch(isDark, (newValue) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, newValue ? 'dark' : 'light');
  }
  applyTheme(newValue);
}, { flush: 'sync' });

export function useTheme() {
  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  // Initialize on first use
  if (typeof window !== 'undefined' && !isInitialized) {
    initializeTheme();
  }

  return {
    isDark,
    toggleTheme,
  };
}

// For testing: reset initialization state
export function _resetThemeForTesting() {
  isInitialized = false;
  isDark.value = false;
}
