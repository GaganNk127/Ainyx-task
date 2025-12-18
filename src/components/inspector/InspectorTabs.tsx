import type { InspectorTab } from '../../store/useAppStore';

interface InspectorTabsProps {
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
}

export function InspectorTabs({ activeTab, onTabChange }: InspectorTabsProps) {
  const tabs: { value: InspectorTab; label: string }[] = [
    { value: 'config', label: 'Config' },
    { value: 'runtime', label: 'Runtime' },
  ];

  return (
    <div className="border-b">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
