import { ref, computed, watch, onUnmounted, type Ref } from 'vue';
import { AnimationSpeed, type AnimationStep } from '@/types/algorithms';

export interface AnimationEngineState {
  isPlaying: boolean;
  isPaused: boolean;
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;
  canPlay: boolean;
}

export function useAnimationEngine<T extends AnimationStep>(
  steps: Ref<T[]>,
  speed: Ref<AnimationSpeed>,
  onStepChange?: (step: T, index: number) => void
) {
  const isPlaying = ref(false);
  const isPaused = ref(false);
  const currentStep = ref(0);
  let animationTimer: number | null = null;

  const totalSteps = computed(() => steps.value.length);
  const isComplete = computed(() => currentStep.value >= totalSteps.value && totalSteps.value > 0);
  const canPlay = computed(() => totalSteps.value > 0 && !isPlaying.value);

  const state = computed<AnimationEngineState>(() => ({
    isPlaying: isPlaying.value,
    isPaused: isPaused.value,
    isComplete: isComplete.value,
    currentStep: currentStep.value,
    totalSteps: totalSteps.value,
    canPlay: canPlay.value,
  }));

  function clearTimer() {
    if (animationTimer !== null) {
      clearTimeout(animationTimer);
      animationTimer = null;
    }
  }

  function scheduleNextFrame() {
    clearTimer();
    
    if (!isPlaying.value || currentStep.value >= totalSteps.value) {
      isPlaying.value = false;
      return;
    }

    const step = steps.value[currentStep.value];
    if (onStepChange) {
      onStepChange(step, currentStep.value);
    }

    currentStep.value++;

    if (currentStep.value < totalSteps.value) {
      animationTimer = setTimeout(scheduleNextFrame, speed.value) as unknown as number;
    } else {
      isPlaying.value = false;
    }
  }

  function play() {
    if (!canPlay.value) return;

    if (isComplete.value) {
      currentStep.value = 0;
    }

    isPlaying.value = true;
    isPaused.value = false;
    scheduleNextFrame();
  }

  function pause() {
    if (!isPlaying.value) return;

    isPlaying.value = false;
    isPaused.value = true;
    clearTimer();
  }

  function reset() {
    clearTimer();
    isPlaying.value = false;
    isPaused.value = false;
    currentStep.value = 0;
  }

  function stop() {
    clearTimer();
    isPlaying.value = false;
    isPaused.value = false;
  }

  function stepForward() {
    if (currentStep.value >= totalSteps.value) return;

    const step = steps.value[currentStep.value];
    if (onStepChange) {
      onStepChange(step, currentStep.value);
    }

    currentStep.value++;
  }

  function stepBackward() {
    if (currentStep.value <= 0) return;

    currentStep.value--;
    const step = steps.value[currentStep.value];
    if (onStepChange) {
      onStepChange(step, currentStep.value);
    }
  }

  // Watch for steps changes and reset animation
  watch(steps, () => {
    reset();
  });

  // Cleanup on unmount
  onUnmounted(() => {
    clearTimer();
  });

  return {
    state,
    isPlaying,
    isPaused,
    isComplete,
    currentStep,
    totalSteps,
    canPlay,
    play,
    pause,
    reset,
    stop,
    stepForward,
    stepBackward,
  };
}
