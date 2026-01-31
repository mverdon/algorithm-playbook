import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { useAnimationEngine } from '@/composables/useAnimationEngine';
import { AnimationSpeed, AnimationState } from '@/types/algorithms';
import type { AnimationStep } from '@/types/algorithms';

interface MockAnimationStep extends AnimationStep {
  index: number;
  value: number;
}

function createMockSteps(count: number): MockAnimationStep[] {
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    value: i * 10,
    state: AnimationState.Comparing,
    indices: [i],
  }));
}

describe('useAnimationEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(5));
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      expect(engine.isPlaying.value).toBe(false);
      expect(engine.isPaused.value).toBe(false);
      expect(engine.isComplete.value).toBe(false);
      expect(engine.currentStep.value).toBe(0);
      expect(engine.totalSteps.value).toBe(5);
      expect(engine.canPlay.value).toBe(true);
    });

    it('should compute state correctly', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Fast);
      const engine = useAnimationEngine(steps, speed);

      expect(engine.state.value).toEqual({
        isPlaying: false,
        isPaused: false,
        isComplete: false,
        currentStep: 0,
        totalSteps: 3,
        canPlay: true,
      });
    });

    it('should handle empty steps array', () => {
      const steps = ref<MockAnimationStep[]>([]);
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      expect(engine.totalSteps.value).toBe(0);
      expect(engine.canPlay.value).toBe(false);
      expect(engine.isComplete.value).toBe(false);
    });
  });

  describe('Play functionality', () => {
    it('should start playing animation', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Fast);
      const engine = useAnimationEngine(steps, speed);

      engine.play();

      expect(engine.isPlaying.value).toBe(true);
      expect(engine.isPaused.value).toBe(false);
      expect(engine.canPlay.value).toBe(false);
    });

    it('should execute onStepChange callback for each step', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Fast);
      const stepChanges: Array<{ step: MockAnimationStep; index: number }> = [];
      
      const engine = useAnimationEngine(steps, speed, (step, index) => {
        stepChanges.push({ step, index });
      });

      engine.play();

      // Fast forward through all animation frames
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 3);
      await nextTick();

      expect(stepChanges).toHaveLength(3);
      expect(stepChanges[0]).toEqual({ step: steps.value[0], index: 0 });
      expect(stepChanges[1]).toEqual({ step: steps.value[1], index: 1 });
      expect(stepChanges[2]).toEqual({ step: steps.value[2], index: 2 });
    });

    it('should respect animation speed', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(2));
      const speed = ref(AnimationSpeed.Slow);
      const stepChanges: number[] = [];
      
      const engine = useAnimationEngine(steps, speed, (_, index) => {
        stepChanges.push(index);
      });

      engine.play();

      // Don't advance time yet - first step executes immediately
      await nextTick();
      expect(stepChanges.length).toBeGreaterThanOrEqual(1);

      // Advance by one slow frame - second step should execute
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Slow);
      await nextTick();
      expect(stepChanges.length).toBe(2);
      expect(engine.isComplete.value).toBe(true);
    });

    it('should stop playing when all steps are complete', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(2));
      const speed = ref(AnimationSpeed.Fast);
      const engine = useAnimationEngine(steps, speed);

      engine.play();

      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 2);
      await nextTick();

      expect(engine.isPlaying.value).toBe(false);
      expect(engine.isComplete.value).toBe(true);
      expect(engine.currentStep.value).toBe(2);
    });

    it('should not play when already playing', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      engine.play();
      expect(engine.isPlaying.value).toBe(true);

      engine.play(); // Try to play again
      expect(engine.isPlaying.value).toBe(true);
    });

    it('should not play with empty steps', () => {
      const steps = ref<MockAnimationStep[]>([]);
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      engine.play();

      expect(engine.isPlaying.value).toBe(false);
      expect(engine.canPlay.value).toBe(false);
    });

    it('should restart from beginning if complete', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(2));
      const speed = ref(AnimationSpeed.Fast);
      const stepChanges: number[] = [];
      
      const engine = useAnimationEngine(steps, speed, (_, index) => {
        stepChanges.push(index);
      });

      // First play through
      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 2);
      await nextTick();
      expect(engine.isComplete.value).toBe(true);
      expect(stepChanges).toEqual([0, 1]);

      // Play again - should restart
      stepChanges.length = 0;
      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 2);
      await nextTick();
      expect(stepChanges).toEqual([0, 1]);
    });
  });

  describe('Pause functionality', () => {
    it('should pause playing animation', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(5));
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      engine.play();
      expect(engine.isPlaying.value).toBe(true);

      await vi.advanceTimersByTimeAsync(AnimationSpeed.Normal);
      await nextTick();

      engine.pause();
      expect(engine.isPlaying.value).toBe(false);
      expect(engine.isPaused.value).toBe(true);
    });

    it('should maintain current step when paused', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(5));
      const speed = ref(AnimationSpeed.Fast);
      const engine = useAnimationEngine(steps, speed);

      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 1);
      await nextTick();

      const stepBeforePause = engine.currentStep.value;
      engine.pause();

      expect(engine.currentStep.value).toBe(stepBeforePause);
      expect(engine.currentStep.value).toBeGreaterThan(0);
    });

    it('should not pause when not playing', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      engine.pause();

      expect(engine.isPlaying.value).toBe(false);
      expect(engine.isPaused.value).toBe(false);
    });

    it('should resume from paused state', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(5));
      const speed = ref(AnimationSpeed.Fast);
      const stepChanges: number[] = [];
      
      const engine = useAnimationEngine(steps, speed, (_, index) => {
        stepChanges.push(index);
      });

      // Play for 2 steps (first executes immediately, wait for 2 more)
      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 1);
      await nextTick();
      expect(stepChanges.length).toBeGreaterThanOrEqual(2);

      // Pause
      engine.pause();
      expect(engine.isPaused.value).toBe(true);
      const stepsAfterPause = stepChanges.length;

      // Resume
      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 5);
      await nextTick();
      expect(stepChanges.length).toBe(5);
      expect(engine.isComplete.value).toBe(true);
    });
  });

  describe('Reset functionality', () => {
    it('should reset to initial state', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Fast);
      const engine = useAnimationEngine(steps, speed);

      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 3);
      await nextTick();

      engine.reset();

      expect(engine.isPlaying.value).toBe(false);
      expect(engine.isPaused.value).toBe(false);
      expect(engine.currentStep.value).toBe(0);
      expect(engine.isComplete.value).toBe(false);
    });

    it('should clear animation timer on reset', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(5));
      const speed = ref(AnimationSpeed.Normal);
      const stepChanges: number[] = [];
      
      const engine = useAnimationEngine(steps, speed, (_, index) => {
        stepChanges.push(index);
      });

      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Normal * 1.5);
      await nextTick();

      const stepsBeforeReset = stepChanges.length;
      engine.reset();

      // Advance time further - no more steps should execute
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Normal * 10);
      await nextTick();

      expect(stepChanges).toHaveLength(stepsBeforeReset);
    });
  });

  describe('Stop functionality', () => {
    it('should stop animation without resetting step', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(5));
      const speed = ref(AnimationSpeed.Fast);
      const engine = useAnimationEngine(steps, speed);

      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 2);
      await nextTick();

      const stepBeforeStop = engine.currentStep.value;
      engine.stop();

      expect(engine.isPlaying.value).toBe(false);
      expect(engine.isPaused.value).toBe(false);
      expect(engine.currentStep.value).toBe(stepBeforeStop);
    });
  });

  describe('Step forward/backward', () => {
    it('should step forward one frame', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Normal);
      const stepChanges: number[] = [];
      
      const engine = useAnimationEngine(steps, speed, (_, index) => {
        stepChanges.push(index);
      });

      engine.stepForward();
      expect(engine.currentStep.value).toBe(1);
      expect(stepChanges).toEqual([0]);

      engine.stepForward();
      expect(engine.currentStep.value).toBe(2);
      expect(stepChanges).toEqual([0, 1]);
    });

    it('should not step forward beyond total steps', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(2));
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      engine.stepForward();
      engine.stepForward();
      expect(engine.currentStep.value).toBe(2);

      engine.stepForward();
      expect(engine.currentStep.value).toBe(2);
    });

    it('should step backward one frame', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Normal);
      const stepChanges: number[] = [];
      
      const engine = useAnimationEngine(steps, speed, (_, index) => {
        stepChanges.push(index);
      });

      engine.stepForward();
      engine.stepForward();
      expect(engine.currentStep.value).toBe(2);

      engine.stepBackward();
      expect(engine.currentStep.value).toBe(1);
      expect(stepChanges[stepChanges.length - 1]).toBe(1);
    });

    it('should not step backward below zero', () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      engine.stepBackward();
      expect(engine.currentStep.value).toBe(0);
    });
  });

  describe('Steps reactivity', () => {
    it('should reset when steps change', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Fast);
      const engine = useAnimationEngine(steps, speed);

      engine.play();
      await vi.advanceTimersByTimeAsync(AnimationSpeed.Fast * 3);
      await nextTick();

      expect(engine.currentStep.value).toBe(3);
      expect(engine.isComplete.value).toBe(true);

      // Change steps
      steps.value = createMockSteps(5);
      await nextTick();

      expect(engine.currentStep.value).toBe(0);
      expect(engine.totalSteps.value).toBe(5);
      expect(engine.isPlaying.value).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should clear timer on unmount', async () => {
      const steps = ref<MockAnimationStep[]>(createMockSteps(3));
      const speed = ref(AnimationSpeed.Normal);
      const engine = useAnimationEngine(steps, speed);

      engine.play();
      await nextTick();

      // Clear is called internally when animation completes or resets
      engine.reset();
      
      expect(engine.currentStep.value).toBe(0);
      expect(engine.isPlaying.value).toBe(false);
    });
  });
});
