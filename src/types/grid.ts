// Grid and node types for pathfinding algorithms

export interface Position {
  row: number;
  col: number;
}

export enum NodeState {
  Default = 'default',
  Start = 'start',
  End = 'end',
  Wall = 'wall',
  Visiting = 'visiting',
  Visited = 'visited',
  Path = 'path'
}

export interface GridNode {
  position: Position;
  state: NodeState;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  distance: number;
  heuristic: number;
  totalCost: number;
  parent: Position | null;
}

export type Grid = GridNode[][];

export interface GridConfig {
  rows: number;
  cols: number;
  startPos: Position;
  endPos: Position;
}

export interface PathfindingResult {
  path: Position[];
  visitedNodes: Position[];
  distance: number;
  success: boolean;
}

export interface GridAnimationStep {
  position: Position;
  state: NodeState;
  distance?: number;
  heuristic?: number;
}

export interface GridAnimationStepWithGrid extends GridAnimationStep {
  grid: Grid;
}
