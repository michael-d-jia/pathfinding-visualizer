import React from "react";

/**
 * A single grid cell. Its base appearance (start/end/wall/weight) is driven by
 * props → CSS classes. The transient "visited" / "path" states are added
 * directly to the DOM during animation (see App.jsx), NOT through React, so
 * animating 1000+ nodes doesn't trigger 1000 re-renders.
 *
 * Wrapped in React.memo so that drawing one wall only re-renders that one node.
 */
function Node({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  weight,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  let className = "node";
  if (isStart) className += " node-start";
  else if (isEnd) className += " node-end";
  else if (isWall) className += " node-wall";
  else if (weight > 1) className += ` node-weight node-weight-${weight}`;

  return (
    <div
      id={`node-${row}-${col}`}
      className={className}
      data-row={row}
      data-col={col}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      {weight > 1 && !isWall && !isStart && !isEnd ? (
        <span className="node-weight-label">{weight}</span>
      ) : null}
    </div>
  );
}

export default React.memo(Node);
