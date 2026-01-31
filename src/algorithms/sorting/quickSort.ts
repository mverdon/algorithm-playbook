import { AnimationStep, AnimationState } from '@/types/algorithms';

export interface QuickSortResult {
  sorted: number[];
  steps: AnimationStep[];
  comparisons: number;
  swaps: number;
}

/**
 * Quick Sort Algorithm with Animation Generation
 * 
 * Implements the Quick Sort algorithm with Lomuto partition scheme.
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n) for recursion stack
 * 
 * @param arr - Array of numbers to sort
 * @returns QuickSortResult with sorted array, animation steps, and statistics
 */
export function quickSort(arr: number[]): QuickSortResult {
  const array = [...arr]; // Create a copy to avoid mutating the input
  const steps: AnimationStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  /**
   * Partition helper function using Lomuto partition scheme
   * Selects the last element as pivot and partitions array around it
   */
  function partition(low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Animate comparison with pivot
      steps.push({
        indices: [j, high],
        state: AnimationState.Comparing,
        values: [...array],
      });
      comparisons++;

      if (array[j] <= pivot) {
        i++;
        if (i !== j) {
          // Swap elements
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            indices: [i, j],
            state: AnimationState.Swapping,
            values: [...array],
          });
          swaps++;
        }
      }
    }

    // Place pivot in its final position
    if (i + 1 !== high) {
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      steps.push({
        indices: [i + 1, high],
        state: AnimationState.Swapping,
        values: [...array],
      });
      swaps++;
    }

    // Mark pivot as sorted
    steps.push({
      indices: [i + 1],
      state: AnimationState.Sorted,
      values: [...array],
    });

    return i + 1;
  }

  /**
   * Recursive quick sort helper
   */
  function quickSortRecursive(low: number, high: number): void {
    if (low < high) {
      const pivotIndex = partition(low, high);
      quickSortRecursive(low, pivotIndex - 1);
      quickSortRecursive(pivotIndex + 1, high);
    } else if (low === high) {
      // Single element is already sorted
      steps.push({
        indices: [low],
        state: AnimationState.Sorted,
        values: [...array],
      });
    }
  }

  if (array.length > 0) {
    quickSortRecursive(0, array.length - 1);
  }

  return {
    sorted: array,
    steps,
    comparisons,
    swaps,
  };
}
