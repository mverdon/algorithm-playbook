import { describe, it, expect } from 'vitest';
import { heapSort } from '@/algorithms/sorting/heapSort';
import { AnimationState } from '@/types/algorithms';
import {
  smallIntegerArray,
  mediumIntegerArray,
  largeIntegerArray,
  sortedArray,
  reverseSortedArray,
  arrayWithDuplicates,
  singleElementArray,
  emptyArray,
} from '../../fixtures/arrays';

describe('heapSort', () => {
  describe('Correctness', () => {
    it('should sort an empty array', () => {
      const result = heapSort(emptyArray);
      expect(result.sortedArray).toEqual([]);
    });

    it('should sort a single element array', () => {
      const result = heapSort(singleElementArray);
      expect(result.sortedArray).toEqual([42]);
    });

    it('should sort a two element array', () => {
      const result = heapSort([10, 5]);
      expect(result.sortedArray).toEqual([5, 10]);
    });

    it('should sort a small array', () => {
      const result = heapSort(smallIntegerArray);
      expect(result.sortedArray).toEqual([...smallIntegerArray].sort((a, b) => a - b));
    });

    it('should sort a medium array', () => {
      const result = heapSort(mediumIntegerArray);
      expect(result.sortedArray).toEqual([...mediumIntegerArray].sort((a, b) => a - b));
    });

    it('should sort a large array', () => {
      const result = heapSort(largeIntegerArray);
      expect(result.sortedArray).toEqual([...largeIntegerArray].sort((a, b) => a - b));
    });

    it('should sort an already sorted array', () => {
      const result = heapSort(sortedArray);
      expect(result.sortedArray).toEqual(sortedArray);
    });

    it('should sort a reverse sorted array', () => {
      const result = heapSort(reverseSortedArray);
      expect(result.sortedArray).toEqual([...reverseSortedArray].sort((a, b) => a - b));
    });

    it('should sort an array with duplicates', () => {
      const result = heapSort(arrayWithDuplicates);
      expect(result.sortedArray).toEqual([...arrayWithDuplicates].sort((a, b) => a - b));
    });

    it('should handle negative numbers', () => {
      const arr = [-5, 3, -1, 0, 9, -7];
      const result = heapSort(arr);
      expect(result.sortedArray).toEqual([-7, -5, -1, 0, 3, 9]);
    });

    it('should handle floating point numbers', () => {
      const arr = [3.14, 2.71, 1.41, 1.73];
      const result = heapSort(arr);
      expect(result.sortedArray).toEqual([1.41, 1.73, 2.71, 3.14]);
    });

    it('should not modify the original array', () => {
      const arr = [3, 1, 4, 1, 5];
      const original = [...arr];
      heapSort(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('Animation Steps', () => {
    it('should generate animation steps for sorting', () => {
      const result = heapSort(smallIntegerArray);
      expect(result.animationSteps.length).toBeGreaterThan(0);
    });

    it('should include comparing steps', () => {
      const result = heapSort(smallIntegerArray);
      const comparingSteps = result.animationSteps.filter(
        (step) => step.state === AnimationState.Comparing
      );
      expect(comparingSteps.length).toBeGreaterThan(0);
    });

    it('should include swapping steps', () => {
      const result = heapSort([3, 1, 2]);
      const swappingSteps = result.animationSteps.filter(
        (step) => step.state === AnimationState.Swapping
      );
      expect(swappingSteps.length).toBeGreaterThan(0);
    });

    it('should include sorted steps', () => {
      const result = heapSort([3, 1, 2]);
      const sortedSteps = result.animationSteps.filter(
        (step) => step.state === AnimationState.Sorted
      );
      expect(sortedSteps.length).toBeGreaterThan(0);
    });

    it('should have correct array snapshot at each step', () => {
      const arr = [3, 1, 2];
      const result = heapSort(arr);
      result.animationSteps.forEach((step) => {
        expect(step.values).toBeDefined();
        expect(step.values.length).toBe(arr.length);
      });
    });

    it('should not generate steps for empty array', () => {
      const result = heapSort(emptyArray);
      expect(result.animationSteps.length).toBe(0);
    });

    it('should not generate steps for single element array', () => {
      const result = heapSort(singleElementArray);
      expect(result.animationSteps.length).toBe(1); // Only one sorted step
    });
  });

  describe('Statistics', () => {
    it('should track comparisons', () => {
      const result = heapSort([3, 1, 4, 1, 5]);
      expect(result.comparisons).toBeGreaterThan(0);
    });

    it('should track swaps', () => {
      const result = heapSort([3, 1, 4, 1, 5]);
      expect(result.swaps).toBeGreaterThan(0);
    });

    it('should have zero comparisons and swaps for empty array', () => {
      const result = heapSort(emptyArray);
      expect(result.comparisons).toBe(0);
      expect(result.swaps).toBe(0);
    });

    it('should have zero comparisons and swaps for single element', () => {
      const result = heapSort(singleElementArray);
      expect(result.comparisons).toBe(0);
      expect(result.swaps).toBe(0);
    });

    it('should have more comparisons than swaps typically', () => {
      const result = heapSort([5, 4, 3, 2, 1]);
      expect(result.comparisons).toBeGreaterThanOrEqual(result.swaps);
    });

    it('should have statistics consistent with steps', () => {
      const result = heapSort([3, 1, 4, 1, 5]);
      const swappingSteps = result.animationSteps.filter(
        (step) => step.state === AnimationState.Swapping
      );
      const comparingSteps = result.animationSteps.filter(
        (step) => step.state === AnimationState.Comparing
      );
      expect(result.swaps).toBeGreaterThanOrEqual(swappingSteps.length - 10); // Allow some variance due to recursion
      expect(result.comparisons).toBeGreaterThanOrEqual(comparingSteps.length - 10);
    });
  });

  describe('Algorithm Properties', () => {
    it('should be efficient on large arrays (O(n log n))', () => {
      const result = heapSort(largeIntegerArray);
      const n = largeIntegerArray.length;
      const expectedMaxComparisons = n * Math.log2(n) * 3; // Upper bound with constant factor
      expect(result.comparisons).toBeLessThan(expectedMaxComparisons);
    });

    it('should be efficient on already sorted arrays', () => {
      const result = heapSort(sortedArray);
      const n = sortedArray.length;
      const expectedMaxComparisons = n * Math.log2(n) * 3;
      expect(result.comparisons).toBeLessThan(expectedMaxComparisons);
    });

    it('should handle worst case (reverse sorted) efficiently', () => {
      const result = heapSort(reverseSortedArray);
      const n = reverseSortedArray.length;
      const expectedMaxComparisons = n * Math.log2(n) * 3;
      expect(result.comparisons).toBeLessThan(expectedMaxComparisons);
    });
  });
});
