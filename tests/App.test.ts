import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';

// Mock the child components
vi.mock('../src/components/SortingPlayground.vue', () => ({
  default: {
    name: 'SortingPlayground',
    template: '<div data-testid="sorting-playground">Sorting Playground</div>',
  },
}));

vi.mock('../src/components/PathfindingPlayground.vue', () => ({
  default: {
    name: 'PathfindingPlayground',
    template: '<div data-testid="pathfinding-playground">Pathfinding Playground</div>',
  },
}));

vi.mock('../src/components/ThemeToggle.vue', () => ({
  default: {
    name: 'ThemeToggle',
    template: '<button data-testid="theme-toggle">Theme Toggle</button>',
  },
}));

describe('App', () => {
  describe('Rendering', () => {
    it('should render the header', () => {
      const wrapper = mount(App);
      expect(wrapper.find('header').exists()).toBe(true);
      expect(wrapper.text()).toContain('Algorithm Visualizer Playground');
    });

    it('should render the ThemeToggle component', () => {
      const wrapper = mount(App);
      expect(wrapper.find('[data-testid="theme-toggle"]').exists()).toBe(true);
    });

    it('should render navigation tabs', () => {
      const wrapper = mount(App);
      expect(wrapper.find('nav').exists()).toBe(true);
      const buttons = wrapper.findAll('nav button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0].text()).toBe('Sorting Algorithms');
      expect(buttons[1].text()).toBe('Pathfinding Algorithms');
    });

    it('should have correct CSS classes for layout', () => {
      const wrapper = mount(App);
      const root = wrapper.find('div');
      expect(root.classes()).toContain('min-h-screen');
      expect(root.classes()).toContain('bg-gray-50');
    });
  });

  describe('Tab Navigation', () => {
    it('should start with sorting tab active', () => {
      const wrapper = mount(App);
      expect(wrapper.find('[data-testid="sorting-playground"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="pathfinding-playground"]').exists()).toBe(false);
    });

    it('should show active state on sorting tab initially', () => {
      const wrapper = mount(App);
      const buttons = wrapper.findAll('nav button');
      expect(buttons[0].classes()).toContain('border-blue-500');
      expect(buttons[0].classes()).toContain('text-blue-600');
      expect(buttons[1].classes()).toContain('border-transparent');
    });

    it('should switch to pathfinding tab when clicked', async () => {
      const wrapper = mount(App);
      const buttons = wrapper.findAll('nav button');
      
      await buttons[1].trigger('click');
      
      expect(wrapper.find('[data-testid="pathfinding-playground"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="sorting-playground"]').exists()).toBe(false);
    });

    it('should show active state on pathfinding tab after switch', async () => {
      const wrapper = mount(App);
      const buttons = wrapper.findAll('nav button');
      
      await buttons[1].trigger('click');
      
      expect(buttons[1].classes()).toContain('border-blue-500');
      expect(buttons[1].classes()).toContain('text-blue-600');
      expect(buttons[0].classes()).toContain('border-transparent');
    });

    it('should switch back to sorting tab when clicked', async () => {
      const wrapper = mount(App);
      const buttons = wrapper.findAll('nav button');
      
      await buttons[1].trigger('click');
      await buttons[0].trigger('click');
      
      expect(wrapper.find('[data-testid="sorting-playground"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="pathfinding-playground"]').exists()).toBe(false);
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes in template', () => {
      const wrapper = mount(App);
      const html = wrapper.html();
      expect(html).toContain('dark:bg-gray-900');
      expect(html).toContain('dark:bg-gray-800');
      expect(html).toContain('dark:from-blue-700');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive padding classes', () => {
      const wrapper = mount(App);
      const html = wrapper.html();
      expect(html).toContain('sm:px-6');
      expect(html).toContain('lg:px-8');
    });

    it('should have responsive spacing for navigation', () => {
      const wrapper = mount(App);
      const nav = wrapper.find('nav');
      expect(nav.html()).toContain('space-x-8');
    });
  });

  describe('Component Integration', () => {
    it('should only render one playground at a time', async () => {
      const wrapper = mount(App);
      
      // Initially sorting
      expect(wrapper.findAll('[data-testid="sorting-playground"]')).toHaveLength(1);
      expect(wrapper.findAll('[data-testid="pathfinding-playground"]')).toHaveLength(0);
      
      // Switch to pathfinding
      const buttons = wrapper.findAll('nav button');
      await buttons[1].trigger('click');
      
      expect(wrapper.findAll('[data-testid="sorting-playground"]')).toHaveLength(0);
      expect(wrapper.findAll('[data-testid="pathfinding-playground"]')).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid tab switching', async () => {
      const wrapper = mount(App);
      const buttons = wrapper.findAll('nav button');
      
      await buttons[1].trigger('click');
      await buttons[0].trigger('click');
      await buttons[1].trigger('click');
      await buttons[0].trigger('click');
      
      expect(wrapper.find('[data-testid="sorting-playground"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="pathfinding-playground"]').exists()).toBe(false);
    });

    it('should maintain state when switching tabs', async () => {
      const wrapper = mount(App);
      const buttons = wrapper.findAll('nav button');
      
      // Switch to pathfinding and back
      await buttons[1].trigger('click');
      await buttons[0].trigger('click');
      
      // Should still be on sorting tab
      expect(wrapper.find('[data-testid="sorting-playground"]').exists()).toBe(true);
    });
  });
});
