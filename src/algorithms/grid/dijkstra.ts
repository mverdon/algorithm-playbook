import type { Grid, PathfindingResult, GridAnimationStep, Position } from '@/types/grid';
import { NodeState } from '@/types/grid';
import { getNeighbors, reconstructPath, clearGrid } from './gridUtils';

/**
 * Priority queue implementation for Dijkstra algorithm
 * 
 * Simple priority queue using an array with linear insertion.
 * Elements are dequeued in order of lowest priority first.
 * 
 * @template T - Type of elements stored in the queue
 */
class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number): void {
    const item = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (item.priority < this.items[i].priority) {
        this.items.splice(i, 0, item);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(item);
    }
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

/**
 * Dijkstra's pathfinding algorithm implementation
 * 
 * Finds the shortest path from start to end using a greedy approach based on
 * cumulative distance. Unlike A*, this algorithm does not use a heuristic,
 * exploring nodes in order of their distance from the start node.
 * 
 * Guarantees the shortest path in weighted and unweighted graphs.
 * 
 * Time Complexity: O((V + E) log V) with a proper priority queue
 * Space Complexity: O(V) for the open set and closed set
 * 
 * @param grid - The grid to search for a path
 * @returns PathfindingResult containing the path, visited nodes, distance, and success status
 * 
 * @example
 * ```typescript
 * const result = dijkstra(grid);
 * if (result.success) {
 *   console.log(`Shortest path found with distance ${result.distance}`);
 *   console.log(`Explored ${result.visitedNodes.length} nodes`);
 * }
 * ```
 */
export function dijkstra(grid: Grid): PathfindingResult {
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
  
  // Priority queue for open set (nodes to explore)
  const openSet = new PriorityQueue<Position>();
  openSet.enqueue(startPos, 0);
  
  // Track visited nodes
  const visitedNodes: Position[] = [];
  const closedSet = new Set<string>();
  
  while (!openSet.isEmpty()) {
    const currentPos = openSet.dequeue()!;
    const posKey = `${currentPos.row},${currentPos.col}`;
    
    // Skip if already processed
    if (closedSet.has(posKey)) {
      continue;
    }
    
    closedSet.add(posKey);
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
      // Skip walls and already visited nodes
      if (neighbor.isWall || closedSet.has(`${neighbor.position.row},${neighbor.position.col}`)) {
        continue;
      }
      
      const tentativeDistance = currentNode.distance + 1;
      
      // Update if we found a better path
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.parent = currentPos;
        
        openSet.enqueue(neighbor.position, neighbor.distance);
      }
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
 * Dijkstra pathfinding algorithm with animation step generation
 * Yields animation steps for visualization
 */
export function* dijkstraAnimated(grid: Grid): Generator<GridAnimationStep> {
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
  
  // Priority queue for open set
  const openSet = new PriorityQueue<Position>();
  openSet.enqueue(startPos, 0);
  
  const closedSet = new Set<string>();
  
  while (!openSet.isEmpty()) {
    const currentPos = openSet.dequeue()!;
    const posKey = `${currentPos.row},${currentPos.col}`;
    
    // Skip if already processed
    if (closedSet.has(posKey)) {
      continue;
    }
    
    closedSet.add(posKey);
    const currentNode = workingGrid[currentPos.row][currentPos.col];
    
    // Yield visiting step (only if not start/end node)
    if (!currentNode.isStart && !currentNode.isEnd) {
      yield {
        position: currentPos,
        state: NodeState.Visiting,
        distance: currentNode.distance
      };
    }
    
    // Found the end node
    if (currentNode.isEnd) {
      const path = reconstructPath(workingGrid, endPos);
      
      // Yield path reconstruction steps
      for (const pathPos of path) {
        const pathNode = workingGrid[pathPos.row][pathPos.col];
        if (!pathNode.isStart && !pathNode.isEnd) {
          yield {
            position: pathPos,
            state: NodeState.Path,
            distance: pathNode.distance
          };
        }
      }
      
      return;
    }
    
    // Mark as visited (only if not start/end node)
    if (!currentNode.isStart && !currentNode.isEnd) {
      yield {
        position: currentPos,
        state: NodeState.Visited,
        distance: currentNode.distance
      };
    }
    
    // Explore neighbors
    const neighbors = getNeighbors(workingGrid, currentPos);
    
    for (const neighbor of neighbors) {
      // Skip walls and already visited nodes
      if (neighbor.isWall || closedSet.has(`${neighbor.position.row},${neighbor.position.col}`)) {
        continue;
      }
      
      const tentativeDistance = currentNode.distance + 1;
      
      // Update if we found a better path
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.parent = currentPos;
        
        openSet.enqueue(neighbor.position, neighbor.distance);
      }
    }
  }
}
