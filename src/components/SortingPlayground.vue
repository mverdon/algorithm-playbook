<template>
  <div class="sorting-playground bg-white dark:bg-gray-900 min-h-screen p-6">
    <NotificationToast
      :show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />

    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Sorting Algorithm Visualizer
      </h1>

      <div class="controls-panel bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AlgorithmSelector
            :category="AlgorithmCategory.Sorting"
            v-model:selectedAlgorithm="selectedAlgorithm"
          />

          <SpeedControl v-model:speed="animationSpeed" />

          <ArraySizeInput
            v-model:size="arraySize"
            :min="5"
            :max="100"
          />

          <div class="flex items-end">
            <button
              @click="generateNewArray"
              :disabled="isPlaying || isLoading"
              class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600"
            >
              Shuffle
            </button>
          </div>
        </div>

        <ControlButtons
          :isPlaying="isPlaying"
          :isComplete="isComplete"
          :canPlay="canPlay"
          @play="handlePlay"
          @pause="handlePause"
          @reset="handleReset"
          @shuffle="generateNewArray"
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
        <SortingVisualizer
          :array="displayArray"
          :currentStep="currentAnimationStep"
          :width="800"
          :height="400"
          @play="handlePlay"
          @pause="handlePause"
          @reset="handleReset"
          @shuffle="generateNewArray"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SortingPlayground Component
 *
 * The main component for the sorting algorithm visualizer.
 * Provides controls for selecting sorting algorithms, adjusting animation speed,
 * changing array size, and controlling playback. Visualizes the sorting process
 * with animated bar charts and displays completion notifications.
 */
import { ref, computed, watch, onMounted } from 'vue';
import AlgorithmSelector from './AlgorithmSelector.vue';
import SpeedControl from './SpeedControl.vue';
import ArraySizeInput from './ArraySizeInput.vue';
import ControlButtons from './ControlButtons.vue';
import SortingVisualizer from './SortingVisualizer.vue';
import NotificationToast from './NotificationToast.vue';
import { useAnimationEngine } from '@/composables/useAnimationEngine';
import { bubbleSort } from '@/algorithms/sorting/bubbleSort';
import { quickSort } from '@/algorithms/sorting/quickSort';
import { mergeSort } from '@/algorithms/sorting/mergeSort';
import { heapSort } from '@/algorithms/sorting/heapSort';
import {
  AlgorithmCategory,
  SortingAlgorithm,
  AnimationSpeed,
  AnimationState,
  type AnimationStep,
} from '@/types/algorithms';

interface SortingAnimationStep extends AnimationStep {
  array: number[];
}

const selectedAlgorithm = ref<SortingAlgorithm>(SortingAlgorithm.Bubble);
const animationSpeed = ref<AnimationSpeed>(AnimationSpeed.Normal);
const arraySize = ref<number>(50);
const array = ref<number[]>([]);
const displayArray = ref<number[]>([]);
const animationSteps = ref<SortingAnimationStep[]>([]);

const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'info' | 'warning' | 'error'>('success');
const isLoading = ref(false);

const generateNewArray = () => {
  const newArray = Array.from({ length: arraySize.value }, () =>
    Math.floor(Math.random() * 100) + 1
  );
  array.value = newArray;
  displayArray.value = [...newArray];
  animationSteps.value = [];
};

const sortingAlgorithms = {
  [SortingAlgorithm.Bubble]: bubbleSort,
  [SortingAlgorithm.Quick]: quickSort,
  [SortingAlgorithm.Merge]: mergeSort,
  [SortingAlgorithm.Heap]: heapSort,
};

const startSorting = () => {
  // Set loading state - Vue will batch this with the next state update
  // so in practice the loading spinner will show briefly during computation
  isLoading.value = true;

  const sortFn = sortingAlgorithms[selectedAlgorithm.value];
  const result = sortFn([...array.value]);

  // Get animation steps (handle different property names)
  const steps = 'steps' in result ? result.steps : result.animationSteps;

  // Convert animation steps to include array snapshots
  const workingArray = [...array.value];
  const stepsWithArrays: SortingAnimationStep[] = steps.map((step: AnimationStep) => {
    // Apply the step to the working array
    if (step.state === AnimationState.Swapping && step.indices.length >= 2) {
      const [i, j] = step.indices;
      [workingArray[i], workingArray[j]] = [workingArray[j], workingArray[i]];
    }

    return {
      ...step,
      array: [...workingArray],
    };
  });

  animationSteps.value = stepsWithArrays;

  // Clear loading state immediately after computation
  isLoading.value = false;
};

const animationEngine = useAnimationEngine<SortingAnimationStep>(
  animationSteps,
  animationSpeed,
  (step: SortingAnimationStep) => {
    if (step) {
      displayArray.value = [...step.array];
    }
  },
  () => {
    // On completion callback
    const algorithmNames = {
      [SortingAlgorithm.Bubble]: 'Bubble Sort',
      [SortingAlgorithm.Quick]: 'Quick Sort',
      [SortingAlgorithm.Merge]: 'Merge Sort',
      [SortingAlgorithm.Heap]: 'Heap Sort',
    };
    notificationMessage.value = `${algorithmNames[selectedAlgorithm.value]} completed! Array is sorted.`;
    notificationType.value = 'success';
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

const handlePlay = () => {
  if (animationEngine.totalSteps.value === 0) {
    startSorting();
  }
  animationEngine.play();
};

const handlePause = () => {
  animationEngine.pause();
};

const handleReset = () => {
  animationEngine.reset();
  displayArray.value = [...array.value];
};

watch(arraySize, () => {
  generateNewArray();
});

watch(selectedAlgorithm, () => {
  animationSteps.value = [];
  displayArray.value = [...array.value];
});

onMounted(() => {
  generateNewArray();
});
</script>

<style scoped>
.sorting-playground {
  min-height: 100vh;
}
</style>
