/**
 * Recursive Backtracking maze generation.
 *
 * Treats the grid as a lattice of "cells" two apart, with walls between them.
 * Starting from a cell, it carves a passage to a random unvisited neighbor,
 * recursing (via an explicit stack) until it dead-ends, then backtracks. The
 * result is a "perfect" maze: exactly one path between any two open cells.
 *
 * Returns the list of wall coordinates to apply to the grid. The caller is
 * responsible for keeping the start/end nodes open.
 *
 * @returns {{ row: number, col: number }[]} coordinates that should be walls.
 */
export default function generateMaze(grid, startNode, endNode) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Begin with everything solid; we'll carve passages out of it.
  const wall = Array.from({ length: rows }, () => Array(cols).fill(true));

  const stack = [[1, 1]];
  wall[1][1] = false;

  // Steps of 2 so we always leave a wall between adjacent passage cells.
  const directions = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];

    const candidates = shuffle(directions).filter(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      return nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && wall[nr][nc];
    });

    if (candidates.length === 0) {
      stack.pop();
      continue;
    }

    const [dr, dc] = candidates[0];
    const nr = r + dr;
    const nc = c + dc;

    // Carve the destination cell and the wall between it and the current cell.
    wall[nr][nc] = false;
    wall[r + dr / 2][c + dc / 2] = false;
    stack.push([nr, nc]);
  }

  const isEndpoint = (r, c) =>
    (r === startNode.row && c === startNode.col) ||
    (r === endNode.row && c === endNode.col);

  const walls = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (wall[r][c] && !isEndpoint(r, c)) walls.push({ row: r, col: c });
    }
  }
  return walls;
}

/** Fisher–Yates shuffle on a copy of the array. */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
