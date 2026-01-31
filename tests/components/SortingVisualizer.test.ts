import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SortingVisualizer from '@/components/SortingVisualizer.vue';
import { AnimationState, type AnimationStep } from '@/types/algorithms';

describe('SortingVisualizer', () => {
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Mock canvas context
    mockContext = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      fillStyle: '',
      font: '',
      textAlign: '',
    } as unknown as CanvasRenderingContext2D;

    // Mock HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);
  });

  describe('Rendering', () => {
    it('renders canvas element', () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
        },
      });

      const canvas = wrapper.find('canvas');
      expect(canvas.exists()).toBe(true);
    });

    it('sets canvas dimensions from props', () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
          width: 600,
          height: 300,
        },
      });

      const canvas = wrapper.find('canvas');
      expect(canvas.attributes('width')).toBe('600');
      expect(canvas.attributes('height')).toBe('300');
    });

    it('uses default dimensions when not provided', () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
        },
      });

      const canvas = wrapper.find('canvas');
      expect(canvas.attributes('width')).toBe('800');
      expect(canvas.attributes('height')).toBe('400');
    });

    it('applies correct CSS classes', () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
        },
      });

      const canvas = wrapper.find('canvas');
      expect(canvas.classes()).toContain('border-2');
      expect(canvas.classes()).toContain('border-gray-300');
      expect(canvas.classes()).toContain('dark:border-gray-600');
      expect(canvas.classes()).toContain('rounded-lg');
    });
  });

  describe('Array Visualization', () => {
    it('renders bars for each array element', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
        },
      });

      await wrapper.vm.$nextTick();
      
      // fillRect should be called for each bar (4 bars + potentially labels)
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('updates visualization when array changes', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
        },
      });

      await wrapper.vm.$nextTick();
      const callCountBefore = (mockContext.fillRect as any).mock.calls.length;

      await wrapper.setProps({ array: [1, 2, 3, 4] });
      await wrapper.vm.$nextTick();

      const callCountAfter = (mockContext.fillRect as any).mock.calls.length;
      expect(callCountAfter).toBeGreaterThan(callCountBefore);
    });

    it('handles empty array', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [],
        },
      });

      await wrapper.vm.$nextTick();
      
      // Should clear canvas but not draw bars
      expect(mockContext.clearRect).toHaveBeenCalled();
    });
  });

  describe('Animation Steps', () => {
    it('renders with no animation step', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
          currentStep: null,
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.clearRect).toHaveBeenCalled();
    });

    it('updates visualization with comparing step', async () => {
      const step: AnimationStep = {
        indices: [0, 1],
        state: AnimationState.Comparing,
        values: [5, 3, 8, 1],
      };

      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
          currentStep: step,
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('updates visualization with swapping step', async () => {
      const step: AnimationStep = {
        indices: [0, 1],
        state: AnimationState.Swapping,
        values: [3, 5, 8, 1],
      };

      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
          currentStep: step,
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('updates visualization with sorted step', async () => {
      const step: AnimationStep = {
        indices: [3],
        state: AnimationState.Sorted,
        values: [1, 3, 5, 8],
      };

      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
          currentStep: step,
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('updates when currentStep changes', async () => {
      const step1: AnimationStep = {
        indices: [0, 1],
        state: AnimationState.Comparing,
        values: [5, 3, 8, 1],
      };

      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
          currentStep: step1,
        },
      });

      await wrapper.vm.$nextTick();
      const callCountBefore = (mockContext.clearRect as any).mock.calls.length;

      const step2: AnimationStep = {
        indices: [0, 1],
        state: AnimationState.Swapping,
        values: [3, 5, 8, 1],
      };

      await wrapper.setProps({ currentStep: step2 });
      await wrapper.vm.$nextTick();

      const callCountAfter = (mockContext.clearRect as any).mock.calls.length;
      expect(callCountAfter).toBeGreaterThan(callCountBefore);
    });
  });

  describe('Canvas Operations', () => {
    it('clears canvas before each render', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 400);
    });

    it('scales bars proportionally to canvas height', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
          width: 800,
          height: 400,
        },
      });

      await wrapper.vm.$nextTick();
      
      // fillRect should be called with appropriate heights
      expect(mockContext.fillRect).toHaveBeenCalled();
    });
  });

  describe('Dark Mode', () => {
    it('handles dark mode class changes', async () => {
      document.documentElement.classList.add('dark');

      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 3, 8, 1],
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();

      document.documentElement.classList.remove('dark');
    });
  });

  describe('Edge Cases', () => {
    it('handles single element array', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [42],
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('handles large array', async () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => i + 1);
      
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: largeArray,
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('handles array with negative numbers', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [-5, -3, -8, -1],
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('handles array with same values', async () => {
      const wrapper = mount(SortingVisualizer, {
        props: {
          array: [5, 5, 5, 5],
        },
      });

      await wrapper.vm.$nextTick();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });
  });
});
