import { useIsMobilePanelOpen, useSelectedNodeId } from '../../store/useAppStore';
import { useAppStore } from '../../store/useAppStore';
import { NodeInspector } from '../inspector/NodeInspector';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export function MobileDrawer() {
  const isMobilePanelOpen = useIsMobilePanelOpen();
  const selectedNodeId = useSelectedNodeId();
  const setIsMobilePanelOpen = useAppStore((state) => state.setIsMobilePanelOpen);

  // Close drawer when node is deselected
  useEffect(() => {
    if (!selectedNodeId && isMobilePanelOpen) {
      setIsMobilePanelOpen(false);
    }
  }, [selectedNodeId, isMobilePanelOpen, setIsMobilePanelOpen]);

  if (!selectedNodeId || !isMobilePanelOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobilePanelOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg z-50 lg:hidden transform transition-transform">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4">
          <h2 className="font-medium">Node Inspector</h2>
          <button
            onClick={() => setIsMobilePanelOpen(false)}
            className="p-1 hover:bg-muted rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="h-[calc(100vh-3.5rem)] overflow-hidden">
          <NodeInspector />
        </div>
      </div>
    </>
  );
}
