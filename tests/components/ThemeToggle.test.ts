import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ThemeToggle from '@/components/ThemeToggle.vue';

describe('ThemeToggle', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return localStorageMock[key] || null;
    });
    
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove('dark');
  });

  describe('Rendering', () => {
    it('renders the button', () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
    });

    it('displays moon icon in light mode', () => {
      const wrapper = mount(ThemeToggle);
      expect(wrapper.html()).toContain('🌙');
    });

    it('displays sun icon in dark mode', async () => {
      localStorageMock['theme'] = 'dark';
      const wrapper = mount(ThemeToggle);
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('☀️');
    });
  });

  describe('Theme Toggling', () => {
    it('toggles theme when clicked', async () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      
      expect(wrapper.html()).toContain('🌙');
      
      await button.trigger('click');
      await wrapper.vm.$nextTick();
      
      expect(wrapper.html()).toContain('☀️');
    });

    it('adds dark class to document when switching to dark mode', async () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      
      await button.trigger('click');
      await wrapper.vm.$nextTick();
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from document when switching to light mode', async () => {
      localStorageMock['theme'] = 'dark';
      const wrapper = mount(ThemeToggle);
      await wrapper.vm.$nextTick();
      
      const button = wrapper.find('button');
      await button.trigger('click');
      await wrapper.vm.$nextTick();
      
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Local Storage', () => {
    it('saves theme to localStorage when toggling to dark', async () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      
      await button.trigger('click');
      await wrapper.vm.$nextTick();
      
      expect(localStorageMock['theme']).toBe('dark');
    });

    it('saves theme to localStorage when toggling to light', async () => {
      localStorageMock['theme'] = 'dark';
      const wrapper = mount(ThemeToggle);
      await wrapper.vm.$nextTick();
      
      const button = wrapper.find('button');
      await button.trigger('click');
      await wrapper.vm.$nextTick();
      
      expect(localStorageMock['theme']).toBe('light');
    });

    it('loads saved theme from localStorage on mount', async () => {
      localStorageMock['theme'] = 'dark';
      const wrapper = mount(ThemeToggle);
      await wrapper.vm.$nextTick();
      
      expect(wrapper.html()).toContain('☀️');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('System Preference', () => {
    it('defaults to system preference when no saved theme', async () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
      
      const wrapper = mount(ThemeToggle);
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(wrapper.html()).toContain('☀️');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has aria-label for light mode', () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      expect(button.attributes('aria-label')).toBe('Switch to dark mode');
    });

    it('has aria-label for dark mode', async () => {
      localStorageMock['theme'] = 'dark';
      const wrapper = mount(ThemeToggle);
      await wrapper.vm.$nextTick();
      
      const button = wrapper.find('button');
      expect(button.attributes('aria-label')).toBe('Switch to light mode');
    });

    it('updates aria-label when toggling', async () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      
      expect(button.attributes('aria-label')).toBe('Switch to dark mode');
      
      await button.trigger('click');
      await wrapper.vm.$nextTick();
      
      expect(button.attributes('aria-label')).toBe('Switch to light mode');
    });
  });

  describe('Dark Mode Styling', () => {
    it('has dark mode classes', () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      expect(button.classes()).toContain('dark:bg-gray-700');
      expect(button.classes()).toContain('dark:text-gray-100');
      expect(button.classes()).toContain('dark:hover:bg-gray-600');
    });

    it('has focus ring styling', () => {
      const wrapper = mount(ThemeToggle);
      const button = wrapper.find('button');
      expect(button.classes()).toContain('focus:ring-2');
      expect(button.classes()).toContain('focus:ring-blue-500');
    });
  });
});
