import React from "react";

const ALGORITHMS = [
  { value: "bfs", label: "Breadth-First Search" },
  { value: "dfs", label: "Depth-First Search (stub)" },
  { value: "dijkstra", label: "Dijkstra (stub)" },
  { value: "astar", label: "A* Search (stub)" },
];

const SPEEDS = [
  { value: 50, label: "Slow" },
  { value: 20, label: "Medium" },
  { value: 5, label: "Fast" },
];

/**
 * Stateless control bar. All values come from App; every change is reported
 * back through callbacks.
 */
export default function Controls({
  algorithm,
  onAlgorithmChange,
  onRun,
  onReset,
  onClearAll,
  onGenerateMaze,
  speed,
  onSpeedChange,
  mouseMode,
  onMouseModeChange,
  weightValue,
  onWeightValueChange,
  isRunning,
}) {
  return (
    <div className="controls">
      <div className="control-group">
        <label className="control-label">Algorithm</label>
        <select
          value={algorithm}
          disabled={isRunning}
          onChange={(e) => onAlgorithmChange(e.target.value)}
        >
          {ALGORITHMS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label className="control-label">Draw mode</label>
        <div className="toggle">
          <button
            className={mouseMode === "wall" ? "active" : ""}
            disabled={isRunning}
            onClick={() => onMouseModeChange("wall")}
          >
            Wall
          </button>
          <button
            className={mouseMode === "weight" ? "active" : ""}
            disabled={isRunning}
            onClick={() => onMouseModeChange("weight")}
          >
            Weight
          </button>
        </div>
      </div>

      {mouseMode === "weight" && (
        <div className="control-group">
          <label className="control-label">Weight: {weightValue}</label>
          <input
            type="range"
            min="2"
            max="5"
            step="1"
            value={weightValue}
            disabled={isRunning}
            onChange={(e) => onWeightValueChange(Number(e.target.value))}
          />
        </div>
      )}

      <div className="control-group">
        <label className="control-label">Speed</label>
        <select
          value={speed}
          disabled={isRunning}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        >
          {SPEEDS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-buttons">
        <button className="btn-primary" disabled={isRunning} onClick={onRun}>
          ▶ Run
        </button>
        <button disabled={isRunning} onClick={onGenerateMaze}>
          Generate Maze
        </button>
        <button disabled={isRunning} onClick={onReset}>
          Reset Path
        </button>
        <button disabled={isRunning} onClick={onClearAll}>
          Clear All
        </button>
      </div>
    </div>
  );
}
