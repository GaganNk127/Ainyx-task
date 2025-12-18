import { TopBar } from './components/layout/TopBar';
import { LeftRail } from './components/layout/LeftRail';
import { RightPanel } from './components/layout/RightPanel';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { FlowCanvas } from './components/canvas/FlowCanvas';
import { Providers } from './app/providers';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';

function AppContent() {
  const { setSelectedAppId } = useAppStore();

  // Auto-select first app on mount
  useEffect(() => {
    setSelectedAppId('app-1');
  }, [setSelectedAppId]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftRail />
        
        <main className="flex-1 flex">
          <FlowCanvas />
        </main>
        
        <div className="hidden lg:block">
          <RightPanel />
        </div>
      </div>
      
      <MobileDrawer />
    </div>
  );
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App;
