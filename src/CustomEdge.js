import { getBezierPath, EdgeText } from 'reactflow';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  label,
  markerEnd, // Receive the markerEnd prop
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

  // Heuristic to approximate text width for the background rectangle
  const labelWidth = label.length;
  const labelHeight = 14;

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 1, fill: 'none' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd} // Apply the marker to the end of the path
      />
      <g transform={`translate(${labelX}, ${labelY})`}>
        <rect
          x={-labelWidth / 2}
          y={-labelHeight / 2}
          width={labelWidth}
          height={labelHeight}
          fill="white"
          rx={3}
          ry={3}
        />
        <text
          style={{ fontSize: '12px', fill: '#555' }}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </g>
    </>
  );
}