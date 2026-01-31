import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTheme } from '@/composables/useTheme';
import { ThemeType } from '@/types/config';

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Clear all theme classes from document root
    document.documentElement.classList.remove('light', 'dark', 'colorful');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with light theme by default', () => {
      const { currentTheme } = useTheme();
      
      expect(currentTheme.value).toBe(ThemeType.Light);
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should load theme from localStorage if available', () => {
      localStorage.setItem('algorithm-playbook-theme', ThemeType.Dark);
      
      const { currentTheme } = useTheme();
      
      expect(currentTheme.value).toBe(ThemeType.Dark);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should ignore invalid theme in localStorage', () => {
      localStorage.setItem('algorithm-playbook-theme', 'invalid-theme');
      
      const { currentTheme } = useTheme();
      
      expect(currentTheme.value).toBe(ThemeType.Light);
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should apply colorful theme from localStorage', () => {
      localStorage.setItem('algorithm-playbook-theme', ThemeType.Colorful);
      
      const { currentTheme } = useTheme();
      
      expect(currentTheme.value).toBe(ThemeType.Colorful);
      expect(document.documentElement.classList.contains('colorful')).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('should change theme to dark', () => {
      const { currentTheme, setTheme } = useTheme();
      
      setTheme(ThemeType.Dark);
      
      expect(currentTheme.value).toBe(ThemeType.Dark);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe(ThemeType.Dark);
    });

    it('should change theme to colorful', () => {
      const { currentTheme, setTheme } = useTheme();
      
      setTheme(ThemeType.Colorful);
      
      expect(currentTheme.value).toBe(ThemeType.Colorful);
      expect(document.documentElement.classList.contains('colorful')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe(ThemeType.Colorful);
    });

    it('should persist theme changes to localStorage', () => {
      const { setTheme } = useTheme();
      
      setTheme(ThemeType.Dark);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe(ThemeType.Dark);
      
      setTheme(ThemeType.Colorful);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe(ThemeType.Colorful);
      
      setTheme(ThemeType.Light);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe(ThemeType.Light);
    });

    it('should remove old theme class when changing themes', () => {
      const { setTheme } = useTheme();
      
      setTheme(ThemeType.Dark);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      
      setTheme(ThemeType.Light);
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Reactivity', () => {
    it('should update document classes when theme changes', () => {
      const { currentTheme, setTheme } = useTheme();
      
      expect(document.documentElement.classList.contains('light')).toBe(true);
      
      setTheme(ThemeType.Dark);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(currentTheme.value).toBe(ThemeType.Dark);
    });

    it('should maintain reactivity across multiple theme changes', () => {
      const { setTheme } = useTheme();
      
      setTheme(ThemeType.Dark);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      
      setTheme(ThemeType.Colorful);
      expect(document.documentElement.classList.contains('colorful')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      
      setTheme(ThemeType.Light);
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('colorful')).toBe(false);
    });
  });

  describe('Multiple instances', () => {
    it('should share state between multiple useTheme instances', () => {
      const theme1 = useTheme();
      const theme2 = useTheme();
      
      theme1.setTheme(ThemeType.Dark);
      
      expect(theme1.currentTheme.value).toBe(ThemeType.Dark);
      expect(theme2.currentTheme.value).toBe(ThemeType.Dark);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should sync theme changes across instances', () => {
      const theme1 = useTheme();
      const theme2 = useTheme();
      
      theme1.setTheme(ThemeType.Colorful);
      expect(theme2.currentTheme.value).toBe(ThemeType.Colorful);
      
      theme2.setTheme(ThemeType.Light);
      expect(theme1.currentTheme.value).toBe(ThemeType.Light);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid theme changes', () => {
      const { setTheme } = useTheme();
      
      setTheme(ThemeType.Dark);
      setTheme(ThemeType.Light);
      setTheme(ThemeType.Colorful);
      setTheme(ThemeType.Dark);
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('colorful')).toBe(false);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe(ThemeType.Dark);
    });

    it('should handle setting the same theme multiple times', () => {
      const { setTheme } = useTheme();
      
      setTheme(ThemeType.Dark);
      setTheme(ThemeType.Dark);
      setTheme(ThemeType.Dark);
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('algorithm-playbook-theme')).toBe(ThemeType.Dark);
    });
  });
});
