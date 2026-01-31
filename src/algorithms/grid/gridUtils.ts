import type { Grid, GridNode, GridConfig, Position, NodeState } from '@/types/grid';

/**
 * Creates a new grid with the specified configuration
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
 */
export function resetGrid(config: GridConfig): Grid {
  return createGrid(config);
}

/**
 * Gets neighbors of a node (up, down, left, right)
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
 */
export function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}

/**
 * Reconstructs the path from start to end using parent pointers
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
