/**
 * Color Scheme Manager
 * 
 * Centralized color management for all visualizations.
 * Provides consistent color schemes for both light and dark themes.
 */

export interface SortingColors {
  default: string;
  comparing: string;
  swapping: string;
  sorted: string;
}

export interface PathfindingColors {
  default: string;
  wall: string;
  start: string;
  end: string;
  visiting: string;
  visited: string;
  path: string;
  border: string;
}

export interface ColorScheme {
  sorting: SortingColors;
  pathfinding: PathfindingColors;
}

const lightTheme: ColorScheme = {
  sorting: {
    default: '#3b82f6',    // blue-500
    comparing: '#eab308',  // yellow-500
    swapping: '#ef4444',   // red-500
    sorted: '#22c55e',     // green-500
  },
  pathfinding: {
    default: '#f3f4f6',    // gray-100
    wall: '#4b5563',       // gray-600
    start: '#60a5fa',      // blue-400
    end: '#f87171',        // red-400
    visiting: '#fbbf24',   // yellow-400
    visited: '#a78bfa',    // purple-400
    path: '#34d399',       // green-400
    border: '#d1d5db',     // gray-300
  },
};

const darkTheme: ColorScheme = {
  sorting: {
    default: '#60a5fa',    // blue-400
    comparing: '#fbbf24',  // yellow-400
    swapping: '#f87171',   // red-400
    sorted: '#4ade80',     // green-400
  },
  pathfinding: {
    default: '#374151',    // gray-700
    wall: '#1f2937',       // gray-800
    start: '#3b82f6',      // blue-500
    end: '#ef4444',        // red-500
    visiting: '#eab308',   // yellow-500
    visited: '#8b5cf6',    // purple-500
    path: '#10b981',       // green-500
    border: '#4b5563',     // gray-600
  },
};

/**
 * Get the current color scheme based on dark mode setting
 */
export function getColorScheme(isDark: boolean = false): ColorScheme {
  return isDark ? darkTheme : lightTheme;
}

/**
 * Get sorting colors for the current theme
 */
export function getSortingColors(isDark: boolean = false): SortingColors {
  return getColorScheme(isDark).sorting;
}

/**
 * Get pathfinding colors for the current theme
 */
export function getPathfindingColors(isDark: boolean = false): PathfindingColors {
  return getColorScheme(isDark).pathfinding;
}

/**
 * Check if dark mode is currently active
 */
export function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}
