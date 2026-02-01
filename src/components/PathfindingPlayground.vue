<template>
  <div
    class="pathfinding-playground bg-white dark:bg-gray-900 min-h-screen p-6"
    tabindex="0"
    @keydown="handleKeydown"
    role="application"
    :aria-label="ariaLabel"
    ref="containerRef"
  >
    <NotificationToast
      :show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />

    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Pathfinding Algorithm Visualizer
      </h1>

      <div class="controls-panel bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AlgorithmSelector
            :category="AlgorithmCategory.Pathfinding"
            v-model:selectedAlgorithm="selectedAlgorithm"
          />

          <SpeedControl v-model:speed="animationSpeed" />

          <div class="flex items-end gap-2">
            <Tooltip text="Remove all walls from the grid">
              <button
                @click="clearWalls"
                :disabled="isPlaying || isLoading"
                class="flex-1 px-4 py-2 bg-orange-700 hover:bg-orange-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:bg-orange-700 dark:hover:bg-orange-600"
              >
                Clear Walls
              </button>
            </Tooltip>
            <Tooltip text="Clear entire grid and reset positions">
              <button
                @click="resetGrid"
                :disabled="isPlaying || isLoading"
                class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600"
              >
                Reset Grid
              </button>
            </Tooltip>
          </div>
        </div>

        <ControlButtons
          :isPlaying="isPlaying"
          :isComplete="isComplete"
          :canPlay="canPlay"
          @play="handlePlay"
          @pause="handlePause"
          @reset="handleReset"
        />
      </div>

      <div class="visualizer-container bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
        <!-- Loading Overlay -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-lg"
          role="status"
          aria-live="polite"
        >
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p class="mt-3 text-gray-700 dark:text-gray-300 font-medium">Generating animation steps...</p>
          </div>
        </div>

        <div class="mb-4 text-sm text-gray-700 dark:text-gray-300">
          <p class="mb-2"><strong>Instructions:</strong></p>
          <ul class="list-disc list-inside space-y-1">
            <li>Click or drag to add/remove walls</li>
            <li>Drag the blue (start) or red (end) node to reposition</li>
            <li>Select an algorithm and click "Play" to visualize</li>
          </ul>
        </div>
        <GridVisualizer
          :grid="displayGrid"
          :currentStep="currentAnimationStep"
          :width="600"
          :height="600"
          @toggleWall="handleToggleWall"
          @setStart="handleSetStart"
          @setEnd="handleSetEnd"
        />
      </div>
    </div>
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      {{ screenReaderAnnouncement }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * PathfindingPlayground Component
 *
 * The main component for the pathfinding algorithm visualizer.
 * Provides controls for selecting pathfinding algorithms, adjusting animation speed,
 * and controlling playback. Features an interactive grid where users can draw walls,
 * set start/end points, and visualize how different algorithms find the shortest path.
 */
import { ref, computed, watch, onMounted } from 'vue';
import AlgorithmSelector from './AlgorithmSelector.vue';
import SpeedControl from './SpeedControl.vue';
import ControlButtons from './ControlButtons.vue';
import GridVisualizer from './GridVisualizer.vue';
import NotificationToast from './NotificationToast.vue';
import Tooltip from './Tooltip.vue';
import { useAnimationEngine } from '@/composables/useAnimationEngine';
import { aStarAnimated } from '@/algorithms/grid/aStar';
import { dijkstraAnimated } from '@/algorithms/grid/dijkstra';
import { bfsAnimated } from '@/algorithms/grid/bfs';
import { dfsAnimated } from '@/algorithms/grid/dfs';
import {
  createGrid,
  toggleWall,
  setStartNode,
  setEndNode,
  resetGrid as resetGridUtil,
} from '@/algorithms/grid/gridUtils';
import {
  AlgorithmCategory,
  PathfindingAlgorithm,
  AnimationSpeed,
} from '@/types/algorithms';
import type { Grid, GridConfig, GridAnimationStepWithGrid } from '@/types/grid';
import { NodeState } from '@/types/grid';

const selectedAlgorithm = ref<PathfindingAlgorithm>(PathfindingAlgorithm.AStar);
const animationSpeed = ref<AnimationSpeed>(AnimationSpeed.Normal);
const containerRef = ref<HTMLDivElement | null>(null);
const screenReaderAnnouncement = ref<string>('');

const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'info' | 'warning' | 'error'>('success');
const isLoading = ref(false);

const gridConfig: GridConfig = {
  rows: 25,
  cols: 25,
  startPos: { row: 5, col: 5 },
  endPos: { row: 19, col: 19 },
};

const grid = ref<Grid>(createGrid(gridConfig));
const displayGrid = ref<Grid>(createGrid(gridConfig));
const animationSteps = ref<GridAnimationStepWithGrid[]>([]);

const pathfindingAlgorithms = {
  [PathfindingAlgorithm.AStar]: aStarAnimated,
  [PathfindingAlgorithm.Dijkstra]: dijkstraAnimated,
  [PathfindingAlgorithm.BFS]: bfsAnimated,
  [PathfindingAlgorithm.DFS]: dfsAnimated,
};

const startPathfinding = () => {
  // Set loading state - Vue will batch this with the next state update
  // so in practice the loading spinner will show briefly during computation
  isLoading.value = true;

  const pathfindFn = pathfindingAlgorithms[selectedAlgorithm.value];
  const generator = pathfindFn(grid.value);

  // Convert generator to array and add grid snapshot to each step
  const steps: GridAnimationStepWithGrid[] = [];
  const workingGrid = JSON.parse(JSON.stringify(grid.value)) as Grid;

  for (const step of generator) {
    // Update working grid based on step
    const node = workingGrid[step.position.row][step.position.col];
    if (!node.isStart && !node.isEnd) {
      node.state = step.state;
    }

    // Create step with grid snapshot
    steps.push({
      ...step,
      grid: JSON.parse(JSON.stringify(workingGrid)) as Grid,
    });
  }

  animationSteps.value = steps;

  // Clear loading state immediately after computation
  isLoading.value = false;
};

const animationEngine = useAnimationEngine<GridAnimationStepWithGrid>(
  animationSteps,
  animationSpeed,
  (step: GridAnimationStepWithGrid) => {
    if (step) {
      displayGrid.value = step.grid;
    }
  },
  () => {
    // On completion callback
    const algorithmNames = {
      [PathfindingAlgorithm.AStar]: 'A* Pathfinding',
      [PathfindingAlgorithm.Dijkstra]: "Dijkstra's Algorithm",
      [PathfindingAlgorithm.BFS]: 'Breadth-First Search',
      [PathfindingAlgorithm.DFS]: 'Depth-First Search',
    };

    // Check if a path was found by looking for NodeState.Path in the final grid
    const pathFound = displayGrid.value.flat().some(node => node.state === NodeState.Path);

    if (pathFound) {
      notificationMessage.value = `${algorithmNames[selectedAlgorithm.value]} completed! Path found.`;
      notificationType.value = 'success';
    } else {
      notificationMessage.value = `${algorithmNames[selectedAlgorithm.value]} completed. No path exists.`;
      notificationType.value = 'info';
    }
    showNotification.value = true;
  }
);

const currentAnimationStep = computed(() => {
  const stepIndex = animationEngine.currentStep.value;
  return stepIndex > 0 && stepIndex <= animationSteps.value.length
    ? animationSteps.value[stepIndex - 1]
    : null;
});
const isPlaying = computed(() => animationEngine.isPlaying.value);
const isComplete = computed(() => animationEngine.isComplete.value);
const canPlay = computed(() => !isPlaying.value && !isLoading.value);

const ariaLabel = computed(() => {
  const algorithm = selectedAlgorithm.value;
  const status = isPlaying.value ? 'running' : isComplete.value ? 'complete' : 'ready';
  const wallCount = grid.value.flat().filter(node => node.isWall).length;

  return `Pathfinding visualization using ${algorithm} algorithm. Status: ${status}. Grid has ${wallCount} walls. Press Space to start, R to reset, C to clear walls. Use arrow keys to navigate grid.`;
});

const handleToggleWall = (row: number, col: number) => {
  if (!isPlaying.value) {
    const position = { row, col };
    grid.value = toggleWall(grid.value, position);
    displayGrid.value = grid.value;
    animationSteps.value = [];
  }
};

const handleSetStart = (row: number, col: number) => {
  if (!isPlaying.value) {
    const position = { row, col };
    grid.value = setStartNode(grid.value, position);
    displayGrid.value = grid.value;
    animationSteps.value = [];
  }
};

const handleSetEnd = (row: number, col: number) => {
  if (!isPlaying.value) {
    const position = { row, col };
    grid.value = setEndNode(grid.value, position);
    displayGrid.value = grid.value;
    animationSteps.value = [];
  }
};

const clearWalls = () => {
  // Clear all walls by resetting to default state
  grid.value = grid.value.map(row =>
    row.map(node => ({
      ...node,
      isWall: false,
      state: node.isStart ? node.state : node.isEnd ? node.state : NodeState.Default as NodeState,
    }))
  );
  displayGrid.value = grid.value;
  animationSteps.value = [];
};

const resetGrid = () => {
  grid.value = resetGridUtil(gridConfig);
  displayGrid.value = grid.value;
  animationSteps.value = [];
};

const handlePlay = () => {
  if (animationEngine.totalSteps.value === 0) {
    startPathfinding();
  }
  animationEngine.play();
};

const handlePause = () => {
  animationEngine.pause();
};

const handleReset = () => {
  animationEngine.reset();
  displayGrid.value = grid.value;
};

watch(selectedAlgorithm, () => {
  animationSteps.value = [];
  displayGrid.value = grid.value;
});

function handleKeydown(event: KeyboardEvent) {
  // Prevent default behavior for handled keys
  const handledKeys = [' ', 'Enter', 'Escape', 'r', 'R', 'c', 'C', 'g', 'G'];
  if (handledKeys.includes(event.key)) {
    event.preventDefault();
  }

  switch (event.key) {
    case ' ':
    case 'Enter':
      // Play or toggle
      if (!isPlaying.value) {
        handlePlay();
        announceAction('Pathfinding animation started');
      } else {
        handlePause();
        announceAction('Pathfinding animation paused');
      }
      break;
    case 'Escape':
      // Pause
      if (isPlaying.value) {
        handlePause();
        announceAction('Pathfinding animation paused');
      }
      break;
    case 'r':
    case 'R':
      // Reset
      if (!isPlaying.value) {
        handleReset();
        announceAction('Grid reset to initial state');
      }
      break;
    case 'c':
    case 'C':
      // Clear walls
      if (!isPlaying.value) {
        clearWalls();
        announceAction('All walls cleared from grid');
      }
      break;
    case 'g':
    case 'G':
      // Reset grid completely
      if (!isPlaying.value) {
        resetGrid();
        announceAction('Grid reset with start and end positions restored');
      }
      break;
  }
}

function announceAction(message: string) {
  screenReaderAnnouncement.value = message;
  // Clear after a short delay to allow the announcement to be read
  setTimeout(() => {
    screenReaderAnnouncement.value = '';
  }, 1000);
}

onMounted(() => {
  // Initialize the grid to ensure it's ready for visualization
  grid.value = createGrid(gridConfig);
  displayGrid.value = grid.value;

  // Auto-focus the container for immediate keyboard access
  containerRef.value?.focus();
});

</script>

<style scoped>
.pathfinding-playground {
  min-height: 100vh;
  outline: none;
}

.pathfinding-playground:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
  border-radius: 0.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
