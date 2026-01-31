import type { AnimationStep } from '@/types/algorithms';
import { AnimationState } from '@/types/algorithms';

/**
 * Result returned by the merge sort algorithm
 */
export interface MergeSortResult {
  /** The sorted array */
  sorted: number[];
  /** Array of animation steps for visualization */
  animationSteps: AnimationStep[];
  /** Total number of comparisons performed */
  comparisons: number;
  /** Total number of merge operations performed */
  merges: number;
}

/**
 * Merge Sort Algorithm with Animation Generation
 * 
 * Implements the merge sort algorithm using divide-and-conquer strategy.
 * Divides the array into halves, recursively sorts them, then merges sorted halves.
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 * Stable: Yes
 * 
 * @param arr - Array of numbers to sort
 * @returns MergeSortResult with sorted array, animation steps, and statistics
 */
export function mergeSort(arr: number[]): MergeSortResult {
  const sorted = [...arr];
  const animationSteps: AnimationStep[] = [];
  let comparisons = 0;
  let merges = 0;

  /**
   * Merges two sorted subarrays into one sorted array
   * @param left - Starting index of left subarray
   * @param mid - Ending index of left subarray
   * @param right - Ending index of right subarray
   */
  function merge(left: number, mid: number, right: number): void {
    const leftArr = sorted.slice(left, mid + 1);
    const rightArr = sorted.slice(mid + 1, right + 1);
    
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      animationSteps.push({
        indices: [left + i, mid + 1 + j],
        state: AnimationState.Comparing,
        values: [...sorted]
      });

      if (leftArr[i] <= rightArr[j]) {
        sorted[k] = leftArr[i];
        i++;
      } else {
        sorted[k] = rightArr[j];
        j++;
      }
      
      merges++;
      animationSteps.push({
        indices: [k],
        state: AnimationState.Swapping,
        values: [...sorted]
      });
      k++;
    }

    while (i < leftArr.length) {
      sorted[k] = leftArr[i];
      merges++;
      animationSteps.push({
        indices: [k],
        state: AnimationState.Swapping,
        values: [...sorted]
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      sorted[k] = rightArr[j];
      merges++;
      animationSteps.push({
        indices: [k],
        state: AnimationState.Swapping,
        values: [...sorted]
      });
      j++;
      k++;
    }

    for (let idx = left; idx <= right; idx++) {
      animationSteps.push({
        indices: [idx],
        state: AnimationState.Sorted,
        values: [...sorted]
      });
    }
  }

  /**
   * Recursive helper function that divides the array and calls merge
   * @param left - Starting index of subarray to sort
   * @param right - Ending index of subarray to sort
   */
  function mergeSortHelper(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }

  if (sorted.length > 0) {
    mergeSortHelper(0, sorted.length - 1);
  }

  return {
    sorted,
    animationSteps,
    comparisons,
    merges
  };
}
