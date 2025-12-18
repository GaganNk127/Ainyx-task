import { Maximize2, Settings } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <div className="w-5 h-5 bg-primary-foreground rounded-sm"></div>
        </div>
        <h1 className="text-lg font-semibold">App Graph Builder</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-muted rounded-md transition-colors" title="Fit View">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-muted rounded-md transition-colors" title="Settings">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
