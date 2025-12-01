import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  label,
  markerEnd,
  style,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate the angle of the straight line between the source and target points.
  let angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;

  // When the angle is outside the comfortable reading range, rotate it 180 degrees.
  if (angle > 90 || angle < -90) {
    angle += 180;
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) rotate(${angle}deg)`,
            background: label === "influences" ? 'lightgreen' : 'lightblue',
            padding: '2px 4px',
            borderRadius: 5,
            fontSize: 8,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}