import { BaseEdge, EdgeLabelRenderer, getSimpleBezierPath } from '@xyflow/react';


function getBezierTangent(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  
  // Derivative of cubic bezier
  const dx = 3 * (mt2 * (p1.x - p0.x) + 2 * mt * t * (p2.x - p1.x) + t2 * (p3.x - p2.x));
  const dy = 3 * (mt2 * (p1.y - p0.y) + 2 * mt * t * (p2.y - p1.y) + t2 * (p3.y - p2.y));
  
  return Math.atan2(dy, dx) * 180 / Math.PI;
}

function extractControlPoints(pathString) {
  const match = pathString.match(/M([\d.-]+),([\d.-]+).*?C([\d.-]+),([\d.-]+)\s([\d.-]+),([\d.-]+)\s([\d.-]+),([\d.-]+)/);
  if (match) {
    return {
      p0: { x: parseFloat(match[1]), y: parseFloat(match[2]) },
      p1: { x: parseFloat(match[3]), y: parseFloat(match[4]) },
      p2: { x: parseFloat(match[5]), y: parseFloat(match[6]) },
      p3: { x: parseFloat(match[7]), y: parseFloat(match[8]) }
    };
  }
  return null;
}

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
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const controlPoints = extractControlPoints(edgePath);
  let angle = 0;

  if (controlPoints) {
    angle = getBezierTangent(controlPoints.p0, controlPoints.p1, controlPoints.p2, controlPoints.p3, 0.5);
  }

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
            padding: '0px 2px',
            borderRadius: 2,
            fontSize: 8,
            color: label === "influences" ? 'darkgreen' : 'blue',
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}