<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    class="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import type { Grid, GridAnimationStep } from '../types/grid';
import { NodeState } from '../types/grid';

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

const cellSize = computed(() => {
  const rows = props.grid.length;
  const cols = props.grid[0]?.length || 0;
  return Math.min(
    Math.floor(props.width / cols),
    Math.floor(props.height / rows)
  );
});

const colorScheme = computed(() => {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    default: isDark ? '#374151' : '#f3f4f6',
    wall: isDark ? '#1f2937' : '#4b5563',
    start: isDark ? '#3b82f6' : '#60a5fa',
    end: isDark ? '#ef4444' : '#f87171',
    visiting: isDark ? '#eab308' : '#fbbf24',
    visited: isDark ? '#8b5cf6' : '#a78bfa',
    path: isDark ? '#10b981' : '#34d399',
    border: isDark ? '#4b5563' : '#d1d5db',
  };
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
</script>
