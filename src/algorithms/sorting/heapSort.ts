import type { AnimationStep } from '@/types/algorithms';
import { AnimationState } from '@/types/algorithms';

/**
 * Result returned by the heap sort algorithm
 */
export interface HeapSortResult {
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
 * Heap Sort Algorithm with Animation Generation
 * 
 * Implements heap sort by building a max heap and repeatedly extracting the maximum.
 * First builds a max heap, then swaps root with last element and heapifies.
 * Time Complexity: O(n log n)
 * Space Complexity: O(1)
 * Stable: No
 * 
 * @param arr - Array of numbers to sort
 * @returns HeapSortResult with sorted array, animation steps, and statistics
 */
export function heapSort(arr: number[]): HeapSortResult {
  const array = [...arr];
  const animationSteps: AnimationStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    const heapifyStats = heapify(array, n, i, animationSteps, comparisons, swaps);
    comparisons = heapifyStats.comparisons;
    swaps = heapifyStats.swaps;
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    animationSteps.push({
      indices: [0, i],
      state: AnimationState.Swapping,
      values: [...array],
    });
    [array[0], array[i]] = [array[i], array[0]];
    swaps++;

    // Mark sorted element
    animationSteps.push({
      indices: [i],
      state: AnimationState.Sorted,
      values: [...array],
    });

    // Heapify the reduced heap
    const heapifyStats = heapify(array, i, 0, animationSteps, comparisons, swaps);
    comparisons = heapifyStats.comparisons;
    swaps = heapifyStats.swaps;
  }

  // Mark first element as sorted
  if (n > 0) {
    animationSteps.push({
      indices: [0],
      state: AnimationState.Sorted,
      values: [...array],
    });
  }

  return { sortedArray: array, animationSteps, comparisons, swaps };
}

/**
 * Maintains the max heap property for a subtree rooted at the given index
 * 
 * @param array - The array being heapified
 * @param heapSize - Size of the heap (elements beyond this are considered sorted)
 * @param rootIndex - Root index of the subtree to heapify
 * @param steps - Array to collect animation steps
 * @param comparisons - Current comparison count
 * @param swaps - Current swap count
 * @returns Updated comparison and swap counts
 */
function heapify(
  array: number[],
  heapSize: number,
  rootIndex: number,
  steps: AnimationStep[],
  comparisons: number,
  swaps: number
): { comparisons: number; swaps: number } {
  let largest = rootIndex;
  const left = 2 * rootIndex + 1;
  const right = 2 * rootIndex + 2;

  // Compare with left child
  if (left < heapSize) {
    steps.push({
      indices: [largest, left],
      state: AnimationState.Comparing,
      values: [...array],
    });
    comparisons++;
    if (array[left] > array[largest]) {
      largest = left;
    }
  }

  // Compare with right child
  if (right < heapSize) {
    steps.push({
      indices: [largest, right],
      state: AnimationState.Comparing,
      values: [...array],
    });
    comparisons++;
    if (array[right] > array[largest]) {
      largest = right;
    }
  }

  // If largest is not root, swap and recursively heapify
  if (largest !== rootIndex) {
    steps.push({
      indices: [rootIndex, largest],
      state: AnimationState.Swapping,
      values: [...array],
    });
    [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
    swaps++;

    // Recursively heapify the affected sub-tree
    const childStats = heapify(array, heapSize, largest, steps, comparisons, swaps);
    comparisons = childStats.comparisons;
    swaps = childStats.swaps;
  }

  return { comparisons, swaps };
}
