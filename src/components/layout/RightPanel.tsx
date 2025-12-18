import { useApps } from '../../api/hooks';
import { useSelectedAppId, useSelectedNodeId, useAppStore } from '../../store/useAppStore';
import { NodeInspector } from '../inspector/NodeInspector';
import { Loader2, AlertCircle } from 'lucide-react';

export function RightPanel() {
  const { data: apps, isLoading, error } = useApps();
  const selectedAppId = useSelectedAppId();
  const selectedNodeId = useSelectedNodeId();
  const { setSelectedAppId } = useAppStore();

  return (
    <aside className="w-80 border-l bg-background flex flex-col">
      {/* App Selector */}
      <div className="p-4 border-b">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Applications</h2>
        
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Loading apps...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">Failed to load apps</span>
          </div>
        )}
        
        {apps && (
          <div className="space-y-2">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  selectedAppId === app.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium">{app.name}</div>
                {app.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {app.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Node Inspector */}
      {selectedNodeId && (
        <div className="flex-1 overflow-hidden">
          <NodeInspector />
        </div>
      )}
      
      {!selectedNodeId && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-sm">Select a node to view details</div>
          </div>
        </div>
      )}
    </aside>
  );
}
