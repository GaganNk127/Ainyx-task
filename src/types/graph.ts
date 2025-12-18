import type { Edge, Node } from '@xyflow/react';

export interface AppSummary {
  id: string;
  name: string;
  description?: string;
}

export type NodeStatus = 'healthy' | 'degraded' | 'down';

export interface ServiceNodeData {
  name: string;
  description?: string;
  status: NodeStatus;
  configValue: number;
  runtimeValue: number;
}

export type ServiceNode = Node<ServiceNodeData> & { type: 'service' };

export interface AppGraph {
  nodes: ServiceNode[];
  edges: Edge[];
}
import type { Node as FlowNode, Edge as FlowEdge } from '@xyflow/react';

export type NodeStatus = 'healthy' | 'degraded' | 'down';

export interface ServiceNodeData {
  name: string;
  description?: string;
  status: NodeStatus;
  configValue: number;
  runtimeValue: number;
}

export type ServiceNode = FlowNode<ServiceNodeData>;

export type GraphEdge = FlowEdge;

export interface App {
  id: string;
  name: string;
  description?: string;
}

export interface Graph {
  nodes: ServiceNode[];
  edges: GraphEdge[];
}
