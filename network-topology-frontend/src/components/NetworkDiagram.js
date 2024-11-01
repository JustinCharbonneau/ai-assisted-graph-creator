// src/components/NetworkDiagram.js
import React, { useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, Controls, Background } from 'react-flow-renderer';

function NetworkDiagram({ topologyConfig, setTopologyConfig, errorMessage }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    if (errorMessage) {
      setNodes([]);
      setEdges([]);
      return;
    }

    if (!topologyConfig) return;

    const newNodes = (topologyConfig.nodes || []).map((node) => ({
      id: node.id,
      type: node.type || 'default',
      data: { label: node.id },
      position: node.position || { x: 0, y: 0 },
    }));

    const newEdges = (topologyConfig.edges || []).map((edge, index) => ({
      id: `e${index}`,
      source: edge.source,
      target: edge.target,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [topologyConfig, errorMessage, setNodes, setEdges]);

  const handleNodesChange = (changes) => {
    onNodesChange(changes);

    const updatedNodes = nodes.map((node) => {
      const change = changes.find((c) => c.id === node.id);
      if (change && change.position) {
        return { ...node, position: change.position };
      }
      return node;
    });

    const updatedTopologyConfig = {
      ...topologyConfig,
      nodes: updatedNodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
      })),
    };

    setTopologyConfig(updatedTopologyConfig);
  };

  if (errorMessage) {
    return (
      <div className="network-diagram-container">
        <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="network-diagram-container">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={handleNodesChange} fitView>
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}

export default NetworkDiagram;
