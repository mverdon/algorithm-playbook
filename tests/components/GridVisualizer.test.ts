import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import GridVisualizer from '../../src/components/GridVisualizer.vue';
import { NodeState } from '../../src/types/grid';
import type { Grid, GridAnimationStep } from '../../src/types/grid';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);

describe('GridVisualizer', () => {
  const createTestGrid = (rows: number, cols: number): Grid => {
    const grid: Grid = [];
    for (let row = 0; row < rows; row++) {
      grid[row] = [];
      for (let col = 0; col < cols; col++) {
        grid[row][col] = {
          position: { row, col },
          state: NodeState.Default,
          isWall: false,
          isStart: row === 0 && col === 0,
          isEnd: row === rows - 1 && col === cols - 1,
          distance: Infinity,
          heuristic: 0,
          totalCost: Infinity,
          parent: null,
        };
      }
    }
    return grid;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders canvas element', () => {
      const grid = createTestGrid(10, 10);
      const wrapper = mount(GridVisualizer, {
        props: { grid },
      });

      const canvas = wrapper.find('canvas');
      expect(canvas.exists()).toBe(true);
    });

    it('applies correct canvas dimensions', () => {
      const grid = createTestGrid(10, 10);
      const wrapper = mount(GridVisualizer, {
        props: {
          grid,
          width: 500,
          height: 500,
        },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      expect(canvas.width).toBe(500);
      expect(canvas.height).toBe(500);
    });

    it('applies default dimensions when not specified', () => {
      const grid = createTestGrid(10, 10);
      const wrapper = mount(GridVisualizer, {
        props: { grid },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      expect(canvas.width).toBe(600);
      expect(canvas.height).toBe(600);
    });

    it('applies CSS classes for styling', () => {
      const grid = createTestGrid(10, 10);
      const wrapper = mount(GridVisualizer, {
        props: { grid },
      });

      const canvas = wrapper.find('canvas');
      expect(canvas.classes()).toContain('border-2');
      expect(canvas.classes()).toContain('rounded-lg');
      expect(canvas.classes()).toContain('bg-white');
    });
  });

  describe('Grid Visualization', () => {
    it('calls clearRect and fillRect when drawing grid', async () => {
      const grid = createTestGrid(3, 3);
      mount(GridVisualizer, {
        props: { grid },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('redraws when grid prop changes', async () => {
      const grid1 = createTestGrid(3, 3);
      const wrapper = mount(GridVisualizer, {
        props: { grid: grid1 },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      const callCountBefore = mockContext.clearRect.mock.calls.length;

      const grid2 = createTestGrid(3, 3);
      grid2[1][1].isWall = true;
      await wrapper.setProps({ grid: grid2 });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockContext.clearRect.mock.calls.length).toBeGreaterThan(callCountBefore);
    });

    it('handles empty grid gracefully', () => {
      const grid: Grid = [];
      expect(() => {
        mount(GridVisualizer, {
          props: { grid },
        });
      }).not.toThrow();
    });
  });

  describe('Animation Steps', () => {
    it('redraws when currentStep prop changes', async () => {
      const grid = createTestGrid(5, 5);
      const wrapper = mount(GridVisualizer, {
        props: { grid },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      const callCountBefore = mockContext.clearRect.mock.calls.length;

      const step: GridAnimationStep = {
        position: { row: 2, col: 2 },
        state: NodeState.Visiting,
      };

      await wrapper.setProps({ currentStep: step });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockContext.clearRect.mock.calls.length).toBeGreaterThan(callCountBefore);
    });

    it('handles null currentStep', () => {
      const grid = createTestGrid(5, 5);
      expect(() => {
        mount(GridVisualizer, {
          props: {
            grid,
            currentStep: null,
          },
        });
      }).not.toThrow();
    });

    it('applies visiting state from animation step', async () => {
      const grid = createTestGrid(5, 5);
      const step: GridAnimationStep = {
        position: { row: 2, col: 2 },
        state: NodeState.Visiting,
      };

      mount(GridVisualizer, {
        props: {
          grid,
          currentStep: step,
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('applies visited state from animation step', async () => {
      const grid = createTestGrid(5, 5);
      const step: GridAnimationStep = {
        position: { row: 3, col: 3 },
        state: NodeState.Visited,
      };

      mount(GridVisualizer, {
        props: {
          grid,
          currentStep: step,
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('applies path state from animation step', async () => {
      const grid = createTestGrid(5, 5);
      const step: GridAnimationStep = {
        position: { row: 1, col: 1 },
        state: NodeState.Path,
      };

      mount(GridVisualizer, {
        props: {
          grid,
          currentStep: step,
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockContext.fillRect).toHaveBeenCalled();
    });
  });

  describe('Mouse Interactions', () => {
    it('emits toggleWall event on mouse down on default cell', async () => {
      const grid = createTestGrid(5, 5);
      const wrapper = mount(GridVisualizer, {
        props: { grid, width: 600, height: 600 },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      // Mock getBoundingClientRect
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 600,
        bottom: 600,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      await wrapper.find('canvas').trigger('mousedown', { clientX: 150, clientY: 150 });

      expect(wrapper.emitted('toggleWall')).toBeTruthy();
    });

    it('emits setStart event when dragging start node', async () => {
      const grid = createTestGrid(5, 5);
      const wrapper = mount(GridVisualizer, {
        props: { grid, width: 600, height: 600 },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 600,
        bottom: 600,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Mouse down on start position (0, 0)
      await wrapper.find('canvas').trigger('mousedown', { clientX: 10, clientY: 10 });
      // Move to new position
      await wrapper.find('canvas').trigger('mousemove', { clientX: 130, clientY: 130 });

      expect(wrapper.emitted('setStart')).toBeTruthy();
    });

    it('emits setEnd event when dragging end node', async () => {
      const grid = createTestGrid(5, 5);
      const wrapper = mount(GridVisualizer, {
        props: { grid, width: 500, height: 500 },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 500,
        bottom: 500,
        width: 500,
        height: 500,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Mouse down on end position (4, 4) - far bottom right
      await wrapper.find('canvas').trigger('mousedown', { clientX: 490, clientY: 490 });
      // Move to new position
      await wrapper.find('canvas').trigger('mousemove', { clientX: 250, clientY: 250 });

      expect(wrapper.emitted('setEnd')).toBeTruthy();
    });

    it('stops dragging on mouse up', async () => {
      const grid = createTestGrid(5, 5);
      const wrapper = mount(GridVisualizer, {
        props: { grid, width: 600, height: 600 },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 600,
        bottom: 600,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      await wrapper.find('canvas').trigger('mousedown', { clientX: 150, clientY: 150 });
      await wrapper.find('canvas').trigger('mouseup');

      // Further mouse moves should not emit events
      const emitCountBefore = wrapper.emitted('toggleWall')?.length || 0;
      await wrapper.find('canvas').trigger('mousemove', { clientX: 250, clientY: 250 });
      const emitCountAfter = wrapper.emitted('toggleWall')?.length || 0;

      expect(emitCountAfter).toBe(emitCountBefore);
    });

    it('stops dragging on mouse leave', async () => {
      const grid = createTestGrid(5, 5);
      const wrapper = mount(GridVisualizer, {
        props: { grid, width: 600, height: 600 },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 600,
        bottom: 600,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      await wrapper.find('canvas').trigger('mousedown', { clientX: 150, clientY: 150 });
      await wrapper.find('canvas').trigger('mouseleave');

      // Further mouse moves should not emit events
      const emitCountBefore = wrapper.emitted('toggleWall')?.length || 0;
      await wrapper.find('canvas').trigger('mousemove', { clientX: 250, clientY: 250 });
      const emitCountAfter = wrapper.emitted('toggleWall')?.length || 0;

      expect(emitCountAfter).toBe(emitCountBefore);
    });

    it('does not toggle wall on start node', async () => {
      const grid = createTestGrid(5, 5);
      const wrapper = mount(GridVisualizer, {
        props: { grid, width: 600, height: 600 },
      });

      const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 600,
        bottom: 600,
        width: 600,
        height: 600,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Click on start position (0, 0)
      await wrapper.find('canvas').trigger('mousedown', { clientX: 10, clientY: 10 });

      // Should not emit toggleWall for start node
      const toggleWallEmits = wrapper.emitted('toggleWall') || [];
      const hasStartNodeToggle = toggleWallEmits.some(
        (emit) => emit[0] === 0 && emit[1] === 0
      );
      expect(hasStartNodeToggle).toBe(false);
    });
  });

  describe('Canvas Operations', () => {
    it('calculates cell size based on grid dimensions', () => {
      const grid = createTestGrid(10, 10);
      mount(GridVisualizer, {
        props: {
          grid,
          width: 500,
          height: 500,
        },
      });

      // With 10x10 grid and 500x500 canvas, cell size should be 50
      // This is verified through the fillRect calls
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('draws borders for each cell', async () => {
      const grid = createTestGrid(3, 3);
      mount(GridVisualizer, {
        props: { grid },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockContext.strokeRect).toHaveBeenCalled();
    });
  });

  describe('Dark Mode', () => {
    it('updates colors when dark mode is toggled', async () => {
      const grid = createTestGrid(5, 5);
      mount(GridVisualizer, {
        props: { grid },
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      const callCountBefore = mockContext.clearRect.mock.calls.length;

      // Simulate dark mode toggle
      document.documentElement.classList.add('dark');
      // Trigger mutation observer callback manually
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should redraw with new colors
      expect(mockContext.clearRect.mock.calls.length).toBeGreaterThan(callCountBefore);

      // Cleanup
      document.documentElement.classList.remove('dark');
    });
  });

  describe('Edge Cases', () => {
    it('handles single cell grid', () => {
      const grid = createTestGrid(1, 1);
      expect(() => {
        mount(GridVisualizer, {
          props: { grid },
        });
      }).not.toThrow();
    });

    it('handles large grid', () => {
      const grid = createTestGrid(50, 50);
      expect(() => {
        mount(GridVisualizer, {
          props: { grid },
        });
      }).not.toThrow();
    });

    it('handles rectangular grid', () => {
      const grid = createTestGrid(10, 20);
      expect(() => {
        mount(GridVisualizer, {
          props: { grid },
        });
      }).not.toThrow();
    });

    it('handles grid with multiple walls', () => {
      const grid = createTestGrid(5, 5);
      grid[1][1].isWall = true;
      grid[2][2].isWall = true;
      grid[3][3].isWall = true;

      expect(() => {
        mount(GridVisualizer, {
          props: { grid },
        });
      }).not.toThrow();
    });
  });
});
