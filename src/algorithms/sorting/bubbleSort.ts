import { AnimationStep, AnimationState } from '@/types/algorithms';

export interface BubbleSortResult {
  sortedArray: number[];
  animationSteps: AnimationStep[];
  comparisons: number;
  swaps: number;
}

export function bubbleSort(arr: number[]): BubbleSortResult {
  const array = [...arr];
  const animationSteps: AnimationStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      
      // Add comparing animation step
      animationSteps.push({
        indices: [j, j + 1],
        state: AnimationState.Comparing,
        values: [...array]
      });

      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        
        // Add swapping animation step
        animationSteps.push({
          indices: [j, j + 1],
          state: AnimationState.Swapping,
          values: [...array]
        });
      }
    }
    
    // Mark the element at position (n - i - 1) as sorted
    animationSteps.push({
      indices: [n - i - 1],
      state: AnimationState.Sorted,
      values: [...array]
    });
  }

  // Mark the first element as sorted (it's automatically sorted when all others are)
  if (n > 0) {
    animationSteps.push({
      indices: [0],
      state: AnimationState.Sorted,
      values: [...array]
    });
  }

  return {
    sortedArray: array,
    animationSteps,
    comparisons,
    swaps
  };
}
