<template>
  <div class="sorting-visualizer">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { AnimationState, type AnimationStep } from '@/types/algorithms';

interface Props {
  array: number[];
  currentStep?: AnimationStep | null;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: null,
  width: 800,
  height: 400,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWidth = computed(() => props.width);
const canvasHeight = computed(() => props.height);

// Color scheme for different states
const colors = {
  default: '#3b82f6', // blue-500
  comparing: '#eab308', // yellow-500
  swapping: '#ef4444', // red-500
  sorted: '#22c55e', // green-500
};

const darkColors = {
  default: '#60a5fa', // blue-400
  comparing: '#fbbf24', // yellow-400
  swapping: '#f87171', // red-400
  sorted: '#4ade80', // green-400
};

function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}

function getBarColor(index: number, step: AnimationStep | null): string {
  const colorScheme = isDarkMode() ? darkColors : colors;
  
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

function drawBars() {
  if (!canvasRef.value) return;

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
});
</script>

<style scoped>
.sorting-visualizer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
