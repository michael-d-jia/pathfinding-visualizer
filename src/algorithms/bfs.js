/**
 * Breadth-First Search (BFS) — explores the grid in expanding "rings".
 *
 * Data structure: FIFO queue.
 * Core idea: Visit the start, then all its neighbors, then their neighbors, and
 *   so on. Because every edge has the same cost (1 step), the first time BFS
 *   reaches the end node it has found a shortest path (by number of steps).
 *   NOTE: BFS ignores node weights — for weighted grids use Dijkstra/A*.
 * Time complexity:  O(V + E)
 * Space complexity: O(V)
 *
 * @param {Array<Array<Object>>} grid - 2D array of node objects.
 * @param {Object} startNode - the node to search from.
 * @param {Object} endNode   - the target node.
 * @returns {{ visitedNodesInOrder: Object[], shortestPath: Object[] }}
 */
export default function bfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];

  // previousNode lets us rebuild the path once we reach the end.
  const previous = new Map();
  const visited = new Set();

  const key = (node) => `${node.row}-${node.col}`;

  const queue = [startNode];
  visited.add(key(startNode));

  while (queue.length > 0) {
    const current = queue.shift();

    // Walls are impassable.
    if (current.isWall) continue;

    visitedNodesInOrder.push(current);

    // Found the target — stop and reconstruct the path.
    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        shortestPath: reconstructPath(previous, startNode, endNode),
      };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      if (visited.has(key(neighbor)) || neighbor.isWall) continue;
      visited.add(key(neighbor));
      previous.set(key(neighbor), current);
      queue.push(neighbor);
    }
  }

  // No path exists.
  return { visitedNodesInOrder, shortestPath: [] };
}

/** Returns the 4-directional neighbors (up, right, down, left) inside the grid. */
function getNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  return neighbors;
}

/** Walks the `previous` chain back from end → start, returning start → end. */
function reconstructPath(previous, startNode, endNode) {
  const path = [];
  const key = (node) => `${node.row}-${node.col}`;
  let current = endNode;

  while (current && key(current) !== key(startNode)) {
    path.unshift(current);
    current = previous.get(key(current));
  }
  if (current) path.unshift(startNode);
  return path;
}
