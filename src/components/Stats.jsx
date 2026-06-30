import React from "react";

/** Displays run metrics: nodes visited, path length, and compute time. */
export default function Stats({ visited, pathLength, time, noPath, isStub }) {
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-value">{visited}</span>
        <span className="stat-label">Nodes Visited</span>
      </div>
      <div className="stat">
        <span className="stat-value">{pathLength}</span>
        <span className="stat-label">Path Length</span>
      </div>
      <div className="stat" title="Median of 11 warmed-up runs">
        <span className="stat-value">{time} ms</span>
        <span className="stat-label">Median Time</span>
      </div>
      {isStub && (
        <div className="stat-message stub">
          This algorithm is a stub — implement it in{" "}
          <code>src/algorithms/</code>.
        </div>
      )}
      {!isStub && noPath && (
        <div className="stat-message warn">No path found.</div>
      )}
    </div>
  );
}
