// Test fixtures for array-based sorting algorithms

export const smallIntegerArray = [5, 2, 8, 1, 9];

export const mediumIntegerArray = [
  64, 34, 25, 12, 22, 11, 90, 88, 45, 50,
  23, 67, 89, 33, 78, 56, 44, 99, 10, 3
];

export const largeIntegerArray = Array.from({ length: 100 }, (_, i) => 
  Math.floor(Math.random() * 1000)
);

export const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const reverseSortedArray = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export const arrayWithDuplicates = [5, 2, 8, 2, 9, 5, 1, 8];

export const singleElementArray = [42];

export const emptyArray: number[] = [];
