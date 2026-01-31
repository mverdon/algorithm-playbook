import type { Grid, GridNode, GridConfig, Position, NodeState } from '@/types/grid';

/**
 * Creates a new grid with the specified configuration
 * 
 * Initializes a 2D grid of nodes with default properties. Start and end nodes
 * are positioned according to the configuration. All nodes begin with default
 * state and infinite distance values.
 * 
 * @param config - Grid configuration with dimensions and start/end positions
 * @returns A newly initialized 2D grid
 * 
 * @example
 * ```typescript
 * const grid = createGrid({
 *   rows: 20,
 *   cols: 50,
 *   startPos: { row: 10, col: 5 },
 *   endPos: { row: 10, col: 45 }
 * });
 * ```
 */
export function createGrid(config: GridConfig): Grid {
  const { rows, cols, startPos, endPos } = config;
  const grid: Grid = [];

  for (let row = 0; row < rows; row++) {
    const gridRow: GridNode[] = [];
    for (let col = 0; col < cols; col++) {
      const isStart = row === startPos.row && col === startPos.col;
      const isEnd = row === endPos.row && col === endPos.col;
      
      gridRow.push({
        position: { row, col },
        state: isStart ? 'start' as NodeState : isEnd ? 'end' as NodeState : 'default' as NodeState,
        isWall: false,
        isStart,
        isEnd,
        distance: Infinity,
        heuristic: 0,
        totalCost: Infinity,
        parent: null
      });
    }
    grid.push(gridRow);
  }

  return grid;
}

/**
 * Toggles a wall at the specified position
 * 
 * Creates a new grid with the wall state toggled at the given position.
 * Start and end nodes cannot be converted to walls. The function returns
 * a new grid instance without mutating the original.
 * 
 * @param grid - The current grid state
 * @param position - Position where the wall should be toggled
 * @returns A new grid with the wall toggled
 * 
 * @example
 * ```typescript
 * const newGrid = toggleWall(currentGrid, { row: 5, col: 10 });
 * ```
 */
export function toggleWall(grid: Grid, position: Position): Grid {
  const newGrid = grid.map(row => row.map(node => ({ ...node })));
  const node = newGrid[position.row][position.col];
  
  // Don't allow toggling start or end nodes
  if (node.isStart || node.isEnd) {
    return newGrid;
  }
  
  node.isWall = !node.isWall;
  node.state = node.isWall ? 'wall' as NodeState : 'default' as NodeState;
  
  return newGrid;
}

/**
 * Sets the start node position
 * 
 * Moves the start node to a new position. The previous start node is reverted
 * to default state. If the target position is a wall, the wall is removed.
 * Returns a new grid instance without mutating the original.
 * 
 * @param grid - The current grid state
 * @param position - New position for the start node
 * @returns A new grid with the start node repositioned
 * 
 * @example
 * ```typescript
 * const newGrid = setStartNode(currentGrid, { row: 5, col: 5 });
 * ```
 */
export function setStartNode(grid: Grid, position: Position): Grid {
  const newGrid = grid.map(row => row.map(node => ({ ...node })));
  
  // Clear previous start node
  for (const row of newGrid) {
    for (const node of row) {
      if (node.isStart) {
        node.isStart = false;
        node.state = 'default' as NodeState;
      }
    }
  }
  
  // Set new start node
  const node = newGrid[position.row][position.col];
  node.isStart = true;
  node.state = 'start' as NodeState;
  node.isWall = false; // Remove wall if present
  
  return newGrid;
}

/**
 * Sets the end node position
 * 
 * Moves the end node to a new position. The previous end node is reverted
 * to default state. If the target position is a wall, the wall is removed.
 * Returns a new grid instance without mutating the original.
 * 
 * @param grid - The current grid state
 * @param position - New position for the end node
 * @returns A new grid with the end node repositioned
 * 
 * @example
 * ```typescript
 * const newGrid = setEndNode(currentGrid, { row: 15, col: 45 });
 * ```
 */
export function setEndNode(grid: Grid, position: Position): Grid {
  const newGrid = grid.map(row => row.map(node => ({ ...node })));
  
  // Clear previous end node
  for (const row of newGrid) {
    for (const node of row) {
      if (node.isEnd) {
        node.isEnd = false;
        node.state = 'default' as NodeState;
      }
    }
  }
  
  // Set new end node
  const node = newGrid[position.row][position.col];
  node.isEnd = true;
  node.state = 'end' as NodeState;
  node.isWall = false; // Remove wall if present
  
  return newGrid;
}

/**
 * Clears the grid, resetting all nodes except walls, start, and end
 * 
 * Resets all pathfinding-related properties (distance, heuristic, totalCost, parent)
 * while preserving the grid structure, walls, start, and end positions. This is
 * useful for running a new pathfinding algorithm without recreating the grid.
 * 
 * @param grid - The current grid state
 * @returns A new grid with pathfinding properties reset
 * 
 * @example
 * ```typescript
 * const cleanGrid = clearGrid(gridWithPreviousPath);
 * ```
 */
export function clearGrid(grid: Grid): Grid {
  return grid.map(row => 
    row.map(node => ({
      ...node,
      state: node.isStart ? 'start' as NodeState : 
             node.isEnd ? 'end' as NodeState : 
             node.isWall ? 'wall' as NodeState : 
             'default' as NodeState,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      parent: null
    }))
  );
}

/**
 * Resets the entire grid to default state
 * 
 * Creates a completely new grid from scratch using the provided configuration.
 * All walls and pathfinding data are cleared, returning to initial state.
 * 
 * @param config - Grid configuration with dimensions and start/end positions
 * @returns A completely reset grid
 * 
 * @example
 * ```typescript
 * const freshGrid = resetGrid(gridConfig);
 * ```
 */
export function resetGrid(config: GridConfig): Grid {
  return createGrid(config);
}

/**
 * Gets neighbors of a node (up, down, left, right)
 * 
 * Returns all valid neighbors in the four cardinal directions. Diagonal
 * movement is not included. Neighbors are returned in the order: up, down,
 * left, right. Only positions within grid bounds are returned.
 * 
 * @param grid - The grid to search for neighbors
 * @param position - Position of the node whose neighbors to find
 * @returns Array of neighboring nodes
 * 
 * @example
 * ```typescript
 * const neighbors = getNeighbors(grid, { row: 5, col: 10 });
 * // Returns up to 4 neighbors (or fewer at grid edges)
 * ```
 */
export function getNeighbors(grid: Grid, position: Position): GridNode[] {
  const { row, col } = position;
  const neighbors: GridNode[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;
    
    if (newRow >= 0 && newRow < grid.length && 
        newCol >= 0 && newCol < grid[0].length) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
}

/**
 * Calculates Manhattan distance between two positions
 * 
 * Computes the L1 distance (sum of absolute differences in coordinates).
 * This is an admissible heuristic for grid-based pathfinding with 4-directional
 * movement, making it suitable for A* algorithm.
 * 
 * @param pos1 - First position
 * @param pos2 - Second position
 * @returns The Manhattan distance between the two positions
 * 
 * @example
 * ```typescript
 * const distance = manhattanDistance({ row: 0, col: 0 }, { row: 3, col: 4 });
 * // Returns 7 (3 + 4)
 * ```
 */
export function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}

/**
 * Reconstructs the path from start to end using parent pointers
 * 
 * Traces back from the end node to the start node using the parent pointers
 * set during pathfinding. Returns positions in order from start to end.
 * 
 * @param grid - The grid containing nodes with parent pointers
 * @param endPos - Position of the end node
 * @returns Array of positions representing the path from start to end
 * 
 * @example
 * ```typescript
 * const path = reconstructPath(grid, endPosition);
 * // Returns [startPos, ..., endPos]
 * ```
 */
export function reconstructPath(grid: Grid, endPos: Position): Position[] {
  const path: Position[] = [];
  let currentPos: Position | null = endPos;

  while (currentPos !== null) {
    path.unshift(currentPos);
    const node: GridNode = grid[currentPos.row][currentPos.col];
    currentPos = node.parent;
  }

  return path;
}
