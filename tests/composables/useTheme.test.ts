import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTheme, _resetThemeForTesting } from '@/composables/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    // Reset theme state for each test
    _resetThemeForTesting();
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Clear all theme classes from document root
    document.documentElement.classList.remove('light', 'dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with light theme by default', () => {
      const { isDark } = useTheme();
      
      expect(isDark.value).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should load theme from localStorage if available', () => {
      localStorage.setItem('algorithm-playbook-theme', 'dark');
      
      const { isDark } = useTheme();
      
      expect(isDark.value).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should ignore invalid theme in localStorage', () => {
      localStorage.setItem('algorithm-playbook-theme', 'invalid-theme');
      
      const { isDark } = useTheme();
      
      expect(isDark.value).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const { isDark, toggleTheme } = useTheme();
      
      expect(isDark.value).toBe(false);
      toggleTheme();
      
      expect(isDark.value).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      localStorage.setItem('algorithm-playbook-theme', 'dark');
      const { isDark, toggleTheme } = useTheme();
      
      expect(isDark.value).toBe(true);
      toggleTheme();
      
      expect(isDark.value).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe('light');
    });

    it('should persist theme changes to localStorage', () => {
      const { toggleTheme } = useTheme();
      
      toggleTheme();
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe('dark');
      
      toggleTheme();
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe('light');
    });

    it('should remove old theme class when toggling', () => {
      const { toggleTheme } = useTheme();
      
      toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      
      toggleTheme();
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Reactivity', () => {
    it('should update document classes when theme changes', () => {
      const { isDark, toggleTheme } = useTheme();
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
      
      toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(isDark.value).toBe(true);
    });

    it('should maintain reactivity across multiple theme changes', () => {
      const { toggleTheme } = useTheme();
      
      toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      toggleTheme();
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      
      toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  describe('Multiple instances', () => {
    it('should share state between multiple useTheme instances', () => {
      const theme1 = useTheme();
      const theme2 = useTheme();
      
      theme1.toggleTheme();
      
      expect(theme1.isDark.value).toBe(true);
      expect(theme2.isDark.value).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should sync theme changes across instances', () => {
      const theme1 = useTheme();
      const theme2 = useTheme();
      
      theme1.toggleTheme();
      expect(theme2.isDark.value).toBe(true);
      
      theme2.toggleTheme();
      expect(theme1.isDark.value).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid theme changes', () => {
      const { toggleTheme } = useTheme();
      
      toggleTheme();
      toggleTheme();
      toggleTheme();
      toggleTheme();
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe('light');
    });

    it('should handle toggling multiple times to same state', () => {
      const { isDark, toggleTheme } = useTheme();
      
      toggleTheme();
      toggleTheme();
      
      expect(isDark.value).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe('light');
    });
  });
});
