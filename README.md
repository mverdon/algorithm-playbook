# Algorithm Visualizer Playground

An interactive web application for visualizing sorting and pathfinding algorithms in real-time. Built with Vue 3, TypeScript, and Vite.

## Features

- **Sorting Algorithm Visualizations**
  - Bubble Sort, Quick Sort, Merge Sort, Heap Sort
  - Real-time animation with color-coded states
  - Adjustable animation speed (Slow, Normal, Fast)
  - Configurable array size (5-100 elements)
  - Random array generation and shuffle functionality

- **Pathfinding Algorithm Visualizations**
  - A*, Dijkstra, BFS, DFS
  - Interactive grid with wall placement
  - Drag-and-drop start/end nodes
  - Real-time path discovery animation
  - Multiple maze generation patterns

- **Dark Mode Support**
  - System preference detection
  - Manual theme toggle
  - Persistent theme selection

- **Responsive Design**
  - Works on desktop and tablet devices
  - Clean, modern UI with Tailwind CSS

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd algorithm-playbook
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Usage

### Sorting Visualization

1. Select a sorting algorithm from the dropdown (Bubble, Quick, Merge, or Heap Sort)
2. Adjust the array size using the slider (5-100 elements)
3. Choose animation speed (Slow: 1000ms, Normal: 500ms, Fast: 100ms)
4. Click "Play" to start the visualization
5. Use "Pause" to pause the animation
6. Click "Shuffle" to generate a new random array
7. Use "Reset" to restart the current visualization

### Pathfinding Visualization

1. Select a pathfinding algorithm from the dropdown (A*, Dijkstra, BFS, or DFS)
2. Click on grid cells to add/remove walls
3. Drag the start node (green) to a new position
4. Drag the end node (red) to a new position
5. Choose a maze pattern or create your own walls
6. Select animation speed
7. Click "Find Path" to visualize the algorithm
8. Use "Clear Path" to remove the path while keeping walls
9. Use "Clear Walls" to remove all walls
10. Use "Reset" to clear everything

### Theme Switching

Click the theme toggle button (🌙/☀️) in the header to switch between light and dark modes. Your preference is automatically saved.

## Available Scripts

- `npm run dev` - Start development server with hot-reload (http://localhost:5173)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run unit tests in watch mode
- `npm run test:run` - Run unit tests once
- `npm run test:ui` - Open Vitest UI for interactive test running
- `npm run test:coverage` - Run tests with coverage report

## Algorithms

### Sorting Algorithms

**Bubble Sort**
- Time Complexity: O(n²)
- Space Complexity: O(1)
- Stable: Yes
- Simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.

**Quick Sort**
- Time Complexity: O(n log n) average, O(n²) worst case
- Space Complexity: O(log n)
- Stable: No
- Efficient divide-and-conquer algorithm that picks a pivot element and partitions the array around it.

**Merge Sort**
- Time Complexity: O(n log n)
- Space Complexity: O(n)
- Stable: Yes
- Divide-and-conquer algorithm that divides the array into halves, sorts them, and merges the sorted halves back together.

**Heap Sort**
- Time Complexity: O(n log n)
- Space Complexity: O(1)
- Stable: No
- Comparison-based algorithm that builds a max heap and repeatedly extracts the maximum element.

### Pathfinding Algorithms

**A* (A-Star)**
- Time Complexity: O((V + E) log V)
- Space Complexity: O(V)
- Optimal: Yes (with admissible heuristic)
- Uses both distance from start and estimated distance to goal (heuristic) to find the shortest path efficiently.

**Dijkstra's Algorithm**
- Time Complexity: O((V + E) log V)
- Space Complexity: O(V)
- Optimal: Yes
- Similar to A* but without heuristic; explores uniformly in all directions, guaranteeing the shortest path.

**Breadth-First Search (BFS)**
- Time Complexity: O(V + E)
- Space Complexity: O(V)
- Optimal: Yes (for unweighted graphs)
- Explores level by level, guaranteeing the shortest path in terms of number of edges.

**Depth-First Search (DFS)**
- Time Complexity: O(V + E)
- Space Complexity: O(V)
- Optimal: No
- Explores as far as possible along each branch before backtracking; does not guarantee the shortest path.

## Testing

### Unit Tests

The project uses Vitest for unit testing with comprehensive coverage:

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Open Vitest UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Unit tests cover:
- All sorting algorithms (correctness, animation steps, statistics)
- All pathfinding algorithms (correctness, path optimality, animation)
- Grid utilities (initialization, wall toggling, node placement)
- UI components (rendering, events, accessibility)
- Composables (animation engine, theme management)

### End-to-End Tests

The project uses Playwright for browser-based testing:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Update screenshots
npm run test:e2e:update
```

### Playwright MCP Setup

For development with the Model Context Protocol (MCP) server:

1. Create `.vscode/mcp-servers.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"]
    }
  }
}
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. The MCP server will provide tools for:
   - Taking screenshots
   - Navigating pages
   - Interacting with elements
   - Running assertions

## Project Structure

```
algorithm-playbook/
├── src/
│   ├── algorithms/
│   │   ├── sorting/          # Sorting algorithm implementations
│   │   │   ├── bubbleSort.ts
│   │   │   ├── quickSort.ts
│   │   │   ├── mergeSort.ts
│   │   │   └── heapSort.ts
│   │   └── grid/             # Pathfinding algorithms & utilities
│   │       ├── aStar.ts
│   │       ├── dijkstra.ts
│   │       ├── bfs.ts
│   │       ├── dfs.ts
│   │       └── gridUtils.ts
│   ├── components/           # Vue components
│   │   ├── AlgorithmSelector.vue
│   │   ├── ArraySizeInput.vue
│   │   ├── ControlButtons.vue
│   │   ├── GridVisualizer.vue
│   │   ├── PathfindingPlayground.vue
│   │   ├── SortingPlayground.vue
│   │   ├── SortingVisualizer.vue
│   │   ├── SpeedControl.vue
│   │   └── ThemeToggle.vue
│   ├── composables/          # Vue composables
│   │   ├── useAnimationEngine.ts
│   │   ├── useGridInteraction.ts
│   │   └── useTheme.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── algorithms.ts
│   │   └── grid.ts
│   ├── utils/                # Utility functions
│   ├── App.vue               # Root component
│   ├── main.ts               # Application entry point
│   └── style.css             # Global styles
├── tests/
│   ├── algorithms/           # Algorithm unit tests
│   ├── components/           # Component unit tests
│   ├── composables/          # Composable unit tests
│   ├── e2e/                  # End-to-end tests
│   └── fixtures/             # Test fixtures
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── vitest.config.ts          # Vitest configuration
├── playwright.config.ts      # Playwright configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing
- **Canvas API** - High-performance rendering

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Algorithm implementations inspired by classic computer science literature
- UI design influenced by modern web application patterns
- Built with modern web technologies and best practices
