import { AnimationStep, AnimationState } from '@/types/algorithms';

/**
 * Result returned by the bubble sort algorithm
 */
export interface BubbleSortResult {
  /** The sorted array */
  sortedArray: number[];
  /** Array of animation steps for visualization */
  animationSteps: AnimationStep[];
  /** Total number of comparisons performed */
  comparisons: number;
  /** Total number of swaps performed */
  swaps: number;
}

/**
 * Bubble Sort Algorithm with Animation Generation
 * 
 * Implements the bubble sort algorithm, repeatedly stepping through the array,
 * comparing adjacent elements and swapping them if they're in the wrong order.
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * Stable: Yes
 * 
 * @param arr - Array of numbers to sort
 * @returns BubbleSortResult with sorted array, animation steps, and statistics
 */
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
