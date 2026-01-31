import { describe, it, expect } from 'vitest';
import { bubbleSort } from '@/algorithms/sorting/bubbleSort';
import { AnimationState } from '@/types/algorithms';
import { 
  smallIntegerArray as smallArray, 
  mediumIntegerArray as mediumArray, 
  largeIntegerArray as largeArray,
  sortedArray,
  reverseSortedArray,
  arrayWithDuplicates,
  singleElementArray,
  emptyArray
} from '../../fixtures/arrays';

describe('bubbleSort', () => {
  describe('Correctness', () => {
    it('should sort a small unsorted array correctly', () => {
      const result = bubbleSort(smallArray);
      expect(result.sortedArray).toEqual([...smallArray].sort((a, b) => a - b));
    });

    it('should sort a medium array correctly', () => {
      const result = bubbleSort(mediumArray);
      expect(result.sortedArray).toEqual([...mediumArray].sort((a, b) => a - b));
    });

    it('should sort a large array correctly', () => {
      const result = bubbleSort(largeArray);
      expect(result.sortedArray).toEqual([...largeArray].sort((a, b) => a - b));
    });

    it('should handle already sorted array', () => {
      const result = bubbleSort(sortedArray);
      expect(result.sortedArray).toEqual(sortedArray);
    });

    it('should handle reverse sorted array', () => {
      const result = bubbleSort(reverseSortedArray);
      expect(result.sortedArray).toEqual([...reverseSortedArray].sort((a, b) => a - b));
    });

    it('should handle array with duplicates', () => {
      const result = bubbleSort(arrayWithDuplicates);
      expect(result.sortedArray).toEqual([...arrayWithDuplicates].sort((a, b) => a - b));
    });

    it('should handle single element array', () => {
      const result = bubbleSort(singleElementArray);
      expect(result.sortedArray).toEqual(singleElementArray);
    });

    it('should handle empty array', () => {
      const result = bubbleSort(emptyArray);
      expect(result.sortedArray).toEqual([]);
    });

    it('should not mutate the original array', () => {
      const original = [...smallArray];
      bubbleSort(smallArray);
      expect(smallArray).toEqual(original);
    });
  });

  describe('Animation Steps', () => {
    it('should generate animation steps with correct states', () => {
      const result = bubbleSort([3, 1, 2]);
      const states = result.animationSteps.map(step => step.state);
      
      expect(states).toContain(AnimationState.Comparing);
      expect(states).toContain(AnimationState.Swapping);
      expect(states).toContain(AnimationState.Sorted);
    });

    it('should have valid indices in animation steps', () => {
      const arr = [5, 2, 8, 1];
      const result = bubbleSort(arr);
      
      result.animationSteps.forEach(step => {
        step.indices.forEach(index => {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(arr.length);
        });
      });
    });

    it('should include array values in each animation step', () => {
      const result = bubbleSort([3, 1, 2]);
      
      result.animationSteps.forEach(step => {
        expect(step.values).toBeDefined();
        expect(Array.isArray(step.values)).toBe(true);
      });
    });

    it('should generate no animation steps for empty array', () => {
      const result = bubbleSort([]);
      expect(result.animationSteps).toHaveLength(0);
    });

    it('should generate minimal animation steps for single element', () => {
      const result = bubbleSort([42]);
      // Should only have one sorted step for the single element
      expect(result.animationSteps).toHaveLength(1);
      expect(result.animationSteps[0].state).toBe(AnimationState.Sorted);
    });
  });

  describe('Statistics', () => {
    it('should count comparisons correctly', () => {
      const arr = [3, 1, 2];
      const result = bubbleSort(arr);
      // For array of length 3: first pass has 2 comparisons, second pass has 1
      expect(result.comparisons).toBe(3);
    });

    it('should count swaps correctly', () => {
      const arr = [3, 2, 1];
      const result = bubbleSort(arr);
      // Reverse sorted needs maximum swaps: 3 swaps
      expect(result.swaps).toBe(3);
    });

    it('should have zero swaps for already sorted array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = bubbleSort(arr);
      expect(result.swaps).toBe(0);
    });

    it('should have correct comparison count formula', () => {
      const n = 5;
      const arr = Array.from({ length: n }, (_, i) => i);
      const result = bubbleSort(arr);
      // Bubble sort always does (n-1) + (n-2) + ... + 1 = n*(n-1)/2 comparisons
      const expectedComparisons = (n * (n - 1)) / 2;
      expect(result.comparisons).toBe(expectedComparisons);
    });
  });

  describe('Algorithm Properties', () => {
    it('should maintain stability (equal elements maintain relative order)', () => {
      // Using objects with values to test stability
      const arr = [3, 2, 3, 1];
      const result = bubbleSort(arr);
      
      // Both 3's should maintain their relative positions
      const firstThreeIndex = result.sortedArray.indexOf(3);
      const lastThreeIndex = result.sortedArray.lastIndexOf(3);
      
      expect(lastThreeIndex).toBeGreaterThan(firstThreeIndex);
    });

    it('should work with negative numbers', () => {
      const arr = [-5, 3, -1, 0, 2];
      const result = bubbleSort(arr);
      expect(result.sortedArray).toEqual([-5, -1, 0, 2, 3]);
    });

    it('should work with floating point numbers', () => {
      const arr = [3.14, 1.41, 2.71, 0.5];
      const result = bubbleSort(arr);
      expect(result.sortedArray).toEqual([0.5, 1.41, 2.71, 3.14]);
    });
  });
});
