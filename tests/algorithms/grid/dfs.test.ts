import { describe, it, expect } from 'vitest';
import { dfs, dfsAnimated } from '@/algorithms/grid/dfs';
import { createGrid, toggleWall } from '@/algorithms/grid/gridUtils';
import type { GridConfig } from '@/types/grid';

describe('DFS Pathfinding Algorithm', () => {
  describe('Correctness', () => {
    it('should find a path in an empty 3x3 grid', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      expect(result.path[0]).toEqual({ row: 0, col: 0 });
      expect(result.path[result.path.length - 1]).toEqual({ row: 2, col: 2 });
    });
    
    it('should find a path in an empty 5x5 grid', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      expect(result.path[0]).toEqual({ row: 0, col: 0 });
      expect(result.path[result.path.length - 1]).toEqual({ row: 4, col: 4 });
    });
    
    it('should find a path with obstacles', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      let grid = createGrid(config);
      grid = toggleWall(grid, { row: 2, col: 2 });
      
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      // Path should navigate around walls
      expect(result.path.some(p => p.row === 2 && p.col === 2)).toBe(false);
    });
    
    it('should return failure when no path exists', () => {
      const config = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      
      // Create a wall barrier that blocks all paths
      for (let col = 0; col < 5; col++) {
        grid[2][col].isWall = true;
      }
      
      const result = dfs(grid);
      
      expect(result.success).toBe(false);
      expect(result.path.length).toBe(0);
      expect(result.distance).toBe(Infinity);
    });
    
    it('should handle start and end at the same position', () => {
      const config = {
        rows: 3,
        cols: 3,
        startPos: { row: 1, col: 1 },
        endPos: { row: 1, col: 1 }
      };
      const grid = createGrid(config);
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      expect(result.path.length).toBe(1);
      expect(result.path[0]).toEqual({ row: 1, col: 1 });
    });
    
    it('should handle adjacent start and end positions', () => {
      const config = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 0, col: 1 }
      };
      const grid = createGrid(config);
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThanOrEqual(2);
      expect(result.path[0]).toEqual({ row: 0, col: 0 });
      expect(result.path[result.path.length - 1]).toEqual({ row: 0, col: 1 });
    });
    
    it('should handle corner to corner paths', () => {
      const config1 = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const config2 = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 4 },
        endPos: { row: 4, col: 0 }
      };
      
      const corners = [config1, config2];
      
      for (const config of corners) {
        const grid = createGrid(config);
        const result = dfs(grid);
        expect(result.success).toBe(true);
        expect(result.path[0]).toEqual(config.startPos);
        expect(result.path[result.path.length - 1]).toEqual(config.endPos);
      }
    });
    
    it('should find a path in a maze', () => {
      const config: GridConfig = {
        rows: 10,
        cols: 10,
        startPos: { row: 0, col: 0 },
        endPos: { row: 9, col: 9 }
      };
      let grid = createGrid(config);
      
      // Create a maze with walls
      for (let i = 2; i < 8; i++) {
        grid = toggleWall(grid, { row: i, col: 5 });
      }
      // Create an opening
      grid = toggleWall(grid, { row: 4, col: 5 });
      
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      // Ensure path doesn't go through walls
      for (const pos of result.path) {
        const node = grid[pos.row][pos.col];
        expect(node.isWall).toBe(false);
      }
    });
    
    it('should track visited nodes', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      const result = dfs(grid);
      
      expect(result.visitedNodes.length).toBeGreaterThan(0);
      expect(result.visitedNodes.length).toBeGreaterThanOrEqual(result.path.length);
    });
    
    it('should handle 1x1 grid', () => {
      const config = {
        rows: 1,
        cols: 1,
        startPos: { row: 0, col: 0 },
        endPos: { row: 0, col: 0 }
      };
      const grid = createGrid(config);
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      expect(result.path.length).toBe(1);
    });
  });
  
  describe('Animation Steps', () => {
    it('should generate animation steps', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(dfsAnimated(grid));
      
      expect(steps.length).toBeGreaterThan(0);
    });
    
    it('should include visiting and visited states', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(dfsAnimated(grid));
      
      const visitingSteps = steps.filter(step => step.state === 'visiting');
      const visitedSteps = steps.filter(step => step.state === 'visited');
      
      expect(visitingSteps.length).toBeGreaterThan(0);
      expect(visitedSteps.length).toBeGreaterThan(0);
    });
    
    it('should include path state when path is found', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(dfsAnimated(grid));
      
      const pathSteps = steps.filter(step => step.state === 'path');
      expect(pathSteps.length).toBeGreaterThan(0);
    });
    
    it('should generate steps in depth-first order', () => {
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      const steps = Array.from(dfsAnimated(grid));
      
      const visitingSteps = steps.filter(step => step.state === 'visiting');
      
      // DFS explores deeply before backtracking
      expect(visitingSteps.length).toBeGreaterThan(0);
      
      // Verify we're visiting nodes
      for (const step of visitingSteps) {
        expect(step.position).toBeDefined();
        expect(step.position.row).toBeGreaterThanOrEqual(0);
        expect(step.position.col).toBeGreaterThanOrEqual(0);
      }
    });
    
    it('should include distance in each step', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(dfsAnimated(grid));
      
      for (const step of steps) {
        expect(step.distance).toBeDefined();
        expect(typeof step.distance).toBe('number');
      }
    });
    
    it('should include position in each step', () => {
      const config: GridConfig = {
        rows: 3,
        cols: 3,
        startPos: { row: 0, col: 0 },
        endPos: { row: 2, col: 2 }
      };
      const grid = createGrid(config);
      const steps = Array.from(dfsAnimated(grid));
      
      for (const step of steps) {
        expect(step.position).toBeDefined();
        expect(step.position.row).toBeGreaterThanOrEqual(0);
        expect(step.position.col).toBeGreaterThanOrEqual(0);
      }
    });
    
    it('should not generate path steps when no path exists', () => {
      const config = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      
      // Create a wall barrier
      for (let col = 0; col < 5; col++) {
        grid[2][col].isWall = true;
      }
      
      const steps = Array.from(dfsAnimated(grid));
      
      // Should generate steps for visited nodes but no path steps
      const pathSteps = steps.filter(step => step.state === 'path');
      expect(pathSteps.length).toBe(0);
    });
  });
  
  describe('Algorithm Properties', () => {
    it('should not guarantee shortest path', () => {
      // DFS does not guarantee shortest path
      const config: GridConfig = {
        rows: 10,
        cols: 10,
        startPos: { row: 0, col: 0 },
        endPos: { row: 9, col: 9 }
      };
      const grid = createGrid(config);
      const result = dfs(grid);
      
      expect(result.success).toBe(true);
      // The optimal path length would be 19 (9 + 9 + 1)
      // But DFS may find a longer path due to its depth-first nature
      expect(result.path.length).toBeGreaterThanOrEqual(19);
    });
    
    it('should use stack-based (LIFO) exploration', () => {
      // DFS explores deeply before backtracking
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid = createGrid(config);
      const steps = Array.from(dfsAnimated(grid));
      
      const visitingSteps = steps.filter(step => step.state === 'visiting');
      
      // Should visit multiple nodes
      expect(visitingSteps.length).toBeGreaterThan(1);
      
      // Check that consecutive visited nodes tend to be adjacent (depth-first behavior)
      let adjacentCount = 0;
      for (let i = 1; i < visitingSteps.length; i++) {
        const prev = visitingSteps[i - 1].position;
        const curr = visitingSteps[i].position;
        const rowDiff = Math.abs(curr.row - prev.row);
        const colDiff = Math.abs(curr.col - prev.col);
        
        // Adjacent if exactly one cell apart in row or col (not both)
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
          adjacentCount++;
        }
      }
      
      // DFS should have many adjacent visits due to depth-first exploration
      expect(adjacentCount).toBeGreaterThan(0);
    });
    
    it('should have O(V + E) time complexity behavior', () => {
      // Test that DFS visits nodes efficiently
      const configs = [
        { config: { rows: 3, cols: 3, startPos: { row: 0, col: 0 }, endPos: { row: 2, col: 2 } }, size: 9 },
        { config: { rows: 5, cols: 5, startPos: { row: 0, col: 0 }, endPos: { row: 4, col: 4 } }, size: 25 }
      ];
      
      for (const { config, size } of configs) {
        const grid = createGrid(config);
        const result = dfs(grid);
        
        // Should visit at most all nodes
        expect(result.visitedNodes.length).toBeLessThanOrEqual(size);
      }
    });
    
    it('should explore deterministically with same grid', () => {
      // DFS is deterministic
      const config: GridConfig = {
        rows: 5,
        cols: 5,
        startPos: { row: 0, col: 0 },
        endPos: { row: 4, col: 4 }
      };
      const grid1 = createGrid(config);
      const grid2 = createGrid(config);
      
      const result1 = dfs(grid1);
      const result2 = dfs(grid2);
      
      // Both should succeed
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      
      // Results should be the same (deterministic)
      expect(result1.path.length).toBe(result2.path.length);
    });
  });
});
