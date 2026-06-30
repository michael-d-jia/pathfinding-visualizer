import React from "react";
import Node from "./Node.jsx";

/**
 * Renders the 2D grid of Node components. Stateless — all interaction is
 * delegated up to App via the mouse handlers.
 */
export default function Grid({
  grid,
  startNode,
  endNode,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  const cols = grid[0]?.length ?? 0;

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${cols}, var(--cell-size))` }}
      onMouseLeave={onMouseUp}
    >
      {grid.map((row) =>
        row.map((node) => (
          <Node
            key={`${node.row}-${node.col}`}
            row={node.row}
            col={node.col}
            isStart={node.row === startNode.row && node.col === startNode.col}
            isEnd={node.row === endNode.row && node.col === endNode.col}
            isWall={node.isWall}
            weight={node.weight}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
          />
        ))
      )}
    </div>
  );
}
