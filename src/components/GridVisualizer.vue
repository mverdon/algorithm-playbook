<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    tabindex="0"
    role="grid"
    :aria-label="`Interactive pathfinding grid with ${props.grid.length} rows and ${props.grid[0]?.length || 0} columns`"
    class="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @keydown="handleKeyDown"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import type { Grid, GridAnimationStep } from '../types/grid';
import { NodeState } from '../types/grid';
import { getPathfindingColors, isDarkMode } from '@/utils/colorScheme';

interface Props {
  grid: Grid;
  currentStep?: GridAnimationStep | null;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 600,
  currentStep: null,
});

const emit = defineEmits<{
  toggleWall: [row: number, col: number];
  setStart: [row: number, col: number];
  setEnd: [row: number, col: number];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDragging = ref(false);
const dragMode = ref<'wall' | 'start' | 'end' | null>(null);
const focusedCell = ref<{ row: number; col: number } | null>(null);

const cellSize = computed(() => {
  const rows = props.grid.length;
  const cols = props.grid[0]?.length || 0;
  return Math.min(
    Math.floor(props.width / cols),
    Math.floor(props.height / rows)
  );
});

const colorScheme = computed(() => {
  return getPathfindingColors(isDarkMode());
});

function drawGrid() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rows = props.grid.length;
  const cols = props.grid[0]?.length || 0;
  const size = cellSize.value;
  const colors = colorScheme.value;

  ctx.clearRect(0, 0, props.width, props.height);

  // Draw cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = props.grid[row][col];
      const x = col * size;
      const y = row * size;

      // Determine cell color based on state
      let fillColor = colors.default;
      
      if (node.isWall) {
        fillColor = colors.wall;
      } else if (node.isStart) {
        fillColor = colors.start;
      } else if (node.isEnd) {
        fillColor = colors.end;
      } else if (node.state === NodeState.Path) {
        fillColor = colors.path;
      } else if (node.state === NodeState.Visited) {
        fillColor = colors.visited;
      } else if (node.state === NodeState.Visiting) {
        fillColor = colors.visiting;
      }

      // Apply animation step override if current position
      if (props.currentStep && 
          props.currentStep.position.row === row && 
          props.currentStep.position.col === col) {
        if (props.currentStep.state === NodeState.Visiting) {
          fillColor = colors.visiting;
        } else if (props.currentStep.state === NodeState.Visited) {
          fillColor = colors.visited;
        } else if (props.currentStep.state === NodeState.Path) {
          fillColor = colors.path;
        }
      }

      // Draw cell
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, size, size);

      // Draw border
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, size, size);

      // Draw focus indicator for keyboard navigation
      if (focusedCell.value && focusedCell.value.row === row && focusedCell.value.col === col) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
      }
    }
  }
}

function getCellFromCoordinates(x: number, y: number): { row: number; col: number } | null {
  const size = cellSize.value;
  const row = Math.floor(y / size);
  const col = Math.floor(x / size);
  
  const rows = props.grid.length;
  const cols = props.grid[0]?.length || 0;
  
  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    return { row, col };
  }
  return null;
}

function handleMouseDown(event: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const cell = getCellFromCoordinates(x, y);
  if (!cell) return;

  const node = props.grid[cell.row][cell.col];
  
  isDragging.value = true;
  
  if (node.isStart) {
    dragMode.value = 'start';
  } else if (node.isEnd) {
    dragMode.value = 'end';
  } else {
    dragMode.value = 'wall';
    emit('toggleWall', cell.row, cell.col);
  }
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return;
  
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const cell = getCellFromCoordinates(x, y);
  if (!cell) return;

  const node = props.grid[cell.row][cell.col];
  
  if (dragMode.value === 'start' && !node.isEnd && !node.isWall) {
    emit('setStart', cell.row, cell.col);
  } else if (dragMode.value === 'end' && !node.isStart && !node.isWall) {
    emit('setEnd', cell.row, cell.col);
  } else if (dragMode.value === 'wall' && !node.isStart && !node.isEnd) {
    // Only toggle if it's different from current state
    const shouldBeWall = !node.isWall;
    if (node.isWall !== shouldBeWall) {
      emit('toggleWall', cell.row, cell.col);
    }
  }
}

function handleMouseUp() {
  isDragging.value = false;
  dragMode.value = null;
}

function handleKeyDown(event: KeyboardEvent) {
  const rows = props.grid.length;
  const cols = props.grid[0]?.length || 0;
  
  if (rows === 0 || cols === 0) return;
  
  // Initialize focused cell to start position if not set
  if (!focusedCell.value) {
    const startNode = props.grid.flat().find(node => node.isStart);
    if (startNode) {
      focusedCell.value = { row: startNode.position.row, col: startNode.position.col };
    } else {
      focusedCell.value = { row: 0, col: 0 };
    }
  }
  
  const { row, col } = focusedCell.value;
  let newRow = row;
  let newCol = col;
  let handled = true;
  
  switch (event.key) {
    case 'ArrowUp':
      newRow = Math.max(0, row - 1);
      break;
    case 'ArrowDown':
      newRow = Math.min(rows - 1, row + 1);
      break;
    case 'ArrowLeft':
      newCol = Math.max(0, col - 1);
      break;
    case 'ArrowRight':
      newCol = Math.min(cols - 1, col + 1);
      break;
    case ' ':
    case 'Enter':
      // Toggle wall on space or enter
      const node = props.grid[row][col];
      if (!node.isStart && !node.isEnd) {
        emit('toggleWall', row, col);
      }
      break;
    case 's':
    case 'S':
      // Set start node
      emit('setStart', row, col);
      break;
    case 'e':
    case 'E':
      // Set end node
      emit('setEnd', row, col);
      break;
    default:
      handled = false;
  }
  
  if (handled) {
    event.preventDefault();
    focusedCell.value = { row: newRow, col: newCol };
    drawGrid();
  }
}

// Set up dark mode observer
let observer: MutationObserver | null = null;

onMounted(() => {
  drawGrid();
  
  // Watch for dark mode changes
  observer = new MutationObserver(() => {
    drawGrid();
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Watch for prop changes
watch(() => props.grid, drawGrid, { deep: true });
watch(() => props.currentStep, drawGrid, { deep: true });
watch(focusedCell, drawGrid, { deep: true });
</script>
