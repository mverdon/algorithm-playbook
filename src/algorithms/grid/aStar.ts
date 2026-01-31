import type { Grid, PathfindingResult, GridAnimationStep, Position } from '@/types/grid';
import { NodeState } from '@/types/grid';
import { getNeighbors, manhattanDistance, reconstructPath, clearGrid } from './gridUtils';

/**
 * Priority queue implementation for A* algorithm
 * 
 * Simple priority queue using an array with linear insertion.
 * Elements are dequeued in order of lowest priority (f-score) first.
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
 * A* (A-Star) pathfinding algorithm implementation
 * 
 * Finds the shortest path from start to end using a combination of actual distance
 * and a heuristic estimate. Uses Manhattan distance as the heuristic, which is
 * admissible for 4-directional grid movement.
 * 
 * The algorithm maintains an f-score = g-score + h-score where:
 * - g-score: actual distance from start
 * - h-score: heuristic estimate to goal (Manhattan distance)
 * - f-score: total estimated cost
 * 
 * A* is optimal (finds shortest path) when the heuristic is admissible.
 * 
 * Time Complexity: O((V + E) log V) with a proper priority queue
 * Space Complexity: O(V) for the open set and closed set
 * 
 * @param grid - The grid to search for a path
 * @returns PathfindingResult containing the path, visited nodes, distance, and success status
 * 
 * @example
 * ```typescript
 * const result = aStar(grid);
 * if (result.success) {
 *   console.log(`Optimal path found with distance ${result.distance}`);
 *   console.log(`Visited ${result.visitedNodes.length} nodes (fewer than Dijkstra)`);
 * }
 * ```
 */
export function aStar(grid: Grid): PathfindingResult {
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
  startNode.heuristic = manhattanDistance(startPos, endPos);
  startNode.totalCost = startNode.heuristic;
  
  // Priority queue for open set (nodes to explore)
  const openSet = new PriorityQueue<Position>();
  openSet.enqueue(startPos, startNode.totalCost);
  
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
        neighbor.heuristic = manhattanDistance(neighbor.position, endPos);
        neighbor.totalCost = neighbor.distance + neighbor.heuristic;
        neighbor.parent = currentPos;
        
        openSet.enqueue(neighbor.position, neighbor.totalCost);
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
 * A* pathfinding algorithm with animation step generation
 * Yields animation steps for visualization
 */
export function* aStarAnimated(grid: Grid): Generator<GridAnimationStep> {
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
  startNode.heuristic = manhattanDistance(startPos, endPos);
  startNode.totalCost = startNode.heuristic;
  
  // Priority queue for open set
  const openSet = new PriorityQueue<Position>();
  openSet.enqueue(startPos, startNode.totalCost);
  
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
        distance: currentNode.distance,
        heuristic: currentNode.heuristic
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
        distance: currentNode.distance,
        heuristic: currentNode.heuristic
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
        neighbor.heuristic = manhattanDistance(neighbor.position, endPos);
        neighbor.totalCost = neighbor.distance + neighbor.heuristic;
        neighbor.parent = currentPos;
        
        openSet.enqueue(neighbor.position, neighbor.totalCost);
      }
    }
  }
}
