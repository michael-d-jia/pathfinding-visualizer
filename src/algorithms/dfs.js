/**
 * Depth-First Search (DFS) — dives as deep as possible before backtracking.
 *
 * Data structure: a stack (LIFO) — either an explicit array you push/pop, or
 *   the call stack via recursion.
 * Core idea: From the current node, pick a neighbor and go there immediately,
 *   repeating until you hit a dead end, then backtrack to the last node with an
 *   unexplored neighbor. DFS finds *a* path but NOT necessarily the shortest,
 *   so the "shortest path" it returns is really just "the path DFS happened to
 *   take" to the end node.
 * Time complexity:  O(V + E)
 * Space complexity: O(V)
 */
export default function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const shortestPath = [];

  // TODO: Implement depth-first search.
  // Step 1: Create a stack and push startNode onto it. Keep a `visited` Set
  //         (key nodes by `${row}-${col}`) and a `previous` Map for the path.
  // Step 2: While the stack is not empty, pop a node. Skip it if it's a wall or
  //         already visited. Otherwise mark it visited and push it onto
  //         visitedNodesInOrder. If it's the endNode, stop.
  // Step 3: Push each unvisited, non-wall neighbor onto the stack and record
  //         `previous[neighbor] = current` so you can rebuild the path.
  // Step 4: After reaching the end, walk the `previous` map back from endNode to
  //         startNode and unshift each node into shortestPath.
  //
  // Reuse the neighbor-gathering and path-reconstruction patterns from bfs.js.

  return { visitedNodesInOrder, shortestPath };
}
