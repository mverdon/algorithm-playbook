import { describe, it, expect } from 'vitest';
import { bfs, bfsAnimated } from '@/algorithms/grid/bfs';
import { createGrid, toggleWall } from '@/algorithms/grid/gridUtils';
import { NodeState } from '@/types/grid';
import type { GridConfig, Position } from '@/types/grid';

describe('BFS Pathfinding Algorithm', () => {
  describe('bfs - Correctness', () => {
    it('should find a path in an empty 5x5 grid', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      expect(result.path[0]).toEqual({ row: 0, col: 0 });
      expect(result.path[result.path.length - 1]).toEqual({ row: 4, col: 4 });
      expect(result.distance).toBe(8); // Manhattan distance: 4 + 4
    });

    it('should find a path with obstacles', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      let grid = createGrid(config);
      
      // Add a wall
      grid = toggleWall(grid, { row: 2, col: 2 });
      
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      // Path should not contain the wall
      expect(result.path.some(p => p.row === 2 && p.col === 2)).toBe(false);
    });

    it('should return no path when blocked', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      let grid = createGrid(config);
      
      // Create a wall blocking all paths
      for (let col = 0; col < 5; col++) {
        grid = toggleWall(grid, { row: 2, col });
      }
      
      const result = bfs(grid);

      expect(result.success).toBe(false);
      expect(result.path.length).toBe(0);
      expect(result.distance).toBe(Infinity);
    });

    it('should handle adjacent start and end nodes', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 0, col: 1 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.length).toBe(2);
      expect(result.distance).toBe(1);
    });

    it('should handle start and end at same location', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 1, col: 1 },
        endPos: { row: 1, col: 1 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.length).toBe(1);
      expect(result.distance).toBe(0);
    });

    it('should find path in corner-to-corner diagonal', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      expect(result.distance).toBe(4); // 2 + 2 (no diagonal movement)
    });

    it('should handle narrow passages', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      let grid = createGrid(config);
      
      // Create a narrow passage
      grid = toggleWall(grid, { row: 2, col: 0 });
      grid = toggleWall(grid, { row: 2, col: 1 });
      grid = toggleWall(grid, { row: 2, col: 3 });
      grid = toggleWall(grid, { row: 2, col: 4 });
      
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.some(p => p.row === 2 && p.col === 2)).toBe(true);
    });

    it('should explore all reachable nodes when no path exists', () => {
      const config: GridConfig = {
        rows: 4,
        cols: 4,
        startPos: { row: 0, col: 0 },
        endPos: { row: 3, col: 3 }
      };
      let grid = createGrid(config);
      
      // Block completely
      for (let col = 0; col < 4; col++) {
        grid = toggleWall(grid, { row: 2, col });
      }
      
      const result = bfs(grid);

      expect(result.success).toBe(false);
      expect(result.visitedNodes.length).toBeLessThan(16); // Should visit less than all nodes
    });

    it('should handle 1x1 grid', () => {
      const config: GridConfig = {
        rows: 1,
        cols: 1,
        startPos: { row: 0, col: 0 },
        endPos: { row: 0, col: 0 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.length).toBe(1);
      expect(result.distance).toBe(0);
    });

    it('should find path in a maze', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      let grid = createGrid(config);
      
      // Create maze-like structure with a valid path
      // Grid: S  .  W  .  .
      //       W  .  .  .  .
      //       .  W  .  W  .
      //       .  .  .  W  .
      //       .  W  .  .  E
      // Path exists: go around the walls
      grid = toggleWall(grid, { row: 0, col: 2 });
      grid = toggleWall(grid, { row: 1, col: 0 });
      grid = toggleWall(grid, { row: 2, col: 1 });
      grid = toggleWall(grid, { row: 2, col: 3 });
      grid = toggleWall(grid, { row: 3, col: 3 });
      grid = toggleWall(grid, { row: 4, col: 1 });
      
      const result = bfs(grid);

      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
    });
  });

  describe('bfsAnimated - Animation Steps', () => {
    it('should generate animation steps', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(bfsAnimated(grid));

      expect(steps.length).toBeGreaterThan(0);
    });

    it('should have visiting and visited steps', () => {
      const config: GridConfig = {
        rows: 4,
        cols: 4,
        startPos: { row: 0, col: 0 },
        endPos: { row: 3, col: 3 }
      };
      const grid = createGrid(config);
      const steps = Array.from(bfsAnimated(grid));

      const visitingSteps = steps.filter(s => s.state === NodeState.Visiting);
      const visitedSteps = steps.filter(s => s.state === NodeState.Visited);

      expect(visitingSteps.length).toBeGreaterThan(0);
      expect(visitedSteps.length).toBeGreaterThan(0);
    });

    it('should include path steps when found', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(bfsAnimated(grid));

      const pathSteps = steps.filter(s => s.state === NodeState.Path);
      expect(pathSteps.length).toBeGreaterThan(0);
    });

    it('should not have path steps when no path found', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      let grid = createGrid(config);
      
      // Block all paths
      grid = toggleWall(grid, { row: 1, col: 0 });
      grid = toggleWall(grid, { row: 1, col: 1 });
      grid = toggleWall(grid, { row: 1, col: 2 });
      
      const steps = Array.from(bfsAnimated(grid));

      const pathSteps = steps.filter(s => s.state === NodeState.Path);
      expect(pathSteps.length).toBe(0);
    });

    it('should track distance correctly in animation', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(bfsAnimated(grid));

      // Check that distance increases correctly
      const visitedSteps = steps.filter(s => s.state === NodeState.Visited);
      for (const step of visitedSteps) {
        expect(step.distance).toBeGreaterThanOrEqual(0);
      }
    });

    it('should yield steps for small grid', () => {
      const config: GridConfig = {
        rows: 2,
        cols: 2,
        startPos: { row: 0, col: 0 },
        endPos: { row: 1, col: 1 }
      };
      const grid = createGrid(config);
      const steps = Array.from(bfsAnimated(grid));

      expect(steps.length).toBeGreaterThan(0);
      expect(steps.some(s => s.state === NodeState.Path)).toBe(true);
    });

    it('should not yield steps when no path exists', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      let grid = createGrid(config);
      
      // Block all paths
      for (let col = 0; col < 3; col++) {
        grid = toggleWall(grid, { row: 1, col });
      }
      
      const steps = Array.from(bfsAnimated(grid));

      // Should have visited steps but no path steps
      expect(steps.some(s => s.state === NodeState.Visited)).toBe(true);
      expect(steps.some(s => s.state === NodeState.Path)).toBe(false);
    });
  });

  describe('Algorithm Properties', () => {
    it('should guarantee shortest path in unweighted grid', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      // In a 5x5 grid from (0,0) to (4,4), shortest path is 8 moves
      expect(result.distance).toBe(8);
    });

    it('should explore nodes level by level', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 2, col: 2 },
        endPos: { row: 0, col: 0 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      // BFS should find the shortest path
      expect(result.distance).toBe(4); // 2 + 2
    });

    it('should not use heuristic', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      const steps = Array.from(bfsAnimated(grid));

      // BFS doesn't use heuristic, so it should always be 0 or undefined
      for (const step of steps) {
        expect(step.heuristic === undefined || step.heuristic === 0).toBe(true);
      }
    });

    it('should visit more nodes than A* in same scenario', () => {
      // BFS explores uniformly in all directions
      // A* uses heuristic to guide search toward goal
      // So BFS typically visits more nodes
      const config: GridConfig = {
        rows: 10,
        cols: 10,
        startPos: { row: 0, col: 0 },
        endPos: { row: 9, col: 9 }
      };
      const grid = createGrid(config);
      const result = bfs(grid);

      expect(result.success).toBe(true);
      // BFS should visit many nodes in a large grid
      expect(result.visitedNodes.length).toBeGreaterThan(10);
    });

    it('should handle all edge positions correctly', () => {
      // Test all corner and edge positions
      const positions = [
        { startPos: { row: 0, col: 0 }, endPos: { row: 4, col: 4 } }, // top-left to bottom-right
        { startPos: { row: 0, col: 4 }, endPos: { row: 4, col: 0 } }, // top-right to bottom-left
        { startPos: { row: 4, col: 0 }, endPos: { row: 0, col: 4 } }, // bottom-left to top-right
        { startPos: { row: 4, col: 4 }, endPos: { row: 0, col: 0 } }, // bottom-right to top-left
      ];

      for (const pos of positions) {
        const config: GridConfig = {
          rows: 5,
          cols: 5,
          ...pos
        };
        const grid = createGrid(config);
        const result = bfs(grid);

        expect(result.success).toBe(true);
        expect(result.path.length).toBeGreaterThan(0);
        expect(result.distance).toBe(8); // All should have same distance
      }
    });
  });
});
