import React, { useCallback, useEffect, useRef, useState } from "react";
import Grid from "./components/Grid.jsx";
import Controls from "./components/Controls.jsx";
import Stats from "./components/Stats.jsx";

import bfs from "./algorithms/bfs.js";
import dfs from "./algorithms/dfs.js";
import dijkstra from "./algorithms/dijkstra.js";
import astar from "./algorithms/astar.js";
import generateMaze from "./algorithms/mazeGenerator.js";

import "./styles/App.css";
import "./styles/Node.css";

const ROWS = 25;
const COLS = 50;
const START = { row: 12, col: 5 };
const END = { row: 12, col: 44 };

const ALGORITHMS = { bfs, dfs, dijkstra, astar };
const STUBS = new Set(["dfs", "dijkstra", "astar"]);

function createNode(row, col) {
  return {
    row,
    col,
    isWall: false,
    weight: 1,
    status: "unvisited",
  };
}

function createGrid() {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) currentRow.push(createNode(row, col));
    grid.push(currentRow);
  }
  return grid;
}

/** Shallow-clone every node so a timed run can't leak state into the next. */
function cloneGrid(grid) {
  return grid.map((row) => row.map((node) => ({ ...node })));
}

/**
 * Measure an algorithm's compute time in a way that's comparable across
 * algorithms: warm up the JIT, then take the MEDIAN of several runs (the median
 * rejects GC/scheduler outliers better than a mean). Each run gets a fresh grid
 * clone so repeated executions stay independent. Returns milliseconds.
 */
function benchmark(algoFn, grid, startNode, endNode, samples = 11, warmup = 3) {
  const runOnce = () => {
    const g = cloneGrid(grid);
    algoFn(g, g[startNode.row][startNode.col], g[endNode.row][endNode.col]);
  };

  for (let i = 0; i < warmup; i++) runOnce();

  const times = [];
  for (let i = 0; i < samples; i++) {
    const g = cloneGrid(grid);
    const s = g[startNode.row][startNode.col];
    const e = g[endNode.row][endNode.col];
    const t0 = performance.now();
    algoFn(g, s, e);
    const t1 = performance.now();
    times.push(t1 - t0);
  }

  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)]; // median
}

export default function App() {
  const [grid, setGrid] = useState(createGrid);
  const [startNode, setStartNode] = useState(START);
  const [endNode, setEndNode] = useState(END);
  const [algorithm, setAlgorithm] = useState("bfs");
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(20);
  const [mouseMode, setMouseMode] = useState("wall");
  const [weightValue, setWeightValue] = useState(5);
  const [stats, setStats] = useState({
    visited: 0,
    pathLength: 0,
    time: "0.00",
    noPath: false,
    isStub: false,
  });

  // Mouse / drag bookkeeping kept in refs so it never triggers a re-render.
  const isMouseDown = useRef(false);
  const dragMode = useRef(null); // 'draw' | 'erase' | 'start' | 'end'
  const timeouts = useRef([]);

  // keep latest start/end available to ref-based mouse handlers
  const startRef = useRef(startNode);
  const endRef = useRef(endNode);
  useEffect(() => {
    startRef.current = startNode;
  }, [startNode]);
  useEffect(() => {
    endRef.current = endNode;
  }, [endNode]);

  useEffect(() => () => clearTimeouts(), []);

  function clearTimeouts() {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
  }

  /* ------------------------- Drawing / interaction ------------------------- */

  const applyNode = useCallback(
    (row, col, mode) => {
      const s = startRef.current;
      const e = endRef.current;
      if (
        (row === s.row && col === s.col) ||
        (row === e.row && col === e.col)
      ) {
        return; // never paint over start/end
      }
      setGrid((prev) => {
        const node = prev[row][col];
        let next;
        if (mode === "erase") next = { ...node, isWall: false, weight: 1 };
        else if (mode === "weight")
          next = { ...node, isWall: false, weight: weightValue };
        else next = { ...node, isWall: true, weight: 1 }; // 'wall'
        if (
          next.isWall === node.isWall &&
          next.weight === node.weight
        ) {
          return prev; // no change → skip re-render
        }
        const newGrid = prev.slice();
        newGrid[row] = prev[row].slice();
        newGrid[row][col] = next;
        return newGrid;
      });
    },
    [weightValue]
  );

  const handleMouseDown = useCallback(
    (row, col) => {
      if (isRunning) return;
      isMouseDown.current = true;
      const s = startRef.current;
      const e = endRef.current;

      if (row === s.row && col === s.col) {
        dragMode.current = "start";
        return;
      }
      if (row === e.row && col === e.col) {
        dragMode.current = "end";
        return;
      }

      const node = grid[row][col];
      if (mouseMode === "wall") {
        dragMode.current = node.isWall ? "erase" : "draw";
      } else {
        dragMode.current = node.weight > 1 ? "erase" : "weight";
      }
      applyNode(row, col, dragMode.current);
    },
    [isRunning, grid, mouseMode, applyNode]
  );

  const handleMouseEnter = useCallback(
    (row, col) => {
      if (!isMouseDown.current || isRunning) return;
      const mode = dragMode.current;

      if (mode === "start") {
        const e = endRef.current;
        if (row === e.row && col === e.col) return;
        if (grid[row][col].isWall) return;
        setStartNode({ row, col });
      } else if (mode === "end") {
        const s = startRef.current;
        if (row === s.row && col === s.col) return;
        if (grid[row][col].isWall) return;
        setEndNode({ row, col });
      } else if (mode) {
        applyNode(row, col, mode);
      }
    },
    [isRunning, grid, applyNode]
  );

  const handleMouseUp = useCallback(() => {
    isMouseDown.current = false;
    dragMode.current = null;
  }, []);

  /* ------------------------------ Animation ------------------------------- */

  function clearAnimationClasses() {
    document
      .querySelectorAll(".node-visited, .node-path")
      .forEach((el) => el.classList.remove("node-visited", "node-path"));
  }

  function animate(visitedNodesInOrder, shortestPath) {
    const s = startRef.current;
    const e = endRef.current;
    const isEndpoint = (n) =>
      (n.row === s.row && n.col === s.col) ||
      (n.row === e.row && n.col === e.col);

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      const t = setTimeout(() => {
        if (!isEndpoint(node)) {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el) el.classList.add("node-visited");
        }
      }, speed * i);
      timeouts.current.push(t);
    }

    const afterVisited = speed * visitedNodesInOrder.length;

    for (let i = 0; i < shortestPath.length; i++) {
      const node = shortestPath[i];
      const t = setTimeout(() => {
        if (!isEndpoint(node)) {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el) el.classList.add("node-path");
        }
      }, afterVisited + 40 * i);
      timeouts.current.push(t);
    }

    const total = afterVisited + 40 * shortestPath.length + 50;
    const done = setTimeout(() => setIsRunning(false), total);
    timeouts.current.push(done);
  }

  /* ------------------------------- Actions -------------------------------- */

  const handleRun = useCallback(() => {
    if (isRunning) return;
    clearTimeouts();
    clearAnimationClasses();

    const algoFn = ALGORITHMS[algorithm];
    const startN = grid[startNode.row][startNode.col];
    const endN = grid[endNode.row][endNode.col];

    const { visitedNodesInOrder, shortestPath } = algoFn(grid, startN, endN);

    // Median of several warmed-up runs → comparable between algorithms.
    const elapsed =
      visitedNodesInOrder.length > 0
        ? benchmark(algoFn, grid, startN, endN)
        : 0;

    const isStub = STUBS.has(algorithm);
    setStats({
      visited: visitedNodesInOrder.length,
      pathLength: shortestPath.length > 0 ? shortestPath.length - 1 : 0,
      time: elapsed.toFixed(3),
      noPath: visitedNodesInOrder.length > 0 && shortestPath.length === 0,
      isStub: isStub && visitedNodesInOrder.length === 0,
    });

    if (visitedNodesInOrder.length === 0) return; // stub / nothing to animate

    setIsRunning(true);
    animate(visitedNodesInOrder, shortestPath);
  }, [isRunning, algorithm, grid, startNode, endNode, speed]);

  const handleReset = useCallback(() => {
    if (isRunning) return;
    clearTimeouts();
    clearAnimationClasses();
    setStats({
      visited: 0,
      pathLength: 0,
      time: "0.00",
      noPath: false,
      isStub: false,
    });
  }, [isRunning]);

  const handleClearAll = useCallback(() => {
    if (isRunning) return;
    clearTimeouts();
    clearAnimationClasses();
    setGrid(createGrid());
    setStats({
      visited: 0,
      pathLength: 0,
      time: "0.00",
      noPath: false,
      isStub: false,
    });
  }, [isRunning]);

  const handleGenerateMaze = useCallback(() => {
    if (isRunning) return;
    clearTimeouts();
    clearAnimationClasses();

    const fresh = createGrid();
    const walls = generateMaze(fresh, startNode, endNode);
    walls.forEach(({ row, col }) => {
      fresh[row][col] = { ...fresh[row][col], isWall: true, weight: 1 };
    });
    setGrid(fresh);
  }, [isRunning, startNode, endNode]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          Pathfinding<span>Visualizer</span>
        </h1>
        <p className="subtitle">
          BFS is implemented · DFS, Dijkstra &amp; A* are stubs waiting for you
        </p>
      </header>

      <Controls
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        onRun={handleRun}
        onReset={handleReset}
        onClearAll={handleClearAll}
        onGenerateMaze={handleGenerateMaze}
        speed={speed}
        onSpeedChange={setSpeed}
        mouseMode={mouseMode}
        onMouseModeChange={setMouseMode}
        weightValue={weightValue}
        onWeightValueChange={setWeightValue}
        isRunning={isRunning}
      />

      <Stats {...stats} />

      <Legend />

      <div className="grid-wrap">
        <Grid
          grid={grid}
          startNode={startNode}
          endNode={endNode}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
      </div>

      <p className="hint">
        Drag the <strong>start</strong> / <strong>end</strong> nodes to move
        them · click &amp; drag to draw walls or weights (drag over an existing
        one to erase).
      </p>
    </div>
  );
}

function Legend() {
  return (
    <div className="legend">
      <span className="lg lg-start">Start</span>
      <span className="lg lg-end">End</span>
      <span className="lg lg-wall">Wall</span>
      <span className="lg lg-weight">Weight</span>
      <span className="lg lg-visited">Visited</span>
      <span className="lg lg-path">Path</span>
    </div>
  );
}
