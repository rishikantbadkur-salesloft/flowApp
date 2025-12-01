import dagre from "dagre"

const influenceRank = {
    high:0,
    medium:1,
    low:2
}

export const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'BT', ranker: 'network-simplex', nodesep: 50, ranksep: 70 });

    nodes.forEach((node)=> {
        dagreGraph.setNode(node.id, { width: 150, height: 80, rank: influenceRank[node.data.influence] });
    })

    edges.forEach((edge)=> {
        dagreGraph.setEdge(edge.source, edge.target);
    
    })


    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const pos = dagreGraph.node(node.id);

        let jitterX = 0
        let jitterY = 0

        
        jitterX = 0;
        jitterY = (Math.random() - 0.5) * 40;
        
        node.position = {
            x: pos.x + jitterX,
            y: pos.y + jitterY,
            
        };
        
    })

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    const layoutedEdges = edges.map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
 
        const dx = targetNode.position.x - sourceNode.position.x;
        const dy = targetNode.position.y - sourceNode.position.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal connection is more prominent
            if (dx > 0) {
                edge.sourceHandle = 'right-src';
                edge.targetHandle = 'left-tgt';
            } else {
                edge.sourceHandle = 'left-src';
                edge.targetHandle = 'right-tgt';
            }
        } else {
            // Vertical connection is more prominent
            edge.sourceHandle = dy > 0 ? 'bottom-src' : 'top-src'; // dy > 0 means target is below source
            edge.targetHandle = dy > 0 ? 'top-tgt' : 'bottom-tgt';
        }
        return edge;
    });

    
    

    return {nodes, edges: layoutedEdges};
}