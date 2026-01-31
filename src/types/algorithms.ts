// Core algorithm type definitions

export enum SortingAlgorithm {
  Bubble = 'bubble',
  Quick = 'quick',
  Merge = 'merge',
  Heap = 'heap'
}

export enum PathfindingAlgorithm {
  AStar = 'astar',
  Dijkstra = 'dijkstra',
  BFS = 'bfs',
  DFS = 'dfs'
}

export enum AlgorithmCategory {
  Sorting = 'sorting',
  Pathfinding = 'pathfinding'
}

export enum AnimationState {
  Comparing = 'comparing',
  Swapping = 'swapping',
  Sorted = 'sorted',
  Visiting = 'visiting',
  PathFound = 'path-found'
}

export interface AnimationStep {
  indices: number[];
  state: AnimationState;
  values?: number[];
}

export enum AnimationSpeed {
  Slow = 1000,
  Normal = 500,
  Fast = 100
}

export interface AlgorithmConfig {
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
}
