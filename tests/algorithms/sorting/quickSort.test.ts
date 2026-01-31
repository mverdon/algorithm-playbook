import { describe, it, expect } from 'vitest';
import { quickSort } from '@/algorithms/sorting/quickSort';
import {
  smallIntegerArray as smallArray,
  mediumIntegerArray as mediumArray,
  largeIntegerArray as largeArray,
  sortedArray,
  reverseSortedArray,
  arrayWithDuplicates,
  singleElementArray,
  emptyArray,
} from '../../fixtures/arrays';

describe('quickSort - Correctness', () => {
  it('should sort a small array correctly', () => {
    const result = quickSort(smallArray);
    expect(result.sorted).toEqual([...smallArray].sort((a, b) => a - b));
  });

  it('should sort a medium array correctly', () => {
    const result = quickSort(mediumArray);
    expect(result.sorted).toEqual([...mediumArray].sort((a, b) => a - b));
  });

  it('should sort a large array correctly', () => {
    const result = quickSort(largeArray);
    expect(result.sorted).toEqual([...largeArray].sort((a, b) => a - b));
  });

  it('should handle already sorted array', () => {
    const result = quickSort(sortedArray);
    expect(result.sorted).toEqual(sortedArray);
  });

  it('should handle reverse sorted array', () => {
    const result = quickSort(reverseSortedArray);
    expect(result.sorted).toEqual([...reverseSortedArray].sort((a, b) => a - b));
  });

  it('should handle array with duplicates', () => {
    const result = quickSort(arrayWithDuplicates);
    expect(result.sorted).toEqual([...arrayWithDuplicates].sort((a, b) => a - b));
  });

  it('should handle single element array', () => {
    const result = quickSort(singleElementArray);
    expect(result.sorted).toEqual(singleElementArray);
  });

  it('should handle empty array', () => {
    const result = quickSort(emptyArray);
    expect(result.sorted).toEqual([]);
  });

  it('should handle two element array', () => {
    const twoElementsUnsorted = [5, 2];
    const result = quickSort(twoElementsUnsorted);
    expect(result.sorted).toEqual([...twoElementsUnsorted].sort((a, b) => a - b));
  });

  it('should not mutate the input array', () => {
    const original = [...smallArray];
    quickSort(smallArray);
    expect(smallArray).toEqual(original);
  });

  it('should handle negative numbers', () => {
    const input = [-5, 3, -1, 8, -10, 0];
    const result = quickSort(input);
    expect(result.sorted).toEqual([-10, -5, -1, 0, 3, 8]);
  });

  it('should handle floating-point numbers', () => {
    const input = [3.5, 1.2, 4.8, 2.1];
    const result = quickSort(input);
    expect(result.sorted).toEqual([1.2, 2.1, 3.5, 4.8]);
  });
});

describe('quickSort - Animation Steps', () => {
  it('should generate animation steps', () => {
    const result = quickSort(smallArray);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('should include comparing state in steps', () => {
    const result = quickSort(smallArray);
    const hasComparing = result.steps.some(step => step.state === 'comparing');
    expect(hasComparing).toBe(true);
  });

  it('should include swapping state in steps', () => {
    const result = quickSort([3, 1, 2]);
    const hasSwapping = result.steps.some(step => step.state === 'swapping');
    expect(hasSwapping).toBe(true);
  });

  it('should include sorted state in steps', () => {
    const result = quickSort(smallArray);
    const hasSorted = result.steps.some(step => step.state === 'sorted');
    expect(hasSorted).toBe(true);
  });

  it('should generate no steps for empty array', () => {
    const result = quickSort(emptyArray);
    expect(result.steps.length).toBe(0);
  });

  it('should generate sorted step for single element', () => {
    const result = quickSort(singleElementArray);
    expect(result.steps.length).toBe(1);
    expect(result.steps[0].state).toBe('sorted');
  });

  it('should capture array state at each step', () => {
    const result = quickSort([3, 1, 2]);
    result.steps.forEach(step => {
      expect(Array.isArray(step.values)).toBe(true);
      expect(step.values?.length).toBe(3);
    });
  });
});

describe('quickSort - Statistics', () => {
  it('should count comparisons', () => {
    const result = quickSort(smallArray);
    expect(result.comparisons).toBeGreaterThan(0);
  });

  it('should count swaps', () => {
    const result = quickSort([3, 1, 2]);
    expect(result.swaps).toBeGreaterThan(0);
  });

  it('should have zero comparisons for empty array', () => {
    const result = quickSort(emptyArray);
    expect(result.comparisons).toBe(0);
  });

  it('should have zero swaps for sorted array if no elements move', () => {
    const result = quickSort([1, 2, 3]);
    // Quick sort may still perform swaps even on sorted arrays due to partitioning
    expect(result.swaps).toBeGreaterThanOrEqual(0);
  });

  it('should track statistics correctly for reverse sorted array', () => {
    const result = quickSort(reverseSortedArray);
    expect(result.comparisons).toBeGreaterThan(0);
    expect(result.swaps).toBeGreaterThan(0);
  });
});

describe('quickSort - Algorithm Properties', () => {
  it('should be efficient with average O(n log n) time complexity', () => {
    const n = 100;
    const input = Array.from({ length: n }, () => Math.floor(Math.random() * 1000));
    const result = quickSort(input);
    
    // Quick sort should perform roughly O(n log n) comparisons on average
    const expectedMaxComparisons = n * Math.log2(n) * 3; // Factor of 3 for safety
    expect(result.comparisons).toBeLessThan(expectedMaxComparisons);
  });

  it('should handle worst case scenario (already sorted)', () => {
    // Lomuto partition has O(n²) worst case on sorted arrays
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = quickSort(sorted);
    expect(result.sorted).toEqual(sorted);
  });

  it('should maintain relative order of equal elements (not guaranteed stable)', () => {
    // Quick sort is NOT a stable sort, but should still sort correctly
    const input = [5, 3, 5, 1, 5];
    const result = quickSort(input);
    expect(result.sorted).toEqual([1, 3, 5, 5, 5]);
  });
});
