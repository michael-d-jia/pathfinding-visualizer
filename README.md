# Pathfinding Visualizer

An interactive pathfinding algorithm visualizer built with **Vite + React (JavaScript)**.
Watch search algorithms explore a grid with a smooth animated wave, then trace the
shortest path. Draw walls, drop weighted tiles, generate mazes, and drag the
start/end nodes around. View at [site](michael-d-jia.github.io/pathfinding-visualizer)

> **Status:** Breadth-First Search is fully implemented. Depth-First Search,
> Dijkstra, and A\* are intentionally left as **stubs** for you to complete —
> see [What still needs to be worked on](#what-still-needs-to-be-worked-on).

## Features

- 25 × 50 grid with draggable **start** and **end** nodes
- Draw **walls** or **weighted tiles** (weights 2–5, color-coded) by click-and-drag
- **Recursive-backtracking maze** generator
- Animated **visited wave** + **golden shortest-path** trace
- Adjustable animation **speed** (fast / medium / slow)
- Live **stats**: nodes visited, path length, and median compute time

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## What still needs to be worked on

Three algorithms are stubs. Each **already wires into the UI** — pick it from the
Algorithm dropdown and the app will call it — but it currently returns empty
arrays, so nothing animates and a reminder banner appears under the stats.

| Algorithm            | File                                                     | What to do |
| -------------------- | -------------------------------------------------------- | ---------- |
| Depth-First Search   | [`src/algorithms/dfs.js`](src/algorithms/dfs.js)         | Implement with a stack (LIFO). Finds *a* path, not the shortest. |
| Dijkstra             | [`src/algorithms/dijkstra.js`](src/algorithms/dijkstra.js) | Implement with a priority queue; respect each node's `weight`. |
| A\* Search           | [`src/algorithms/astar.js`](src/algorithms/astar.js)     | Like Dijkstra, but order the queue by `f = g + h` using a Manhattan-distance heuristic. |

**Where to look:**

- Each stub file has a header comment describing the **data structure, core
  idea, and time/space complexity**, plus numbered `// Step 1…4` TODOs inside the
  function telling you exactly what to write.
- **[`src/algorithms/bfs.js`](src/algorithms/bfs.js) is your reference
  implementation.** Its `getNeighbors()` and `reconstructPath()` helpers are the
  same patterns the stubs need — copy/adapt them.

**The contract every algorithm must follow** (already set up in the stubs):

```js
export default function algorithm(grid, startNode, endNode) {
  // ...
  return { visitedNodesInOrder: [], shortestPath: [] };
}
```

- `visitedNodesInOrder` — nodes in the order they were explored (drives the
  visited-wave animation).
- `shortestPath` — the final path from start → end (drives the golden trace).
  Return `[]` if no path exists.

Once a stub returns real arrays, it animates automatically — no other code needs
to change.

### Nice-to-have extensions

- Diagonal movement (8-directional neighbors)
- Bidirectional search / Swarm / Greedy Best-First
- A binary-heap priority queue (the array scan is fine for 25×50, but a heap
  scales better)
- Save/load board layouts; adjustable grid size

## Project structure

```
src/
  App.jsx                 root component — ALL state lives here
  components/
    Grid.jsx              renders the 2D array of nodes
    Node.jsx              single cell (React.memo)
    Controls.jsx          algorithm / speed / draw-mode controls
    Stats.jsx             visited count, path length, median time
  algorithms/
    bfs.js                ✅ fully implemented (reference)
    dfs.js                🧩 stub
    dijkstra.js           🧩 stub
    astar.js              🧩 stub
    mazeGenerator.js      recursive backtracking maze
  styles/
    index.css             theme variables + base
    App.css               layout / controls / stats
    Node.css              node states + keyframe animations
```

## How it works

### Animation stays fast via direct DOM updates

Animating 1000+ nodes through React state would re-render the whole grid every
frame and lag badly. Instead, algorithms return the **visit order**, and
`App.jsx` walks that array with `setTimeout`, toggling CSS classes **directly on
the DOM** (`getElementById`). React only owns the structural state (walls,
weights, start/end positions); the `visited` / `path` classes are applied
outside React. The speed slider sets the per-node `setTimeout` delay
(fast 5 ms · medium 20 ms · slow 50 ms).

### Comparable timing

The "Median Time" stat warms up the JIT, then runs the algorithm 11 times on
fresh grid clones and reports the **median** — far steadier than a single
sub-millisecond measurement clamped by the browser's clock resolution. For a
truly hardware-independent comparison, lean on **Nodes Visited**: it's
deterministic and is exactly what the algorithms compete on.

## Deploying to GitHub Pages

`vite.config.js` uses `base: "./"`, so the build works on a project page without
hardcoding the repo name. The workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
publishes `dist/` on every push to `main`.

1. Push the repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. Push to `main` (or run the workflow manually) — your site deploys to
   `https://<username>.github.io/<repo>/`.

## License

MIT — use it however you like.
