import { useState, useEffect } from 'react';
import { useNodes, useReactFlow } from '@xyflow/react';
import { useSelectedNodeId, useActiveInspectorTab, useAppStore } from '../../store/useAppStore';
import { InspectorTabs } from './InspectorTabs';

interface NodeData {
  name: string;
  description?: string;
  status: 'healthy' | 'degraded' | 'down';
  configValue: number;
  runtimeValue: number;
}

function safelyCastNodeData(data: unknown): NodeData | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (typeof d.name === 'string' && 
      typeof d.status === 'string' && 
      typeof d.configValue === 'number' && 
      typeof d.runtimeValue === 'number') {
    return {
      name: d.name,
      description: typeof d.description === 'string' ? d.description : undefined,
      status: d.status as 'healthy' | 'degraded' | 'down',
      configValue: d.configValue,
      runtimeValue: d.runtimeValue
    };
  }
  return null;
}

export function NodeInspector() {
  const selectedNodeId = useSelectedNodeId();
  const activeTab = useActiveInspectorTab();
  const { setActiveInspectorTab } = useAppStore();
  const nodes = useNodes();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const nodeData = selectedNode ? safelyCastNodeData(selectedNode.data) : null;
  
  const { setNodes } = useReactFlow();

  const [nodeName, setNodeName] = useState(nodeData?.name || '');
  const [nodeDescription, setNodeDescription] = useState(nodeData?.description || '');
  const [configValue, setConfigValue] = useState(nodeData?.configValue || 0);
  const [runtimeValue, setRuntimeValue] = useState(nodeData?.runtimeValue || 0);

  // Update local state when selected node changes
  useEffect(() => {
    if (nodeData) {
      setNodeName(nodeData.name);
      setNodeDescription(nodeData.description || '');
      setConfigValue(nodeData.configValue);
      setRuntimeValue(nodeData.runtimeValue);
    }
  }, [nodeData]);

  // persist single field updates back to the node data
  function persistData(updater: (d: Record<string, unknown>) => Record<string, unknown>) {
    if (!selectedNodeId) return;
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id !== selectedNodeId) return n;
        const newData = updater(n.data as Record<string, unknown>);
        return { ...n, data: newData };
      })
    );
  }

  if (!nodeData) {
    return null;
  }

  const { status } = nodeData;

  const statusColors = {
    healthy: 'bg-green-100 text-green-800 border-green-200',
    degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    down: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Status */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Node Details</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        {/* Editable Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Name
            </label>
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                onBlur={() => persistData((d) => ({ ...d, name: nodeName }))}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              value={nodeDescription}
              onChange={(e) => setNodeDescription(e.target.value)}
              onBlur={() => persistData((d) => ({ ...d, description: nodeDescription }))}
              rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <InspectorTabs 
        activeTab={activeTab} 
        onTabChange={setActiveInspectorTab} 
      />

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Configuration Value
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={configValue}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setConfigValue(v);
                    persistData((d) => ({ ...d, configValue: v }));
                  }}
                  className="w-full"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={configValue}
                  onChange={(e) => {
                    const v = Number(e.target.value || 0);
                    setConfigValue(v);
                    persistData((d) => ({ ...d, configValue: v }));
                  }}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'runtime' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Runtime Value
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={runtimeValue}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setRuntimeValue(v);
                    persistData((d) => ({ ...d, runtimeValue: v }));
                  }}
                  className="w-full"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={runtimeValue}
                  onChange={(e) => {
                    const v = Number(e.target.value || 0);
                    setRuntimeValue(v);
                    persistData((d) => ({ ...d, runtimeValue: v }));
                  }}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
