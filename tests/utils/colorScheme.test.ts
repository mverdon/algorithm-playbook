import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getColorScheme,
  getSortingColors,
  getPathfindingColors,
  isDarkMode,
} from '@/utils/colorScheme';

describe('colorScheme', () => {
  beforeEach(() => {
    // Reset document class list before each test
    document.documentElement.classList.remove('dark');
  });

  describe('getColorScheme', () => {
    it('should return light theme when isDark is false', () => {
      const scheme = getColorScheme(false);
      expect(scheme.sorting.default).toBe('#3b82f6'); // blue-500
      expect(scheme.pathfinding.default).toBe('#f3f4f6'); // gray-100
    });

    it('should return dark theme when isDark is true', () => {
      const scheme = getColorScheme(true);
      expect(scheme.sorting.default).toBe('#60a5fa'); // blue-400
      expect(scheme.pathfinding.default).toBe('#374151'); // gray-700
    });

    it('should have all required sorting color properties', () => {
      const scheme = getColorScheme(false);
      expect(scheme.sorting).toHaveProperty('default');
      expect(scheme.sorting).toHaveProperty('comparing');
      expect(scheme.sorting).toHaveProperty('swapping');
      expect(scheme.sorting).toHaveProperty('sorted');
    });

    it('should have all required pathfinding color properties', () => {
      const scheme = getColorScheme(false);
      expect(scheme.pathfinding).toHaveProperty('default');
      expect(scheme.pathfinding).toHaveProperty('wall');
      expect(scheme.pathfinding).toHaveProperty('start');
      expect(scheme.pathfinding).toHaveProperty('end');
      expect(scheme.pathfinding).toHaveProperty('visiting');
      expect(scheme.pathfinding).toHaveProperty('visited');
      expect(scheme.pathfinding).toHaveProperty('path');
      expect(scheme.pathfinding).toHaveProperty('border');
    });
  });

  describe('getSortingColors', () => {
    it('should return light sorting colors when isDark is false', () => {
      const colors = getSortingColors(false);
      expect(colors.default).toBe('#3b82f6');
      expect(colors.comparing).toBe('#eab308');
      expect(colors.swapping).toBe('#ef4444');
      expect(colors.sorted).toBe('#22c55e');
    });

    it('should return dark sorting colors when isDark is true', () => {
      const colors = getSortingColors(true);
      expect(colors.default).toBe('#60a5fa');
      expect(colors.comparing).toBe('#fbbf24');
      expect(colors.swapping).toBe('#f87171');
      expect(colors.sorted).toBe('#4ade80');
    });
  });

  describe('getPathfindingColors', () => {
    it('should return light pathfinding colors when isDark is false', () => {
      const colors = getPathfindingColors(false);
      expect(colors.default).toBe('#f3f4f6');
      expect(colors.wall).toBe('#4b5563');
      expect(colors.start).toBe('#60a5fa');
      expect(colors.end).toBe('#f87171');
    });

    it('should return dark pathfinding colors when isDark is true', () => {
      const colors = getPathfindingColors(true);
      expect(colors.default).toBe('#374151');
      expect(colors.wall).toBe('#1f2937');
      expect(colors.start).toBe('#3b82f6');
      expect(colors.end).toBe('#ef4444');
    });

    it('should include all state colors', () => {
      const colors = getPathfindingColors(false);
      expect(colors.visiting).toBeDefined();
      expect(colors.visited).toBeDefined();
      expect(colors.path).toBeDefined();
      expect(colors.border).toBeDefined();
    });
  });

  describe('isDarkMode', () => {
    it('should return false when dark class is not present', () => {
      expect(isDarkMode()).toBe(false);
    });

    it('should return true when dark class is present', () => {
      document.documentElement.classList.add('dark');
      expect(isDarkMode()).toBe(true);
    });

    it('should detect dark mode changes', () => {
      expect(isDarkMode()).toBe(false);
      
      document.documentElement.classList.add('dark');
      expect(isDarkMode()).toBe(true);
      
      document.documentElement.classList.remove('dark');
      expect(isDarkMode()).toBe(false);
    });
  });
});
