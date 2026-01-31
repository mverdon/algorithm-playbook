import type { AnimationStep } from '@/types/algorithms';
import { AnimationState } from '@/types/algorithms';

export interface HeapSortResult {
  sortedArray: number[];
  animationSteps: AnimationStep[];
  comparisons: number;
  swaps: number;
}

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
