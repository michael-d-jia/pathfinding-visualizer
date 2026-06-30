/**
 * A* Search — Dijkstra guided by a heuristic toward the goal.
 *
 * Data structure: a priority queue (min-heap) ordered by f = g + h.
 * Core idea: Like Dijkstra, but instead of always expanding the closest node by
 *   distance-from-start (g), A* expands the node with the lowest f = g + h, where
 *   h is an estimate of the remaining distance to the end. This steers the search
 *   toward the goal, so A* usually visits far fewer nodes than Dijkstra while
 *   still returning an optimal path (as long as h never overestimates).
 *
 *   g(n) = actual cost from start to n (sum of weights moved into, like Dijkstra)
 *   h(n) = heuristic estimate from n to end
 *   f(n) = g(n) + h(n)  ← the priority
 *
 * Heuristic: use Manhattan distance, since movement is 4-directional (no
 *   diagonals): h = |n.row - end.row| + |n.col - end.col|.
 * Time complexity:  O((V + E) log V) worst case; typically much better.
 * Space complexity: O(V)
 */
export default function astar(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const shortestPath = [];

  // TODO: Implement A* search.
  // Step 1: Track g-scores (cost from start) in a Map, all Infinity except
  //         startNode = 0. Define heuristic(node) = Manhattan distance to
  //         endNode. Put startNode in a priority queue keyed by f = g + h.
  // Step 2: While the queue is not empty, pop the node with the lowest f. Push it
  //         to visitedNodesInOrder. If it is the endNode, stop.
  // Step 3: For each non-wall neighbor, tentativeG = g[current] +
  //         neighbor.weight. If tentativeG < g[neighbor], update g[neighbor],
  //         set previous[neighbor] = current, and (re)insert the neighbor into
  //         the queue with priority f = tentativeG + heuristic(neighbor).
  // Step 4: Reconstruct shortestPath by following `previous` from endNode back to
  //         startNode (unshift each node).

  return { visitedNodesInOrder, shortestPath };
}
