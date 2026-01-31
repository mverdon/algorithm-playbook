// Test fixtures for grid-based pathfinding algorithms

export interface GridNode {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  distance: number;
  visited: boolean;
}

export const createEmptyGrid = (rows: number, cols: number): GridNode[][] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isWall: false,
      isStart: false,
      isEnd: false,
      distance: Infinity,
      visited: false
    }))
  );
};

export const smallGrid = createEmptyGrid(5, 5);
smallGrid[0][0].isStart = true;
smallGrid[4][4].isEnd = true;

export const gridWithWalls = createEmptyGrid(10, 10);
gridWithWalls[0][0].isStart = true;
gridWithWalls[9][9].isEnd = true;
// Create a wall pattern
for (let i = 1; i < 9; i++) {
  gridWithWalls[i][5].isWall = true;
}

export const mazeGrid = createEmptyGrid(15, 15);
mazeGrid[0][0].isStart = true;
mazeGrid[14][14].isEnd = true;
// Create a maze-like pattern
for (let i = 2; i < 13; i += 3) {
  for (let j = 1; j < 14; j++) {
    if (j !== 7) {
      mazeGrid[i][j].isWall = true;
    }
  }
}
