import type { Grid, PathfindingResult, GridAnimationStep, Position } from '@/types/grid';
import { NodeState } from '@/types/grid';
import { getNeighbors, reconstructPath, clearGrid } from './gridUtils';

/**
 * Breadth-First Search (BFS) pathfinding algorithm
 * 
 * Explores nodes in a level-by-level manner using a queue (FIFO).
 * Guarantees the shortest path in unweighted grids by visiting all nodes
 * at distance k before visiting any node at distance k+1.
 * 
 * Time Complexity: O(V + E) where V is vertices and E is edges
 * Space Complexity: O(V) for the queue and visited set
 * 
 * @param grid - The grid to search for a path
 * @returns PathfindingResult containing the path, visited nodes, distance, and success status
 * 
 * @example
 * ```typescript
 * const result = bfs(grid);
 * if (result.success) {
 *   console.log(`Found path of length ${result.distance}`);
 *   console.log(`Visited ${result.visitedNodes.length} nodes`);
 * }
 * ```
 */
export function bfs(grid: Grid): PathfindingResult {
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
  
  // Queue for BFS (FIFO)
  const queue: Position[] = [startPos];
  
  // Track visited nodes
  const visitedNodes: Position[] = [];
  const visited = new Set<string>();
  visited.add(`${startPos.row},${startPos.col}`);
  
  while (queue.length > 0) {
    const currentPos = queue.shift()!;
    const currentNode = workingGrid[currentPos.row][currentPos.col];
    visitedNodes.push(currentPos);
    
    // Found the end node
    if (currentNode.isEnd) {
      const path = reconstructPath(workingGrid, endPos);
      return {
        path,
        visitedNodes,
        distance: currentNode.distance,
        success: true
      };
    }
    
    // Explore neighbors
    const neighbors = getNeighbors(workingGrid, currentPos);
    
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.position.row},${neighbor.position.col}`;
      
      // Skip walls and already visited nodes
      if (neighbor.isWall || visited.has(neighborKey)) {
        continue;
      }
      
      visited.add(neighborKey);
      
      // Update neighbor
      neighbor.distance = currentNode.distance + 1;
      neighbor.parent = currentPos;
      
      queue.push(neighbor.position);
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
 * BFS pathfinding algorithm with animation step generation
 * Yields animation steps for visualization
 */
export function* bfsAnimated(grid: Grid): Generator<GridAnimationStep> {
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
  
  // Queue for BFS (FIFO)
  const queue: Position[] = [startPos];
  
  // Track visited nodes
  const visited = new Set<string>();
  visited.add(`${startPos.row},${startPos.col}`);
  
  while (queue.length > 0) {
    const currentPos = queue.shift()!;
    const currentNode = workingGrid[currentPos.row][currentPos.col];
    
    // Yield current node as visited
    yield {
      position: currentPos,
      state: NodeState.Visited,
      distance: currentNode.distance
    };
    
    // Found the end node
    if (currentNode.isEnd) {
      const path = reconstructPath(workingGrid, endPos);
      
      // Yield path nodes
      for (const pos of path) {
        if (pos.row !== startPos.row || pos.col !== startPos.col) {
          if (pos.row !== endPos.row || pos.col !== endPos.col) {
            yield {
              position: pos,
              state: NodeState.Path,
              distance: workingGrid[pos.row][pos.col].distance
            };
          }
        }
      }
      
      return;
    }
    
    // Explore neighbors
    const neighbors = getNeighbors(workingGrid, currentPos);
    
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.position.row},${neighbor.position.col}`;
      
      // Skip walls and already visited nodes
      if (neighbor.isWall || visited.has(neighborKey)) {
        continue;
      }
      
      visited.add(neighborKey);
      
      // Update neighbor
      neighbor.distance = currentNode.distance + 1;
      neighbor.parent = currentPos;
      
      queue.push(neighbor.position);
      
      // Yield neighbor as visiting
      yield {
        position: neighbor.position,
        state: NodeState.Visiting,
        distance: neighbor.distance
      };
    }
  }
}
