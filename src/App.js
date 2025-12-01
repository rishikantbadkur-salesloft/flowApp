import React, { useMemo } from "react"
import ReactFlow, { Background, Controls, Handle, MarkerType } from "reactflow"
import "reactflow/dist/style.css"


import { backendNodes, backendEdges } from "./data"
import { getLayoutedElements } from "./layout"
import CustomEdge from "./CustomEdge";

function CustomNode({data}){
  return (
    <div style={{padding: 10, border: "1px solid black", borderRadius: 5}}>
      {data.handles?.map(handle => (
        <Handle key={handle.id} id={handle.id} type={handle.type} position={handle.position} style={handle.style} isConnectable={true} />
      ))}
    <div>{data.label}</div>
    </div>
  )
}


export default function App() {
  const nodeTypes = useMemo(() => ({ person: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ default: CustomEdge }), []);
  const defaultEdgeOptions = {
    markerEnd: {
      type: MarkerType.Arrow,
      color: 'green',
    },
    
  };
  const nodes = backendNodes.map((item)=> ({
    id: item.id,
    data: { label: item.name, influence: item.influence },
    position: { x: 0, y: 0 },
    type: 'person',
  }))


  const edges = backendEdges.map((item, index)=> ({
    id: `edge-${item.source}-${item.target}-${index}`,
    source: item.source,
    target: item.target,
    animated: false,
    label: item.relationship,
    style: item.relationship === "influences" ? { stroke: 'green' } : { stroke: 'gray', strokeDasharray: '6' },
  }))


  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const { nodes: lNodes, edges: lEdges } = getLayoutedElements([...nodes], [...edges]);

    // This map will store all handles for a given side of a node.
    // e.g., { 'node-1-right': [{...}, {...}] }
    const handlesByNodeAndSide = new Map();

    // 1. Group all source and target handles by their node and position (side).
    lEdges.forEach(edge => {
      const sourceSide = edge.sourceHandle.split('-')[0];
      const targetSide = edge.targetHandle.split('-')[0];

      const sourceKey = `${edge.source}-${sourceSide}`;
      const targetKey = `${edge.target}-${targetSide}`;

      if (!handlesByNodeAndSide.has(sourceKey)) handlesByNodeAndSide.set(sourceKey, []);
      if (!handlesByNodeAndSide.has(targetKey)) handlesByNodeAndSide.set(targetKey, []);

      handlesByNodeAndSide.get(sourceKey).push({ edgeId: edge.id, type: 'source', baseId: edge.sourceHandle });
      handlesByNodeAndSide.get(targetKey).push({ edgeId: edge.id, type: 'target', baseId: edge.targetHandle });
    });

    // 2. Create unique handle IDs for each edge and prepare the handle data for rendering.
    lNodes.forEach(node => {
      node.data.handles = [];
      const handleSpacing = 20;

      ['top', 'right', 'bottom', 'left'].forEach(side => {
        const key = `${node.id}-${side}`;
        const handlesOnSide = handlesByNodeAndSide.get(key);
        if (!handlesOnSide) return;

        const total = handlesOnSide.length;
        handlesOnSide.forEach((handleInfo, i) => {
          const newHandleId = `${handleInfo.baseId}-${i}`;

          // Find the corresponding edge and update its handle ID
          const edge = lEdges.find(e => e.id === handleInfo.edgeId);
          if (edge) {
            if (handleInfo.type === 'source') edge.sourceHandle = newHandleId;
            else edge.targetHandle = newHandleId;
          }

          // Calculate the centered offset and create the handle for rendering
          const offset = (i - (total - 1) / 2) * handleSpacing;
          const isVertical = side === 'top' || side === 'bottom';
          const transform = isVertical ? `translateX(${offset}px)` : `translateY(${offset}px)`;
          const style = { transform, backgroundColor: handleInfo.type === 'source' ? 'green' : 'transparent' };
          node.data.handles.push({ id: newHandleId, type: handleInfo.type, position: side, style });
        });
      });
    });

    return { nodes: lNodes, edges: lEdges };
  }, [nodes, edges]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow 
        nodes={layoutedNodes} 
        edges={layoutedEdges} 
        fitView 
        fitViewOptions={{padding: 0.2}} 
        nodeTypes={nodeTypes} 
        edgeTypes={edgeTypes} 
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )

}