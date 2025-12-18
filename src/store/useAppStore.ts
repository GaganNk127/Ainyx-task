import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type InspectorTab = 'config' | 'runtime';

interface AppState {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
}

interface AppActions {
  setSelectedAppId: (appId: string | null) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setIsMobilePanelOpen: (open: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  resetSelection: () => void;
}

export const useAppStore = create<AppState & AppActions>()(
  subscribeWithSelector((set) => ({
    // State
    selectedAppId: null,
    selectedNodeId: null,
    isMobilePanelOpen: false,
    activeInspectorTab: 'config',

    // Actions
    setSelectedAppId: (appId) => set({ selectedAppId: appId }),
    setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
    setIsMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
    setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
    resetSelection: () => set({ 
      selectedNodeId: null,
      isMobilePanelOpen: false 
    }),
  }))
);

// Selectors
export const useSelectedAppId = () => useAppStore((state) => state.selectedAppId);
export const useSelectedNodeId = () => useAppStore((state) => state.selectedNodeId);
export const useIsMobilePanelOpen = () => useAppStore((state) => state.isMobilePanelOpen);
export const useActiveInspectorTab = () => useAppStore((state) => state.activeInspectorTab);
