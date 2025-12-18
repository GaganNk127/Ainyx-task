import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ServiceNodeData } from '../../../types/graph';
import { cn } from '../../../lib/utils';

const statusColors = {
  healthy: 'bg-green-500',
  degraded: 'bg-yellow-500',
  down: 'bg-red-500',
};

export function ServiceNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ServiceNodeData;
  const { name, description, status } = nodeData;

  return (
    <div
      className={cn(
        'bg-background border rounded-lg shadow-sm min-w-50 transition-all',
        selected ? 'border-primary shadow-md' : 'border-border hover:border-muted-foreground'
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              statusColors[status as keyof typeof statusColors],
              'text-white'
            )}
          >
            {status}
          </span>
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {nodeData.description}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Config:</span>
          <span className="font-medium">{nodeData.configValue}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Runtime:</span>
          <span className="font-medium">{nodeData.runtimeValue}%</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
