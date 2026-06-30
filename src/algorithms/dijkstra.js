/**
 * Dijkstra's Algorithm — shortest path on a weighted graph.
 *
 * Data structure: a priority queue (min-heap) keyed by distance from start.
 *   A plain array that you scan for the minimum works for small grids, but a
 *   binary heap keeps it efficient as the grid grows.
 * Core idea: Maintain the best-known distance to every node (start = 0, rest =
 *   Infinity). Repeatedly pull the closest unsettled node, "settle" it, and
 *   relax each neighbor: if going through the current node is cheaper, update the
 *   neighbor's distance and remember current as its previous node. Because edges
 *   carry the node's `weight` (1–5), Dijkstra respects weighted tiles where BFS
 *   would not. The first time you settle the end node you have its shortest cost.
 * Time complexity:  O((V + E) log V) with a binary heap.
 * Space complexity: O(V)
 *
 * Edge weight note: the cost to MOVE INTO a neighbor is that neighbor's
 *   `weight` (default 1). Use `neighbor.weight` when relaxing, not a constant 1.
 */
export default function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const shortestPath = [];

  // TODO: Implement Dijkstra's algorithm.
  // Step 1: Set startNode.distance = 0 and every other node's distance = Infinity
  //         (store these in a Map so you don't mutate the grid permanently).
  //         Put all non-wall nodes into a priority queue ordered by distance.
  // Step 2: While the queue is not empty, extract the node with the smallest
  //         distance. If its distance is Infinity, the remaining nodes are
  //         unreachable — stop. Push the node to visitedNodesInOrder. If it is
  //         the endNode, stop.
  // Step 3: For each neighbor, compute candidate = current.distance +
  //         neighbor.weight. If candidate < neighbor.distance, update it and set
  //         previous[neighbor] = current.
  // Step 4: Reconstruct shortestPath by following `previous` from endNode back to
  //         startNode (unshift each node).

  return { visitedNodesInOrder, shortestPath };
}
