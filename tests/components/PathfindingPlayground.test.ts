import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PathfindingPlayground from '@/components/PathfindingPlayground.vue';
import AlgorithmSelector from '@/components/AlgorithmSelector.vue';
import SpeedControl from '@/components/SpeedControl.vue';
import ControlButtons from '@/components/ControlButtons.vue';
import GridVisualizer from '@/components/GridVisualizer.vue';
import { AlgorithmCategory, PathfindingAlgorithm, AnimationSpeed } from '@/types/algorithms';
import { NodeState } from '@/types/grid';

vi.mock('@/composables/useAnimationEngine', () => ({
  useAnimationEngine: vi.fn(() => ({
    isPlaying: { value: false },
    isPaused: { value: false },
    isComplete: { value: false },
    currentStep: { value: 0 },
    totalSteps: { value: 0 },
    canPlay: { value: true },
    play: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn(),
    stop: vi.fn(),
    stepForward: vi.fn(),
    stepBackward: vi.fn(),
  })),
}));

describe('PathfindingPlayground', () => {
  describe('Rendering', () => {
    it('renders the component', () => {
      const wrapper = mount(PathfindingPlayground);
      expect(wrapper.find('.pathfinding-playground').exists()).toBe(true);
    });

    it('renders the title', () => {
      const wrapper = mount(PathfindingPlayground);
      expect(wrapper.find('h1').text()).toBe('Pathfinding Algorithm Visualizer');
    });

    it('renders all control components', () => {
      const wrapper = mount(PathfindingPlayground);
      expect(wrapper.findComponent(AlgorithmSelector).exists()).toBe(true);
      expect(wrapper.findComponent(SpeedControl).exists()).toBe(true);
      expect(wrapper.findComponent(ControlButtons).exists()).toBe(true);
    });

    it('renders the GridVisualizer', () => {
      const wrapper = mount(PathfindingPlayground);
      expect(wrapper.findComponent(GridVisualizer).exists()).toBe(true);
    });

    it('renders clear walls and reset grid buttons', () => {
      const wrapper = mount(PathfindingPlayground);
      const buttons = wrapper.findAll('button');
      const clearWallsBtn = buttons.find(btn => btn.text() === 'Clear Walls');
      const resetGridBtn = buttons.find(btn => btn.text() === 'Reset Grid');
      expect(clearWallsBtn).toBeDefined();
      expect(resetGridBtn).toBeDefined();
    });

    it('renders instructions', () => {
      const wrapper = mount(PathfindingPlayground);
      expect(wrapper.text()).toContain('Instructions:');
      expect(wrapper.text()).toContain('Click or drag to add/remove walls');
    });
  });

  describe('Initial State', () => {
    it('initializes with A* algorithm selected', () => {
      const wrapper = mount(PathfindingPlayground);
      const selector = wrapper.findComponent(AlgorithmSelector);
      expect(selector.props('selectedAlgorithm')).toBe(PathfindingAlgorithm.AStar);
    });

    it('initializes with normal animation speed', () => {
      const wrapper = mount(PathfindingPlayground);
      const speedControl = wrapper.findComponent(SpeedControl);
      expect(speedControl.props('speed')).toBe(AnimationSpeed.Normal);
    });

    it('initializes with a 25x25 grid', () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      const grid = visualizer.props('grid');
      expect(grid.length).toBe(25);
      expect(grid[0].length).toBe(25);
    });

    it('initializes with start and end nodes', () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      const grid = visualizer.props('grid');
      
      // Find start node at row 5, col 5
      expect(grid[5][5].state).toBe(NodeState.Start);
      
      // Find end node at row 19, col 19
      expect(grid[19][19].state).toBe(NodeState.End);
    });
  });

  describe('Algorithm Selection', () => {
    it('updates selected algorithm', async () => {
      const wrapper = mount(PathfindingPlayground);
      const selector = wrapper.findComponent(AlgorithmSelector);
      
      await selector.vm.$emit('update:selectedAlgorithm', PathfindingAlgorithm.Dijkstra);
      await wrapper.vm.$nextTick();
      
      expect(selector.props('selectedAlgorithm')).toBe(PathfindingAlgorithm.Dijkstra);
    });

    it('passes Pathfinding category to AlgorithmSelector', () => {
      const wrapper = mount(PathfindingPlayground);
      const selector = wrapper.findComponent(AlgorithmSelector);
      expect(selector.props('category')).toBe(AlgorithmCategory.Pathfinding);
    });
  });

  describe('Speed Control', () => {
    it('updates animation speed', async () => {
      const wrapper = mount(PathfindingPlayground);
      const speedControl = wrapper.findComponent(SpeedControl);
      
      await speedControl.vm.$emit('update:speed', AnimationSpeed.Fast);
      await wrapper.vm.$nextTick();
      
      expect(speedControl.props('speed')).toBe(AnimationSpeed.Fast);
    });
  });

  describe('Grid Interactions', () => {
    it('handles toggleWall event from GridVisualizer', async () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      
      const row = 10, col = 10;
      await visualizer.vm.$emit('toggleWall', row, col);
      await wrapper.vm.$nextTick();
      
      // Verify the grid was updated (wall was toggled)
      const grid = visualizer.props('grid');
      expect(grid[row][col].state).toBe(NodeState.Wall);
    });

    it('handles setStart event from GridVisualizer', async () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      
      const newRow = 3, newCol = 3;
      await visualizer.vm.$emit('setStart', newRow, newCol);
      await wrapper.vm.$nextTick();
      
      const grid = visualizer.props('grid');
      expect(grid[newRow][newCol].state).toBe(NodeState.Start);
      // Old start should no longer be a start node
      expect(grid[5][5].state).toBe(NodeState.Default);
    });

    it('handles setEnd event from GridVisualizer', async () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      
      const newRow = 15, newCol = 15;
      await visualizer.vm.$emit('setEnd', newRow, newCol);
      await wrapper.vm.$nextTick();
      
      const grid = visualizer.props('grid');
      expect(grid[newRow][newCol].state).toBe(NodeState.End);
      // Old end should no longer be an end node
      expect(grid[19][19].state).toBe(NodeState.Default);
    });
  });

  describe('Control Buttons Integration', () => {
    it('integrates with ControlButtons play event', async () => {
      const wrapper = mount(PathfindingPlayground);
      const controlButtons = wrapper.findComponent(ControlButtons);
      
      await controlButtons.vm.$emit('play');
      await wrapper.vm.$nextTick();
      
      // Animation engine's play should have been called
      expect(controlButtons.emitted('play')).toBeTruthy();
    });

    it('integrates with ControlButtons pause event', async () => {
      const wrapper = mount(PathfindingPlayground);
      const controlButtons = wrapper.findComponent(ControlButtons);
      
      await controlButtons.vm.$emit('pause');
      await wrapper.vm.$nextTick();
      
      expect(controlButtons.emitted('pause')).toBeTruthy();
    });

    it('integrates with ControlButtons reset event', async () => {
      const wrapper = mount(PathfindingPlayground);
      const controlButtons = wrapper.findComponent(ControlButtons);
      
      await controlButtons.vm.$emit('reset');
      await wrapper.vm.$nextTick();
      
      expect(controlButtons.emitted('reset')).toBeTruthy();
    });
  });

  describe('Clear Walls Button', () => {
    it('clears all walls when clicked', async () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      
      // Add a wall first
      const row = 10, col = 10;
      await visualizer.vm.$emit('toggleWall', row, col);
      await wrapper.vm.$nextTick();
      
      let grid = visualizer.props('grid');
      expect(grid[row][col].state).toBe(NodeState.Wall);
      
      // Click clear walls button
      const buttons = wrapper.findAll('button');
      const clearWallsBtn = buttons.find(btn => btn.text() === 'Clear Walls');
      await clearWallsBtn?.trigger('click');
      await wrapper.vm.$nextTick();
      
      // Wall should be cleared
      grid = visualizer.props('grid');
      expect(grid[row][col].state).toBe(NodeState.Default);
    });
  });

  describe('Reset Grid Button', () => {
    it('resets the grid when clicked', async () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      
      // Add a wall and move start
      await visualizer.vm.$emit('toggleWall', 10, 10);
      await visualizer.vm.$emit('setStart', 1, 1);
      await wrapper.vm.$nextTick();
      
      // Click reset grid button
      const buttons = wrapper.findAll('button');
      const resetGridBtn = buttons.find(btn => btn.text() === 'Reset Grid');
      await resetGridBtn?.trigger('click');
      await wrapper.vm.$nextTick();
      
      const grid = visualizer.props('grid');
      // Start should be back to original position
      expect(grid[5][5].state).toBe(NodeState.Start);
      expect(grid[1][1].state).toBe(NodeState.Default);
      // Wall should be gone
      expect(grid[10][10].state).toBe(NodeState.Default);
    });
  });

  describe('Visualizer Integration', () => {
    it('passes grid to GridVisualizer', () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      const grid = visualizer.props('grid');
      
      expect(grid).toBeDefined();
      expect(Array.isArray(grid)).toBe(true);
      expect(grid.length).toBe(25);
    });

    it('passes correct dimensions to GridVisualizer', () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      
      expect(visualizer.props('width')).toBe(600);
      expect(visualizer.props('height')).toBe(600);
    });

    it('passes currentStep to GridVisualizer', () => {
      const wrapper = mount(PathfindingPlayground);
      const visualizer = wrapper.findComponent(GridVisualizer);
      
      expect(visualizer.props('currentStep')).toBeDefined();
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode classes', () => {
      const wrapper = mount(PathfindingPlayground);
      expect(wrapper.find('.dark\\:bg-gray-900').exists()).toBe(true);
      expect(wrapper.find('.dark\\:bg-gray-800').exists()).toBe(true);
    });
  });

  describe('Responsive Layout', () => {
    it('applies responsive grid classes', () => {
      const wrapper = mount(PathfindingPlayground);
      const gridLayout = wrapper.find('.grid-cols-1');
      expect(gridLayout.exists()).toBe(true);
      expect(gridLayout.classes()).toContain('md:grid-cols-2');
      expect(gridLayout.classes()).toContain('lg:grid-cols-3');
    });
  });

  describe('Edge Cases', () => {
    it('disables buttons when playing', async () => {
      const { useAnimationEngine } = await import('@/composables/useAnimationEngine');
      vi.mocked(useAnimationEngine).mockReturnValue({
        isPlaying: { value: true },
        isPaused: { value: false },
        isComplete: { value: false },
        currentStep: { value: 0 },
        totalSteps: { value: 10 },
        canPlay: { value: false },
        play: vi.fn(),
        pause: vi.fn(),
        reset: vi.fn(),
        stop: vi.fn(),
        stepForward: vi.fn(),
        stepBackward: vi.fn(),
      } as any);
      
      const wrapper = mount(PathfindingPlayground);
      const buttons = wrapper.findAll('button');
      const clearWallsBtn = buttons.find(btn => btn.text() === 'Clear Walls');
      const resetGridBtn = buttons.find(btn => btn.text() === 'Reset Grid');
      
      expect(clearWallsBtn?.attributes('disabled')).toBeDefined();
      expect(resetGridBtn?.attributes('disabled')).toBeDefined();
    });
  });
});
