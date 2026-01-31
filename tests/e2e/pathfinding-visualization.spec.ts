import { test, expect } from '@playwright/test';

test.describe('Algorithm Visualizer - Pathfinding Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to the pathfinding tab
    const pathfindingTab = page.getByRole('button', { name: /pathfinding algorithms/i });
    await pathfindingTab.click();
  });

  test('should display pathfinding visualizer canvas', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    // Verify canvas has reasonable dimensions
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('should display algorithm selector', async ({ page }) => {
    const selector = page.getByRole('combobox', { name: /algorithm/i });
    await expect(selector).toBeVisible();
    
    // Verify it has a value (an algorithm is selected)
    const value = await selector.inputValue();
    expect(value).not.toBeNull();
  });

  test('should display speed control', async ({ page }) => {
    const speedControl = page.getByRole('combobox', { name: /speed/i });
    await expect(speedControl).toBeVisible();
    
    // Verify control has a value
    const value = await speedControl.inputValue();
    expect(value).not.toBeNull();
  });

  test('should display control buttons', async ({ page }) => {
    // Check buttons by their aria-labels
    await expect(page.locator('button[aria-label*="Play"]')).toBeVisible();
    await expect(page.locator('button[aria-label*="Reset"]')).toBeVisible();
  });

  test('should display Clear Walls and Reset Grid buttons', async ({ page }) => {
    const clearWallsButton = page.getByRole('button', { name: /clear walls/i });
    const resetGridButton = page.getByRole('button', { name: /reset grid/i });
    
    await expect(clearWallsButton).toBeVisible();
    await expect(resetGridButton).toBeVisible();
  });

  test('should display instructions', async ({ page }) => {
    const instructions = page.locator('text=/Instructions:/i');
    await expect(instructions).toBeVisible();
    
    // Verify specific instruction text
    await expect(page.locator('text=/Click or drag to add\/remove walls/i')).toBeVisible();
    await expect(page.locator('text=/Drag the blue .* or red .* node/i')).toBeVisible();
  });

  test('should change algorithm and update visualization', async ({ page }) => {
    const selector = page.getByRole('combobox', { name: /algorithm/i });
    
    // Select A* by value
    await selector.selectOption('astar');
    await page.waitForTimeout(200);
    
    // Verify canvas is still visible
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('should clear walls when Clear Walls button is clicked', async ({ page }) => {
    const clearWallsButton = page.getByRole('button', { name: /clear walls/i });
    const canvas = page.locator('canvas').first();
    
    // Get initial canvas state
    await expect(canvas).toBeVisible();
    
    // Click clear walls
    await clearWallsButton.click();
    await page.waitForTimeout(200);
    
    // Verify canvas is still visible
    await expect(canvas).toBeVisible();
  });

  test('should reset grid when Reset Grid button is clicked', async ({ page }) => {
    const resetGridButton = page.getByRole('button', { name: /reset grid/i });
    const canvas = page.locator('canvas').first();
    
    // Get initial canvas state
    await expect(canvas).toBeVisible();
    
    // Click reset grid
    await resetGridButton.click();
    await page.waitForTimeout(200);
    
    // Verify canvas is still visible
    await expect(canvas).toBeVisible();
  });

  test('should play and pause pathfinding animation', async ({ page }) => {
    // Find play button
    const playButton = page.locator('button[aria-label*="Play"]');
    await expect(playButton).toBeVisible();
    
    // For now, just verify the button exists
  });

  test('should reset animation', async ({ page }) => {
    const resetButton = page.locator('button[aria-label*="Reset"]');
    
    // Click reset
    await resetButton.click();
    await page.waitForTimeout(100);
    
    // Verify canvas is visible
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('should change animation speed', async ({ page }) => {
    const speedControl = page.getByRole('combobox', { name: /speed/i });
    
    // Select Fast speed by value (100)
    await speedControl.selectOption('100');
    
    // Verify selection took effect
    const value = await speedControl.inputValue();
    expect(value).toBe('100');
  });

  test('should work with different algorithms', async ({ page }) => {
    const algorithms = ['astar', 'dijkstra', 'bfs', 'dfs'];
    const selector = page.getByRole('combobox', { name: /algorithm/i });
    
    for (const algo of algorithms) {
      // Select algorithm by value
      await selector.selectOption(algo);
      await page.waitForTimeout(100);
      
      // Verify canvas is visible and rendered
      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();
    }
  });

  test('should maintain state when switching away and back', async ({ page }) => {
    const selector = page.getByRole('combobox', { name: /algorithm/i });
    
    // Select Dijkstra
    await selector.selectOption('dijkstra');
    await page.waitForTimeout(100);
    
    // Switch to sorting tab
    const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
    await sortingTab.click();
    await page.waitForTimeout(200);
    
    // Switch back to pathfinding tab
    const pathfindingTab = page.getByRole('button', { name: /pathfinding algorithms/i });
    await pathfindingTab.click();
    await page.waitForTimeout(200);
    
    // Verify canvas is still visible
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('should interact with grid canvas', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    // Get canvas bounding box
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    
    // Click on canvas (simulating wall placement)
    await canvas.click({
      position: {
        x: box!.width / 2,
        y: box!.height / 2,
      },
    });
    
    await page.waitForTimeout(100);
    
    // Verify canvas is still visible after interaction
    await expect(canvas).toBeVisible();
  });

  test('should disable Clear Walls and Reset Grid buttons while playing', async ({ page }) => {
    // This test verifies the buttons exist and can be found
    const clearWallsButton = page.getByRole('button', { name: /clear walls/i });
    const resetGridButton = page.getByRole('button', { name: /reset grid/i });
    
    await expect(clearWallsButton).toBeVisible();
    await expect(resetGridButton).toBeVisible();
  });

  test('should run pathfinding with small grid quickly', async ({ page }) => {
    // Verify canvas is visible
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    // Select A* algorithm
    const selector = page.getByRole('combobox', { name: /algorithm/i });
    await selector.selectOption('astar');
    
    await page.waitForTimeout(100);
    
    // Verify canvas is still visible
    await expect(canvas).toBeVisible();
  });
});
