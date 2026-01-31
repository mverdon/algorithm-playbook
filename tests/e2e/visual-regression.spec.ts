import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Sorting Algorithms', () => {
    test.beforeEach(async ({ page }) => {
      const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
      await sortingTab.click();
      await page.waitForTimeout(300);
    });

    test('should match baseline for bubble sort', async ({ page }) => {
      const selector = page.getByRole('combobox', { name: /algorithm/i });
      await selector.selectOption('bubble');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('sorting-bubble-sort.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for quick sort', async ({ page }) => {
      const selector = page.getByRole('combobox', { name: /algorithm/i });
      await selector.selectOption('quick');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('sorting-quick-sort.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for merge sort', async ({ page }) => {
      const selector = page.getByRole('combobox', { name: /algorithm/i });
      await selector.selectOption('merge');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('sorting-merge-sort.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for heap sort', async ({ page }) => {
      const selector = page.getByRole('combobox', { name: /algorithm/i });
      await selector.selectOption('heap');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('sorting-heap-sort.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for small array size', async ({ page }) => {
      const sizeInput = page.locator('input[type="range"]');
      await sizeInput.fill('10');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('sorting-small-array.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for large array size', async ({ page }) => {
      const sizeInput = page.locator('input[type="range"]');
      await sizeInput.fill('100');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('sorting-large-array.png', {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Pathfinding Algorithms', () => {
    test.beforeEach(async ({ page }) => {
      const pathfindingTab = page.getByRole('button', { name: /pathfinding algorithms/i });
      await pathfindingTab.click();
      await page.waitForTimeout(300);
    });

    test('should match baseline for dijkstra', async ({ page }) => {
      const selector = page.getByRole('combobox', { name: /algorithm/i });
      await selector.selectOption('dijkstra');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('pathfinding-dijkstra.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for A*', async ({ page }) => {
      const selector = page.getByRole('combobox', { name: /algorithm/i });
      await selector.selectOption('astar');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('pathfinding-astar.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for grid with walls', async ({ page }) => {
      // Add some walls by clicking on the canvas
      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();
      
      // Click on a few spots to add walls
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + 100, box.y + 100);
        await page.mouse.click(box.x + 150, box.y + 100);
        await page.mouse.click(box.x + 200, box.y + 100);
        await page.waitForTimeout(200);
      }
      
      await expect(page).toHaveScreenshot('pathfinding-with-walls.png', {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Theme Variations', () => {
    test('should match baseline for light theme', async ({ page }) => {
      // Ensure we're in light mode by checking and toggling if needed
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      
      if (isDarkMode) {
        const themeToggle = page.getByRole('button', { name: /switch to light mode/i });
        await themeToggle.click();
        await page.waitForTimeout(500); // Wait for theme transition
      }
      
      await expect(page).toHaveScreenshot('theme-light.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for dark theme', async ({ page }) => {
      // Toggle to dark mode
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      
      if (!isDarkMode) {
        const themeToggle = page.getByRole('button', { name: /switch to dark mode/i });
        await themeToggle.click();
        await page.waitForTimeout(500); // Wait for theme transition
      }
      
      await expect(page).toHaveScreenshot('theme-dark.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for sorting with dark theme', async ({ page }) => {
      const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
      await sortingTab.click();
      await page.waitForTimeout(200);
      
      // Toggle to dark mode
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      
      if (!isDarkMode) {
        const themeToggle = page.getByRole('button', { name: /switch to dark mode/i });
        await themeToggle.click();
        await page.waitForTimeout(500);
      }
      
      await expect(page).toHaveScreenshot('sorting-dark-theme.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for pathfinding with dark theme', async ({ page }) => {
      const pathfindingTab = page.getByRole('button', { name: /pathfinding algorithms/i });
      await pathfindingTab.click();
      await page.waitForTimeout(200);
      
      // Toggle to dark mode
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      
      if (!isDarkMode) {
        const themeToggle = page.getByRole('button', { name: /switch to dark mode/i });
        await themeToggle.click();
        await page.waitForTimeout(500);
      }
      
      await expect(page).toHaveScreenshot('pathfinding-dark-theme.png', {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Responsive Design', () => {
    test('should match baseline for mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('responsive-mobile.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('responsive-tablet.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('responsive-desktop.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for mobile sorting view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
      await sortingTab.click();
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('responsive-mobile-sorting.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for mobile pathfinding view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const pathfindingTab = page.getByRole('button', { name: /pathfinding algorithms/i });
      await pathfindingTab.click();
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot('responsive-mobile-pathfinding.png', {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Control States', () => {
    test('should match baseline for algorithm selector open', async ({ page }) => {
      const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
      await sortingTab.click();
      await page.waitForTimeout(200);
      
      const selector = page.getByRole('combobox', { name: /algorithm/i });
      await selector.click();
      await page.waitForTimeout(100);
      
      await expect(page).toHaveScreenshot('control-algorithm-selector-open.png', {
        maxDiffPixels: 100,
      });
    });

    test('should match baseline for speed control open', async ({ page }) => {
      const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
      await sortingTab.click();
      await page.waitForTimeout(200);
      
      const speedControl = page.getByRole('combobox', { name: /speed/i });
      await speedControl.click();
      await page.waitForTimeout(100);
      
      await expect(page).toHaveScreenshot('control-speed-selector-open.png', {
        maxDiffPixels: 100,
      });
    });
  });
});
