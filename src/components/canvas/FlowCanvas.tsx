import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import { useEffect, useCallback } from 'react';
import { useAppGraph } from '../../api/hooks';
import { useSelectedAppId, useSelectedNodeId, useAppStore } from '../../store/useAppStore';
import { ServiceNode } from './nodes/ServiceNode';
import type { BackgroundVariant } from '@xyflow/react';
import type { ServiceNodeData } from '../../types/graph';

const nodeTypes: NodeTypes = {
  service: ServiceNode,
};

export function FlowCanvas() {
  const { data: graph, isLoading, error } = useAppGraph();
  const selectedAppId = useSelectedAppId();
  const selectedNodeId = useSelectedNodeId();
  const { fitView, deleteElements } = useReactFlow();
  const { setSelectedNodeId, setIsMobilePanelOpen } = useAppStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<Record<string, unknown>>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Update nodes and edges when graph data changes
  useEffect(() => {
    if (graph) {
      setNodes(graph.nodes.map(node => ({
        ...node,
        data: node.data as unknown as Record<string, unknown>
      })));
      setEdges(graph.edges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [graph, setNodes, setEdges]);

  // Fit view when app changes
  useEffect(() => {
    if (selectedAppId && nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.2, duration: 800 });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedAppId, nodes.length, fitView]);

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    // open mobile panel on small screens
    if (window.innerWidth < 1024) {
      setIsMobilePanelOpen(true);
    }
  }, [setSelectedNodeId, setIsMobilePanelOpen]);

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Handle keyboard delete: update local nodes/edges state
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodeId) {
          setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
          setEdges((prev) => prev.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
          setSelectedNodeId(null);
        }
      }
    },
    [selectedNodeId, setNodes, setEdges, setSelectedNodeId]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">Loading graph...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-destructive">
          <div className="text-sm">Failed to load graph</div>
        </div>
      </div>
    );
  }

  if (!selectedAppId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-sm">Select an application to view its graph</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.25}
        maxZoom={2}
        className="bg-background"
      >
        <Background variant={'dots' as BackgroundVariant} gap={20} size={1} color="hsl(var(--muted-foreground))" />
        <Controls position="top-left" />
        <MiniMap 
          position="top-right"
          nodeColor={(node) => {
            const nodeData = node.data as unknown as ServiceNodeData;
            if (nodeData.status === 'healthy') return '#22c55e';
            if (nodeData.status === 'degraded') return '#eab308';
            return '#ef4444';
          }}
        />
      </ReactFlow>
    </div>
  );
}
