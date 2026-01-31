import type { Grid, PathfindingResult, GridAnimationStep, Position } from '@/types/grid';
import { NodeState } from '@/types/grid';
import { getNeighbors, reconstructPath, clearGrid } from './gridUtils';

/**
 * Depth-First Search (DFS) pathfinding algorithm
 * 
 * Explores nodes by going as deep as possible along each branch before backtracking.
 * Uses a stack (LIFO) for traversal. This algorithm explores paths exhaustively
 * but does NOT guarantee the shortest path will be found first.
 * 
 * Time Complexity: O(V + E) where V is vertices and E is edges
 * Space Complexity: O(V) for the stack and visited set
 * 
 * Note: DFS does NOT guarantee the shortest path. Use BFS, Dijkstra, or A* for optimal paths.
 * 
 * @param grid - The grid to search for a path
 * @returns PathfindingResult containing the path, visited nodes, distance, and success status
 * 
 * @example
 * ```typescript
 * const result = dfs(grid);
 * if (result.success) {
 *   console.log(`Found a path (not necessarily shortest)`);
 *   console.log(`Path length: ${result.distance}`);
 * }
 * ```
 */
export function dfs(grid: Grid): PathfindingResult {
  // Create a working copy of the grid
  const workingGrid = clearGrid(grid);
  
  // Find start and end nodes
  let startPos: Position | null = null;
  let endPos: Position | null = null;
  
  for (let row = 0; row < workingGrid.length; row++) {
    for (let col = 0; col < workingGrid[0].length; col++) {
      const node = workingGrid[row][col];
      if (node.isStart) startPos = node.position;
      if (node.isEnd) endPos = node.position;
    }
  }
  
  if (!startPos || !endPos) {
    return {
      path: [],
      visitedNodes: [],
      distance: Infinity,
      success: false
    };
  }
  
  // Initialize start node
  const startNode = workingGrid[startPos.row][startPos.col];
  startNode.distance = 0;
  
  // Stack for DFS (LIFO)
  const stack: Position[] = [startPos];
  
  // Track visited nodes
  const visitedNodes: Position[] = [];
  const visited = new Set<string>();
  visited.add(`${startPos.row},${startPos.col}`);
  
  while (stack.length > 0) {
    const currentPos = stack.pop()!;
    const currentNode = workingGrid[currentPos.row][currentPos.col];
    visitedNodes.push(currentPos);
    
    // Found the end node
    if (currentNode.isEnd) {
      const path = reconstructPath(workingGrid, endPos);
      return {
        path,
        visitedNodes,
        distance: path.length - 1,
        success: true
      };
    }
    
    // Get neighbors (in reverse order for consistent DFS behavior)
    const neighbors = getNeighbors(workingGrid, currentPos);
    
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const neighborKey = `${neighbor.position.row},${neighbor.position.col}`;
      
      // Skip walls and already visited nodes
      if (neighbor.isWall || visited.has(neighborKey)) {
        continue;
      }
      
      visited.add(neighborKey);
      
      // Update neighbor
      neighbor.distance = currentNode.distance + 1;
      neighbor.parent = currentPos;
      
      stack.push(neighbor.position);
    }
  }
  
  // No path found
  return {
    path: [],
    visitedNodes,
    distance: Infinity,
    success: false
  };
}

/**
 * DFS with animation generation
 * Yields animation steps for visualization
 */
export function* dfsAnimated(grid: Grid): Generator<GridAnimationStep> {
  // Create a working copy of the grid
  const workingGrid = clearGrid(grid);
  
  // Find start and end nodes
  let startPos: Position | null = null;
  let endPos: Position | null = null;
  
  for (let row = 0; row < workingGrid.length; row++) {
    for (let col = 0; col < workingGrid[0].length; col++) {
      const node = workingGrid[row][col];
      if (node.isStart) startPos = node.position;
      if (node.isEnd) endPos = node.position;
    }
  }
  
  if (!startPos || !endPos) {
    return;
  }
  
  // Initialize start node
  const startNode = workingGrid[startPos.row][startPos.col];
  startNode.distance = 0;
  
  // Stack for DFS (LIFO)
  const stack: Position[] = [startPos];
  
  // Track visited nodes
  const visited = new Set<string>();
  visited.add(`${startPos.row},${startPos.col}`);
  
  while (stack.length > 0) {
    const currentPos = stack.pop()!;
    const currentNode = workingGrid[currentPos.row][currentPos.col];
    
    // Yield visiting state
    yield {
      position: currentPos,
      state: NodeState.Visiting,
      distance: currentNode.distance
    };
    
    // Yield visited state
    yield {
      position: currentPos,
      state: NodeState.Visited,
      distance: currentNode.distance
    };
    
    // Found the end node
    if (currentNode.isEnd) {
      const path = reconstructPath(workingGrid, endPos);
      
      // Yield path
      for (const pos of path) {
        const pathNode = workingGrid[pos.row][pos.col];
        if (!pathNode.isStart && !pathNode.isEnd) {
          yield {
            position: pos,
            state: NodeState.Path,
            distance: pathNode.distance
          };
        }
      }
      
      return;
    }
    
    // Get neighbors (in reverse order for consistent DFS behavior)
    const neighbors = getNeighbors(workingGrid, currentPos);
    
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const neighborKey = `${neighbor.position.row},${neighbor.position.col}`;
      
      // Skip walls and already visited nodes
      if (neighbor.isWall || visited.has(neighborKey)) {
        continue;
      }
      
      visited.add(neighborKey);
      
      // Update neighbor
      neighbor.distance = currentNode.distance + 1;
      neighbor.parent = currentPos;
      
      stack.push(neighbor.position);
    }
  }
}
