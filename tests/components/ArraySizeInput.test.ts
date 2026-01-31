import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArraySizeInput from '@/components/ArraySizeInput.vue';

describe('ArraySizeInput', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      expect(wrapper.find('label').text()).toContain('Array Size: 50');
      expect(wrapper.find('input[type="range"]').exists()).toBe(true);
    });

    it('should display current size in label', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 75 },
      });
      expect(wrapper.find('label').text()).toBe('Array Size: 75');
    });

    it('should display min and max values', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50, min: 10, max: 200 },
      });
      const spans = wrapper.findAll('span');
      expect(spans[0].text()).toBe('10');
      expect(spans[1].text()).toBe('200');
    });

    it('should use default min and max when not provided', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const input = wrapper.find('input[type="range"]');
      expect(input.attributes('min')).toBe('5');
      expect(input.attributes('max')).toBe('100');
    });

    it('should set input value to size prop', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 42 },
      });
      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe('42');
    });
  });

  describe('value changes', () => {
    it('should emit update:size event when input changes', async () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const input = wrapper.find('input[type="range"]');
      await input.setValue(75);
      expect(wrapper.emitted('update:size')).toBeTruthy();
      expect(wrapper.emitted('update:size')?.[0]).toEqual([75]);
    });

    it('should emit correct value within range', async () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50, min: 10, max: 100 },
      });
      const input = wrapper.find('input[type="range"]');
      await input.setValue(25);
      expect(wrapper.emitted('update:size')?.[0]).toEqual([25]);
    });

    it('should handle minimum value', async () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50, min: 5, max: 100 },
      });
      const input = wrapper.find('input[type="range"]');
      await input.setValue(5);
      expect(wrapper.emitted('update:size')?.[0]).toEqual([5]);
    });

    it('should handle maximum value', async () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50, min: 5, max: 100 },
      });
      const input = wrapper.find('input[type="range"]');
      await input.setValue(100);
      expect(wrapper.emitted('update:size')?.[0]).toEqual([100]);
    });

    it('should handle multiple value changes', async () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50, min: 10, max: 100 },
      });
      const input = wrapper.find('input[type="range"]');
      await input.setValue(30);
      await input.setValue(70);
      await input.setValue(90);
      expect(wrapper.emitted('update:size')?.length).toBe(3);
      expect(wrapper.emitted('update:size')?.[0]).toEqual([30]);
      expect(wrapper.emitted('update:size')?.[1]).toEqual([70]);
      expect(wrapper.emitted('update:size')?.[2]).toEqual([90]);
    });
  });

  describe('dark mode', () => {
    it('should have dark mode classes on label', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const label = wrapper.find('label');
      expect(label.classes()).toContain('dark:text-gray-300');
    });

    it('should have dark mode classes on input', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const input = wrapper.find('input[type="range"]');
      expect(input.classes()).toContain('dark:bg-gray-700');
    });

    it('should have dark mode classes on min/max spans', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const spans = wrapper.findAll('span');
      spans.forEach((span) => {
        expect(span.classes()).toContain('dark:text-gray-400');
      });
    });
  });

  describe('accessibility', () => {
    it('should have label associated with input', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const label = wrapper.find('label');
      const input = wrapper.find('input[type="range"]');
      expect(label.attributes('for')).toBe('array-size');
      expect(input.attributes('id')).toBe('array-size');
    });

    it('should have aria-label on input', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const input = wrapper.find('input[type="range"]');
      expect(input.attributes('aria-label')).toBe('Array size slider');
    });

    it('should have focus ring class', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 50 },
      });
      const input = wrapper.find('input[type="range"]');
      expect(input.classes()).toContain('focus:ring-2');
      expect(input.classes()).toContain('focus:ring-blue-500');
    });
  });

  describe('edge cases', () => {
    it('should handle custom min/max range', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 150, min: 50, max: 300 },
      });
      const input = wrapper.find('input[type="range"]');
      expect(input.attributes('min')).toBe('50');
      expect(input.attributes('max')).toBe('300');
      expect(input.element.value).toBe('150');
    });

    it('should handle size at minimum boundary', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 5, min: 5, max: 100 },
      });
      expect(wrapper.find('label').text()).toBe('Array Size: 5');
      expect(wrapper.find('input[type="range"]').element.value).toBe('5');
    });

    it('should handle size at maximum boundary', () => {
      const wrapper = mount(ArraySizeInput, {
        props: { size: 100, min: 5, max: 100 },
      });
      expect(wrapper.find('label').text()).toBe('Array Size: 100');
      expect(wrapper.find('input[type="range"]').element.value).toBe('100');
    });
  });
});
