<script setup lang="ts">
import { computed } from 'vue';
import { SortingAlgorithm, PathfindingAlgorithm, AlgorithmCategory } from '@/types/algorithms';

/**
 * Props for the AlgorithmSelector component
 */
interface Props {
  /** The category of algorithms to display (Sorting or Pathfinding) */
  category: AlgorithmCategory;
  /** The currently selected algorithm */
  selectedAlgorithm: SortingAlgorithm | PathfindingAlgorithm;
}

/**
 * Events emitted by the AlgorithmSelector component
 */
interface Emits {
  /** Emitted when the user selects a different algorithm */
  (e: 'update:selectedAlgorithm', value: SortingAlgorithm | PathfindingAlgorithm): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const algorithms = computed(() => {
  if (props.category === AlgorithmCategory.Sorting) {
    return [
      { value: SortingAlgorithm.Bubble, label: 'Bubble Sort' },
      { value: SortingAlgorithm.Quick, label: 'Quick Sort' },
      { value: SortingAlgorithm.Merge, label: 'Merge Sort' },
      { value: SortingAlgorithm.Heap, label: 'Heap Sort' },
    ];
  } else {
    return [
      { value: PathfindingAlgorithm.AStar, label: 'A* Search' },
      { value: PathfindingAlgorithm.Dijkstra, label: 'Dijkstra' },
      { value: PathfindingAlgorithm.BFS, label: 'Breadth-First Search' },
      { value: PathfindingAlgorithm.DFS, label: 'Depth-First Search' },
    ];
  }
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:selectedAlgorithm', target.value as SortingAlgorithm | PathfindingAlgorithm);
};
</script>

<template>
  <div class="algorithm-selector">
    <label for="algorithm-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Select Algorithm
    </label>
    <select
      id="algorithm-select"
      :value="selectedAlgorithm"
      @change="handleChange"
      role="combobox"
      :aria-label="`Select ${category === AlgorithmCategory.Sorting ? 'sorting' : 'pathfinding'} algorithm`"
      aria-required="false"
      class="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
    >
      <option
        v-for="algo in algorithms"
        :key="algo.value"
        :value="algo.value"
      >
        {{ algo.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.algorithm-selector {
  width: 100%;
  max-width: 300px;
}

select {
  cursor: pointer;
}

select:hover {
  border-color: rgb(59, 130, 246);
}
</style>
