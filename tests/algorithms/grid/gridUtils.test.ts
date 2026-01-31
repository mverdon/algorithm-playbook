import { describe, it, expect } from 'vitest';
import {
  createGrid,
  toggleWall,
  setStartNode,
  setEndNode,
  clearGrid,
  resetGrid,
  getNeighbors,
  manhattanDistance,
  reconstructPath
} from '@/algorithms/grid/gridUtils';
import type { GridConfig, Position } from '@/types/grid';
import { NodeState } from '@/types/grid';

describe('Grid Utilities', () => {
  const defaultConfig: GridConfig = {
    rows: 5,
    cols: 5,
    startPos: { row: 0, col: 0 },
    endPos: { row: 4, col: 4 }
  };

  describe('createGrid', () => {
    it('should create a grid with correct dimensions', () => {
      const grid = createGrid(defaultConfig);
      expect(grid).toHaveLength(5);
      expect(grid[0]).toHaveLength(5);
    });

    it('should initialize start node correctly', () => {
      const grid = createGrid(defaultConfig);
      const startNode = grid[0][0];
      expect(startNode.isStart).toBe(true);
      expect(startNode.state).toBe(NodeState.Start);
      expect(startNode.position).toEqual({ row: 0, col: 0 });
    });

    it('should initialize end node correctly', () => {
      const grid = createGrid(defaultConfig);
      const endNode = grid[4][4];
      expect(endNode.isEnd).toBe(true);
      expect(endNode.state).toBe(NodeState.End);
      expect(endNode.position).toEqual({ row: 4, col: 4 });
    });

    it('should initialize all other nodes as default', () => {
      const grid = createGrid(defaultConfig);
      const middleNode = grid[2][2];
      expect(middleNode.isStart).toBe(false);
      expect(middleNode.isEnd).toBe(false);
      expect(middleNode.isWall).toBe(false);
      expect(middleNode.state).toBe(NodeState.Default);
      expect(middleNode.distance).toBe(Infinity);
      expect(middleNode.parent).toBeNull();
    });

    it('should create grids of different sizes', () => {
      const smallGrid = createGrid({ ...defaultConfig, rows: 3, cols: 3, endPos: { row: 2, col: 2 } });
      expect(smallGrid).toHaveLength(3);
      expect(smallGrid[0]).toHaveLength(3);

      const largeGrid = createGrid({ ...defaultConfig, rows: 10, cols: 15, endPos: { row: 9, col: 14 } });
      expect(largeGrid).toHaveLength(10);
      expect(largeGrid[0]).toHaveLength(15);
    });
  });

  describe('toggleWall', () => {
    it('should toggle a wall on an empty node', () => {
      const grid = createGrid(defaultConfig);
      const position: Position = { row: 2, col: 2 };
      const newGrid = toggleWall(grid, position);
      
      expect(newGrid[2][2].isWall).toBe(true);
      expect(newGrid[2][2].state).toBe(NodeState.Wall);
    });

    it('should toggle a wall off', () => {
      const grid = createGrid(defaultConfig);
      const position: Position = { row: 2, col: 2 };
      let newGrid = toggleWall(grid, position);
      newGrid = toggleWall(newGrid, position);
      
      expect(newGrid[2][2].isWall).toBe(false);
      expect(newGrid[2][2].state).toBe(NodeState.Default);
    });

    it('should not toggle wall on start node', () => {
      const grid = createGrid(defaultConfig);
      const newGrid = toggleWall(grid, defaultConfig.startPos);
      
      expect(newGrid[0][0].isWall).toBe(false);
      expect(newGrid[0][0].isStart).toBe(true);
      expect(newGrid[0][0].state).toBe(NodeState.Start);
    });

    it('should not toggle wall on end node', () => {
      const grid = createGrid(defaultConfig);
      const newGrid = toggleWall(grid, defaultConfig.endPos);
      
      expect(newGrid[4][4].isWall).toBe(false);
      expect(newGrid[4][4].isEnd).toBe(true);
      expect(newGrid[4][4].state).toBe(NodeState.End);
    });

    it('should not mutate original grid', () => {
      const grid = createGrid(defaultConfig);
      const position: Position = { row: 2, col: 2 };
      toggleWall(grid, position);
      
      expect(grid[2][2].isWall).toBe(false);
    });
  });

  describe('setStartNode', () => {
    it('should set a new start node', () => {
      const grid = createGrid(defaultConfig);
      const newPos: Position = { row: 1, col: 1 };
      const newGrid = setStartNode(grid, newPos);
      
      expect(newGrid[1][1].isStart).toBe(true);
      expect(newGrid[1][1].state).toBe(NodeState.Start);
    });

    it('should clear the previous start node', () => {
      const grid = createGrid(defaultConfig);
      const newPos: Position = { row: 1, col: 1 };
      const newGrid = setStartNode(grid, newPos);
      
      expect(newGrid[0][0].isStart).toBe(false);
      expect(newGrid[0][0].state).toBe(NodeState.Default);
    });

    it('should remove wall from new start position', () => {
      const grid = createGrid(defaultConfig);
      const wallPos: Position = { row: 2, col: 2 };
      let newGrid = toggleWall(grid, wallPos);
      newGrid = setStartNode(newGrid, wallPos);
      
      expect(newGrid[2][2].isWall).toBe(false);
      expect(newGrid[2][2].isStart).toBe(true);
      expect(newGrid[2][2].state).toBe(NodeState.Start);
    });

    it('should not mutate original grid', () => {
      const grid = createGrid(defaultConfig);
      const newPos: Position = { row: 1, col: 1 };
      setStartNode(grid, newPos);
      
      expect(grid[0][0].isStart).toBe(true);
      expect(grid[1][1].isStart).toBe(false);
    });
  });

  describe('setEndNode', () => {
    it('should set a new end node', () => {
      const grid = createGrid(defaultConfig);
      const newPos: Position = { row: 3, col: 3 };
      const newGrid = setEndNode(grid, newPos);
      
      expect(newGrid[3][3].isEnd).toBe(true);
      expect(newGrid[3][3].state).toBe(NodeState.End);
    });

    it('should clear the previous end node', () => {
      const grid = createGrid(defaultConfig);
      const newPos: Position = { row: 3, col: 3 };
      const newGrid = setEndNode(grid, newPos);
      
      expect(newGrid[4][4].isEnd).toBe(false);
      expect(newGrid[4][4].state).toBe(NodeState.Default);
    });

    it('should remove wall from new end position', () => {
      const grid = createGrid(defaultConfig);
      const wallPos: Position = { row: 2, col: 2 };
      let newGrid = toggleWall(grid, wallPos);
      newGrid = setEndNode(newGrid, wallPos);
      
      expect(newGrid[2][2].isWall).toBe(false);
      expect(newGrid[2][2].isEnd).toBe(true);
      expect(newGrid[2][2].state).toBe(NodeState.End);
    });

    it('should not mutate original grid', () => {
      const grid = createGrid(defaultConfig);
      const newPos: Position = { row: 3, col: 3 };
      setEndNode(grid, newPos);
      
      expect(grid[4][4].isEnd).toBe(true);
      expect(grid[3][3].isEnd).toBe(false);
    });
  });

  describe('clearGrid', () => {
    it('should preserve walls', () => {
      const grid = createGrid(defaultConfig);
      const wallPos: Position = { row: 2, col: 2 };
      let newGrid = toggleWall(grid, wallPos);
      newGrid = clearGrid(newGrid);
      
      expect(newGrid[2][2].isWall).toBe(true);
      expect(newGrid[2][2].state).toBe(NodeState.Wall);
    });

    it('should preserve start node', () => {
      const grid = createGrid(defaultConfig);
      const clearedGrid = clearGrid(grid);
      
      expect(clearedGrid[0][0].isStart).toBe(true);
      expect(clearedGrid[0][0].state).toBe(NodeState.Start);
    });

    it('should preserve end node', () => {
      const grid = createGrid(defaultConfig);
      const clearedGrid = clearGrid(grid);
      
      expect(clearedGrid[4][4].isEnd).toBe(true);
      expect(clearedGrid[4][4].state).toBe(NodeState.End);
    });

    it('should reset distance and parent values', () => {
      const grid = createGrid(defaultConfig);
      // Simulate algorithm setting values
      grid[2][2].distance = 10;
      grid[2][2].parent = { row: 1, col: 2 };
      
      const clearedGrid = clearGrid(grid);
      expect(clearedGrid[2][2].distance).toBe(Infinity);
      expect(clearedGrid[2][2].parent).toBeNull();
    });

    it('should reset non-wall, non-start, non-end nodes to default', () => {
      const grid = createGrid(defaultConfig);
      grid[2][2].state = NodeState.Visited;
      
      const clearedGrid = clearGrid(grid);
      expect(clearedGrid[2][2].state).toBe(NodeState.Default);
    });
  });

  describe('resetGrid', () => {
    it('should create a fresh grid identical to createGrid', () => {
      const config: GridConfig = {
        rows: 4,
        cols: 6,
        startPos: { row: 1, col: 1 },
        endPos: { row: 2, col: 4 }
      };
      
      const freshGrid = createGrid(config);
      const resetGridResult = resetGrid(config);
      
      expect(resetGridResult).toHaveLength(freshGrid.length);
      expect(resetGridResult[0]).toHaveLength(freshGrid[0].length);
      expect(resetGridResult[1][1].isStart).toBe(true);
      expect(resetGridResult[2][4].isEnd).toBe(true);
    });
  });

  describe('getNeighbors', () => {
    it('should return 4 neighbors for a center node', () => {
      const grid = createGrid(defaultConfig);
      const position: Position = { row: 2, col: 2 };
      const neighbors = getNeighbors(grid, position);
      
      expect(neighbors).toHaveLength(4);
    });

    it('should return correct neighbor positions for center node', () => {
      const grid = createGrid(defaultConfig);
      const position: Position = { row: 2, col: 2 };
      const neighbors = getNeighbors(grid, position);
      
      const positions = neighbors.map(n => n.position);
      expect(positions).toContainEqual({ row: 1, col: 2 }); // up
      expect(positions).toContainEqual({ row: 3, col: 2 }); // down
      expect(positions).toContainEqual({ row: 2, col: 1 }); // left
      expect(positions).toContainEqual({ row: 2, col: 3 }); // right
    });

    it('should return 2 neighbors for corner node', () => {
      const grid = createGrid(defaultConfig);
      const position: Position = { row: 0, col: 0 };
      const neighbors = getNeighbors(grid, position);
      
      expect(neighbors).toHaveLength(2);
    });

    it('should return 3 neighbors for edge node', () => {
      const grid = createGrid(defaultConfig);
      const position: Position = { row: 0, col: 2 };
      const neighbors = getNeighbors(grid, position);
      
      expect(neighbors).toHaveLength(3);
    });

    it('should include wall neighbors', () => {
      const grid = createGrid(defaultConfig);
      const wallPos: Position = { row: 2, col: 3 };
      let newGrid = toggleWall(grid, wallPos);
      
      const neighbors = getNeighbors(newGrid, { row: 2, col: 2 });
      const hasWallNeighbor = neighbors.some(n => n.isWall);
      
      expect(hasWallNeighbor).toBe(true);
    });
  });

  describe('manhattanDistance', () => {
    it('should calculate distance between same position as 0', () => {
      const pos: Position = { row: 2, col: 2 };
      expect(manhattanDistance(pos, pos)).toBe(0);
    });

    it('should calculate horizontal distance', () => {
      const pos1: Position = { row: 2, col: 1 };
      const pos2: Position = { row: 2, col: 4 };
      expect(manhattanDistance(pos1, pos2)).toBe(3);
    });

    it('should calculate vertical distance', () => {
      const pos1: Position = { row: 1, col: 2 };
      const pos2: Position = { row: 5, col: 2 };
      expect(manhattanDistance(pos1, pos2)).toBe(4);
    });

    it('should calculate diagonal distance', () => {
      const pos1: Position = { row: 0, col: 0 };
      const pos2: Position = { row: 3, col: 4 };
      expect(manhattanDistance(pos1, pos2)).toBe(7);
    });

    it('should be symmetric', () => {
      const pos1: Position = { row: 1, col: 2 };
      const pos2: Position = { row: 3, col: 5 };
      expect(manhattanDistance(pos1, pos2)).toBe(manhattanDistance(pos2, pos1));
    });

    it('should handle negative differences', () => {
      const pos1: Position = { row: 5, col: 5 };
      const pos2: Position = { row: 1, col: 1 };
      expect(manhattanDistance(pos1, pos2)).toBe(8);
    });
  });

  describe('reconstructPath', () => {
    it('should reconstruct a simple path', () => {
      const grid = createGrid(defaultConfig);
      
      // Set up a simple path: (0,0) -> (0,1) -> (0,2)
      grid[0][1].parent = { row: 0, col: 0 };
      grid[0][2].parent = { row: 0, col: 1 };
      
      const path = reconstructPath(grid, { row: 0, col: 2 });
      
      expect(path).toHaveLength(3);
      expect(path[0]).toEqual({ row: 0, col: 0 });
      expect(path[1]).toEqual({ row: 0, col: 1 });
      expect(path[2]).toEqual({ row: 0, col: 2 });
    });

    it('should handle single node path', () => {
      const grid = createGrid(defaultConfig);
      const path = reconstructPath(grid, { row: 0, col: 0 });
      
      expect(path).toHaveLength(1);
      expect(path[0]).toEqual({ row: 0, col: 0 });
    });

    it('should reconstruct L-shaped path', () => {
      const grid = createGrid(defaultConfig);
      
      // Path: (0,0) -> (1,0) -> (1,1)
      grid[1][0].parent = { row: 0, col: 0 };
      grid[1][1].parent = { row: 1, col: 0 };
      
      const path = reconstructPath(grid, { row: 1, col: 1 });
      
      expect(path).toHaveLength(3);
      expect(path[0]).toEqual({ row: 0, col: 0 });
      expect(path[1]).toEqual({ row: 1, col: 0 });
      expect(path[2]).toEqual({ row: 1, col: 1 });
    });
  });
});
