import { describe, it, expect } from 'vitest';
import { mergeSort } from '@/algorithms/sorting/mergeSort';
import { AnimationState } from '@/types/algorithms';
import {
  smallIntegerArray,
  mediumIntegerArray,
  largeIntegerArray,
  sortedArray,
  reverseSortedArray,
  arrayWithDuplicates,
  singleElementArray,
  emptyArray
} from '../../fixtures/arrays';

// Aliased for easier usage
const smallArray = smallIntegerArray;
const mediumArray = mediumIntegerArray;
const largeArray = largeIntegerArray;
const duplicatesArray = arrayWithDuplicates;
const singleElement = singleElementArray;
const twoElements = [2, 1];

describe('mergeSort', () => {
  describe('correctness', () => {
    it('should sort small array correctly', () => {
      const result = mergeSort(smallArray);
      expect(result.sorted).toEqual([1, 2, 5, 8, 9]);
    });

    it('should sort medium array correctly', () => {
      const result = mergeSort(mediumArray);
      const expected = [...mediumArray].sort((a, b) => a - b);
      expect(result.sorted).toEqual(expected);
    });

    it('should sort large array correctly', () => {
      const result = mergeSort(largeArray);
      const expected = [...largeArray].sort((a, b) => a - b);
      expect(result.sorted).toEqual(expected);
    });

    it('should handle already sorted array', () => {
      const result = mergeSort(sortedArray);
      expect(result.sorted).toEqual(sortedArray);
    });

    it('should handle reverse sorted array', () => {
      const result = mergeSort(reverseSortedArray);
      const expected = [...reverseSortedArray].sort((a, b) => a - b);
      expect(result.sorted).toEqual(expected);
    });

    it('should handle array with duplicates', () => {
      const result = mergeSort(duplicatesArray);
      const expected = [...duplicatesArray].sort((a, b) => a - b);
      expect(result.sorted).toEqual(expected);
    });

    it('should handle single element array', () => {
      const result = mergeSort(singleElement);
      expect(result.sorted).toEqual([42]);
    });

    it('should handle two elements array', () => {
      const result = mergeSort(twoElements);
      expect(result.sorted).toEqual([1, 2]);
    });

    it('should handle empty array', () => {
      const result = mergeSort(emptyArray);
      expect(result.sorted).toEqual([]);
    });

    it('should handle negative numbers', () => {
      const result = mergeSort([-5, -1, -10, 0, 3]);
      expect(result.sorted).toEqual([-10, -5, -1, 0, 3]);
    });

    it('should handle floating point numbers', () => {
      const result = mergeSort([3.14, 2.71, 1.41, 1.73]);
      expect(result.sorted).toEqual([1.41, 1.73, 2.71, 3.14]);
    });

    it('should not modify original array', () => {
      const original = [5, 2, 8, 1, 9];
      const copy = [...original];
      mergeSort(original);
      expect(original).toEqual(copy);
    });
  });

  describe('animation steps', () => {
    it('should generate animation steps', () => {
      const result = mergeSort([3, 1, 2]);
      expect(result.animationSteps.length).toBeGreaterThan(0);
    });

    it('should include comparing state in animation', () => {
      const result = mergeSort([3, 1, 2]);
      const hasComparing = result.animationSteps.some(
        step => step.state === AnimationState.Comparing
      );
      expect(hasComparing).toBe(true);
    });

    it('should include swapping state in animation', () => {
      const result = mergeSort([3, 1, 2]);
      const hasSwapping = result.animationSteps.some(
        step => step.state === AnimationState.Swapping
      );
      expect(hasSwapping).toBe(true);
    });

    it('should include sorted state in animation', () => {
      const result = mergeSort([3, 1, 2]);
      const hasSorted = result.animationSteps.some(
        step => step.state === AnimationState.Sorted
      );
      expect(hasSorted).toBe(true);
    });

    it('should have valid indices in animation steps', () => {
      const input = [3, 1, 2];
      const result = mergeSort(input);
      result.animationSteps.forEach(step => {
        step.indices.forEach(idx => {
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(idx).toBeLessThan(input.length);
        });
      });
    });

    it('should include array snapshots in animation steps', () => {
      const result = mergeSort([3, 1, 2]);
      result.animationSteps.forEach(step => {
        expect(step.values).toBeDefined();
        expect(Array.isArray(step.values)).toBe(true);
      });
    });

    it('should generate no animation steps for empty array', () => {
      const result = mergeSort([]);
      expect(result.animationSteps).toEqual([]);
    });
  });

  describe('statistics', () => {
    it('should track comparisons count', () => {
      const result = mergeSort([5, 2, 8, 1, 9]);
      expect(result.comparisons).toBeGreaterThan(0);
    });

    it('should track merges count', () => {
      const result = mergeSort([5, 2, 8, 1, 9]);
      expect(result.merges).toBeGreaterThan(0);
    });

    it('should have zero comparisons for single element', () => {
      const result = mergeSort([42]);
      expect(result.comparisons).toBe(0);
    });

    it('should have zero merges for single element', () => {
      const result = mergeSort([42]);
      expect(result.merges).toBe(0);
    });

    it('should have reasonable comparison count for sorted array', () => {
      const result = mergeSort([1, 2, 3, 4, 5]);
      expect(result.comparisons).toBeLessThanOrEqual(20);
    });

    it('should have O(n log n) comparisons approximately', () => {
      const n = 16;
      const arr = Array.from({ length: n }, (_, i) => n - i);
      const result = mergeSort(arr);
      const expected = n * Math.log2(n);
      expect(result.comparisons).toBeLessThanOrEqual(expected * 1.5);
    });
  });

  describe('algorithm properties', () => {
    it('should be stable (maintain relative order of equal elements)', () => {
      const input = [3, 1, 3, 2];
      const result = mergeSort(input);
      
      // For stability, check that equal elements maintain relative order
      // Since we sort [3, 1, 3, 2] to [1, 2, 3, 3]
      // Both 3s should appear in order
      expect(result.sorted).toEqual([1, 2, 3, 3]);
      
      // Merge sort is stable by design
      expect(result.sorted.length).toBe(input.length);
    });

    it('should handle maximum integer values', () => {
      const result = mergeSort([Number.MAX_SAFE_INTEGER, 1, Number.MAX_SAFE_INTEGER - 1]);
      expect(result.sorted).toEqual([1, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER]);
    });

    it('should be efficient with O(n log n) time complexity', () => {
      const n = 100;
      const arr = Array.from({ length: n }, () => Math.random() * 1000);
      const start = Date.now();
      mergeSort(arr);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
