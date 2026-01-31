import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AlgorithmSelector from '@/components/AlgorithmSelector.vue';
import { SortingAlgorithm, PathfindingAlgorithm, AlgorithmCategory } from '@/types/algorithms';

describe('AlgorithmSelector', () => {
  describe('Sorting Algorithms', () => {
    it('renders with sorting category', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Bubble,
        },
      });

      expect(wrapper.find('select').exists()).toBe(true);
      expect(wrapper.find('label').text()).toBe('Select Algorithm');
    });

    it('displays all sorting algorithms', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Bubble,
        },
      });

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(4);
      expect(options[0].text()).toBe('Bubble Sort');
      expect(options[1].text()).toBe('Quick Sort');
      expect(options[2].text()).toBe('Merge Sort');
      expect(options[3].text()).toBe('Heap Sort');
    });

    it('sets the correct selected value for sorting', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Quick,
        },
      });

      const select = wrapper.find('select');
      expect((select.element as HTMLSelectElement).value).toBe(SortingAlgorithm.Quick);
    });

    it('emits update:selectedAlgorithm when sorting algorithm changes', async () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Bubble,
        },
      });

      const select = wrapper.find('select');
      await select.setValue(SortingAlgorithm.Merge);

      expect(wrapper.emitted('update:selectedAlgorithm')).toBeTruthy();
      expect(wrapper.emitted('update:selectedAlgorithm')![0]).toEqual([SortingAlgorithm.Merge]);
    });
  });

  describe('Pathfinding Algorithms', () => {
    it('renders with pathfinding category', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Pathfinding,
          selectedAlgorithm: PathfindingAlgorithm.AStar,
        },
      });

      expect(wrapper.find('select').exists()).toBe(true);
      expect(wrapper.find('label').text()).toBe('Select Algorithm');
    });

    it('displays all pathfinding algorithms', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Pathfinding,
          selectedAlgorithm: PathfindingAlgorithm.AStar,
        },
      });

      const options = wrapper.findAll('option');
      expect(options).toHaveLength(4);
      expect(options[0].text()).toBe('A* Search');
      expect(options[1].text()).toBe('Dijkstra');
      expect(options[2].text()).toBe('Breadth-First Search');
      expect(options[3].text()).toBe('Depth-First Search');
    });

    it('sets the correct selected value for pathfinding', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Pathfinding,
          selectedAlgorithm: PathfindingAlgorithm.Dijkstra,
        },
      });

      const select = wrapper.find('select');
      expect((select.element as HTMLSelectElement).value).toBe(PathfindingAlgorithm.Dijkstra);
    });

    it('emits update:selectedAlgorithm when pathfinding algorithm changes', async () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Pathfinding,
          selectedAlgorithm: PathfindingAlgorithm.AStar,
        },
      });

      const select = wrapper.find('select');
      await select.setValue(PathfindingAlgorithm.BFS);

      expect(wrapper.emitted('update:selectedAlgorithm')).toBeTruthy();
      expect(wrapper.emitted('update:selectedAlgorithm')![0]).toEqual([PathfindingAlgorithm.BFS]);
    });
  });

  describe('Category Switching', () => {
    it('updates options when category changes from Sorting to Pathfinding', async () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Bubble,
        },
      });

      let options = wrapper.findAll('option');
      expect(options).toHaveLength(4);
      expect(options[0].text()).toBe('Bubble Sort');

      await wrapper.setProps({
        category: AlgorithmCategory.Pathfinding,
        selectedAlgorithm: PathfindingAlgorithm.AStar,
      });

      options = wrapper.findAll('option');
      expect(options).toHaveLength(4);
      expect(options[0].text()).toBe('A* Search');
    });
  });

  describe('Styling', () => {
    it('has correct CSS classes for dark mode support', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Bubble,
        },
      });

      const select = wrapper.find('select');
      expect(select.classes()).toContain('dark:bg-gray-800');
      expect(select.classes()).toContain('dark:text-gray-100');
    });

    it('has focus ring styling', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Bubble,
        },
      });

      const select = wrapper.find('select');
      expect(select.classes()).toContain('focus:ring-2');
      expect(select.classes()).toContain('focus:ring-blue-500');
    });
  });

  describe('Accessibility', () => {
    it('has proper label association', () => {
      const wrapper = mount(AlgorithmSelector, {
        props: {
          category: AlgorithmCategory.Sorting,
          selectedAlgorithm: SortingAlgorithm.Bubble,
        },
      });

      const label = wrapper.find('label');
      const select = wrapper.find('select');
      expect(label.attributes('for')).toBe('algorithm-select');
      expect(select.attributes('id')).toBe('algorithm-select');
    });
  });
});
