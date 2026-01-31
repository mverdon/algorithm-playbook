<template>
  <div 
    class="sorting-visualizer"
    tabindex="0"
    @keydown="handleKeydown"
    role="application"
    aria-label="Sorting visualization canvas"
    ref="containerRef"
  >
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-live="polite"
      :aria-label="ariaLabel"
    ></canvas>
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      {{ screenReaderAnnouncement }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { AnimationState, type AnimationStep } from '@/types/algorithms';
import { getSortingColors, isDarkMode } from '@/utils/colorScheme';

/**
 * Props for the SortingVisualizer component
 */
interface Props {
  /** The array of numbers to visualize */
  array: number[];
  /** The current animation step being displayed (null if not animating) */
  currentStep?: AnimationStep | null;
  /** Canvas width in pixels (default: 800) */
  width?: number;
  /** Canvas height in pixels (default: 400) */
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: null,
  width: 800,
  height: 400,
});

/**
 * Events emitted by the SortingVisualizer component
 */
const emit = defineEmits<{
  /** Emitted when the user presses Space or Enter to play */
  play: [];
  /** Emitted when the user presses Escape to pause */
  pause: [];
  /** Emitted when the user presses R to reset */
  reset: [];
  /** Emitted when the user presses S to shuffle */
  shuffle: [];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const canvasWidth = computed(() => props.width);
const canvasHeight = computed(() => props.height);
const screenReaderAnnouncement = ref<string>('');
const animationFrameId = ref<number | null>(null);
const isDirty = ref(true);

const ariaLabel = computed(() => {
  const array = props.currentStep?.values || props.array;
  if (!props.currentStep) {
    return `Sorting visualization with ${array.length} bars. Press Space to start, R to reset, S to shuffle.`;
  }
  
  const state = props.currentStep.state;
  const indices = props.currentStep.indices;
  
  if (state === AnimationState.Comparing) {
    return `Comparing elements at positions ${indices.join(' and ')}`;
  } else if (state === AnimationState.Swapping) {
    return `Swapping elements at positions ${indices.join(' and ')}`;
  } else if (state === AnimationState.Sorted) {
    return `Element at position ${indices[0]} is now sorted`;
  }
  
  return `Sorting visualization with ${array.length} bars`;
});

function handleKeydown(event: KeyboardEvent) {
  // Prevent default behavior for handled keys
  const handledKeys = [' ', 'Enter', 'Escape', 'r', 'R', 's', 'S', 'ArrowUp', 'ArrowDown'];
  if (handledKeys.includes(event.key)) {
    event.preventDefault();
  }

  switch (event.key) {
    case ' ':
    case 'Enter':
      // Toggle play/pause
      emit('play');
      announceAction('Animation started');
      break;
    case 'Escape':
      // Pause
      emit('pause');
      announceAction('Animation paused');
      break;
    case 'r':
    case 'R':
      // Reset
      emit('reset');
      announceAction('Animation reset');
      break;
    case 's':
    case 'S':
      // Shuffle
      emit('shuffle');
      announceAction('Array shuffled');
      break;
    case 'ArrowUp':
      // Speed up (handled by parent, just announce)
      announceAction('Speed increased');
      break;
    case 'ArrowDown':
      // Slow down (handled by parent, just announce)
      announceAction('Speed decreased');
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

function getBarColor(index: number, step: AnimationStep | null): string {
  const colorScheme = getSortingColors(isDarkMode());
  
  if (!step) {
    return colorScheme.default;
  }

  if (step.indices.includes(index)) {
    switch (step.state) {
      case AnimationState.Comparing:
        return colorScheme.comparing;
      case AnimationState.Swapping:
        return colorScheme.swapping;
      case AnimationState.Sorted:
        return colorScheme.sorted;
      default:
        return colorScheme.default;
    }
  }

  return colorScheme.default;
}

function drawBarsInternal() {
  if (!canvasRef.value || !isDirty.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const array = props.currentStep?.values || props.array;
  if (array.length === 0) return;

  const barWidth = canvas.width / array.length;
  const maxValue = Math.max(...array);
  const heightScale = (canvas.height - 40) / maxValue;

  array.forEach((value, index) => {
    const barHeight = value * heightScale;
    const x = index * barWidth;
    const y = canvas.height - barHeight - 20;

    // Draw bar
    ctx.fillStyle = getBarColor(index, props.currentStep);
    ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

    // Draw value label for smaller arrays
    if (array.length <= 50) {
      ctx.fillStyle = isDarkMode() ? '#e5e7eb' : '#374151'; // gray-200 / gray-700
      ctx.font = `${Math.min(12, barWidth / 2)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, canvas.height - 5);
    }
  });

  isDirty.value = false;
}

function drawBars() {
  isDirty.value = true;
  
  // Cancel any pending animation frame
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
  }
  
  // Schedule draw on next animation frame for smooth 60fps rendering
  animationFrameId.value = requestAnimationFrame(drawBarsInternal);
}

// Watch for changes in array or current step
watch([() => props.array, () => props.currentStep], () => {
  drawBars();
});

// Watch for dark mode changes
const observer = new MutationObserver(() => {
  drawBars();
});

onMounted(() => {
  drawBars();
  
  // Observe dark mode changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // Auto-focus the container for immediate keyboard access
  containerRef.value?.focus();
});

onUnmounted(() => {
  // Clean up animation frame
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value);
  }
  observer.disconnect();
});
</script>

<style scoped>
.sorting-visualizer {
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
}

.sorting-visualizer:focus-visible {
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
