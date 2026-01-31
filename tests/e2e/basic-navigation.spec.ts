import { test, expect } from '@playwright/test';

test.describe('Algorithm Visualizer - Basic Navigation', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Algorithm/);
  });

  test('should display the sorting algorithms tab by default', async ({ page }) => {
    await page.goto('/');
    const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
    await expect(sortingTab).toBeVisible();
  });

  test('should switch between sorting and pathfinding tabs', async ({ page }) => {
    await page.goto('/');
    
    // Click on pathfinding tab
    const pathfindingTab = page.getByRole('button', { name: /pathfinding algorithms/i });
    await pathfindingTab.click();
    
    // Verify pathfinding content is visible
    const gridVisualizer = page.locator('canvas').first();
    await expect(gridVisualizer).toBeVisible();
    
    // Switch back to sorting tab
    const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
    await sortingTab.click();
    
    // Verify sorting content is visible
    const sortingVisualizer = page.locator('canvas').first();
    await expect(sortingVisualizer).toBeVisible();
  });

  test('should display the theme toggle button', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.getByRole('button', { name: /switch to/i });
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state
    const html = page.locator('html');
    const initialHasDark = await html.evaluate(el => el.classList.contains('dark'));
    
    // Click theme toggle
    const themeToggle = page.getByRole('button', { name: /switch to/i });
    await themeToggle.click();
    
    // Verify dark mode state changed
    await page.waitForTimeout(100); // Brief wait for class to update
    const afterHasDark = await html.evaluate(el => el.classList.contains('dark'));
    expect(afterHasDark).not.toBe(initialHasDark);
  });
});
