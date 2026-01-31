import { Page } from '@playwright/test';

/**
 * Helper utilities for Playwright tests
 */

/**
 * Wait for a canvas element to be visible and rendered
 * @param page - The Playwright page object
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 */
export async function waitForCanvasReady(page: Page, timeout: number = 5000): Promise<void> {
  const canvas = page.locator('canvas').first();
  await canvas.waitFor({ state: 'visible', timeout });
  
  // Additional check: ensure canvas has dimensions
  const box = await canvas.boundingBox();
  if (!box || box.width === 0 || box.height === 0) {
    throw new Error('Canvas is visible but has no dimensions');
  }
}

/**
 * Wait for animation to complete
 * Waits for a specified duration and checks if the play button is enabled
 * @param page - The Playwright page object
 * @param maxWaitMs - Maximum time to wait in milliseconds (default: 10000)
 */
export async function waitForAnimationComplete(page: Page, maxWaitMs: number = 10000): Promise<void> {
  const startTime = Date.now();
  
  // Wait for play button to be enabled (animation is complete or stopped)
  while (Date.now() - startTime < maxWaitMs) {
    const playButton = page.locator('button[aria-label*="Play"]');
    const isDisabled = await playButton.isDisabled();
    
    if (!isDisabled) {
      // Animation has completed or stopped
      return;
    }
    
    // Wait a bit before checking again
    await page.waitForTimeout(100);
  }
  
  throw new Error(`Animation did not complete within ${maxWaitMs}ms`);
}

/**
 * Take a screenshot of a specific element
 * @param page - The Playwright page object
 * @param selector - CSS selector for the element to screenshot
 * @param path - Optional path to save the screenshot
 * @returns Buffer containing the screenshot data
 */
export async function takeElementScreenshot(
  page: Page,
  selector: string,
  path?: string
): Promise<Buffer> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  return element.screenshot({ path });
}

/**
 * Take a screenshot of the canvas element
 * @param page - The Playwright page object
 * @param path - Optional path to save the screenshot
 * @returns Buffer containing the screenshot data
 */
export async function takeCanvasScreenshot(page: Page, path?: string): Promise<Buffer> {
  return takeElementScreenshot(page, 'canvas', path);
}

/**
 * Switch to the sorting algorithms tab
 * @param page - The Playwright page object
 */
export async function switchToSortingTab(page: Page): Promise<void> {
  const sortingTab = page.getByRole('button', { name: /sorting algorithms/i });
  await sortingTab.click();
  await page.waitForTimeout(200); // Wait for tab switch animation
}

/**
 * Switch to the pathfinding algorithms tab
 * @param page - The Playwright page object
 */
export async function switchToPathfindingTab(page: Page): Promise<void> {
  const pathfindingTab = page.getByRole('button', { name: /pathfinding algorithms/i });
  await pathfindingTab.click();
  await page.waitForTimeout(200); // Wait for tab switch animation
}

/**
 * Select a sorting algorithm from the dropdown
 * @param page - The Playwright page object
 * @param algorithm - Algorithm value ('bubble', 'quick', 'merge', 'heap')
 */
export async function selectSortingAlgorithm(page: Page, algorithm: string): Promise<void> {
  const selector = page.getByRole('combobox', { name: /algorithm/i });
  await selector.selectOption(algorithm);
  await page.waitForTimeout(100); // Brief wait for selection to apply
}

/**
 * Select a pathfinding algorithm from the dropdown
 * @param page - The Playwright page object
 * @param algorithm - Algorithm value ('astar', 'dijkstra', 'bfs', 'dfs')
 */
export async function selectPathfindingAlgorithm(page: Page, algorithm: string): Promise<void> {
  const selector = page.getByRole('combobox', { name: /algorithm/i });
  await selector.selectOption(algorithm);
  await page.waitForTimeout(100); // Brief wait for selection to apply
}

/**
 * Set the animation speed
 * @param page - The Playwright page object
 * @param speed - Speed value (1000 for slow, 500 for normal, 100 for fast)
 */
export async function setAnimationSpeed(page: Page, speed: number): Promise<void> {
  const speedControl = page.getByRole('combobox', { name: /speed/i });
  await speedControl.selectOption(speed.toString());
  await page.waitForTimeout(100);
}

/**
 * Set the array size for sorting visualizations
 * @param page - The Playwright page object
 * @param size - Array size (typically between 5 and 100)
 */
export async function setArraySize(page: Page, size: number): Promise<void> {
  const sizeInput = page.locator('input[type="range"]');
  await sizeInput.fill(size.toString());
  await page.waitForTimeout(100); // Wait for re-render
}

/**
 * Click the play button to start animation
 * @param page - The Playwright page object
 */
export async function clickPlay(page: Page): Promise<void> {
  const playButton = page.locator('button[aria-label*="Play"]');
  await playButton.click();
}

/**
 * Click the pause button to pause animation
 * @param page - The Playwright page object
 */
export async function clickPause(page: Page): Promise<void> {
  const pauseButton = page.locator('button[aria-label*="Pause"]');
  await pauseButton.click();
}

/**
 * Click the reset button
 * @param page - The Playwright page object
 */
export async function clickReset(page: Page): Promise<void> {
  const resetButton = page.locator('button[aria-label*="Reset"]');
  await resetButton.click();
  await page.waitForTimeout(100);
}

/**
 * Click the shuffle button
 * @param page - The Playwright page object
 */
export async function clickShuffle(page: Page): Promise<void> {
  const shuffleButton = page.locator('button[aria-label*="Shuffle"]');
  await shuffleButton.click();
  await page.waitForTimeout(200);
}

/**
 * Toggle the theme (dark/light mode)
 * @param page - The Playwright page object
 */
export async function toggleTheme(page: Page): Promise<void> {
  const themeToggle = page.getByRole('button', { name: /switch to/i });
  await themeToggle.click();
  await page.waitForTimeout(100);
}

/**
 * Check if dark mode is enabled
 * @param page - The Playwright page object
 * @returns True if dark mode is enabled, false otherwise
 */
export async function isDarkMode(page: Page): Promise<boolean> {
  const html = page.locator('html');
  return html.evaluate(el => el.classList.contains('dark'));
}

/**
 * Navigate to the home page
 * @param page - The Playwright page object
 */
export async function navigateToHome(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for the page to be fully loaded and ready
 * @param page - The Playwright page object
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // Wait for canvas to be ready
  await waitForCanvasReady(page);
}
