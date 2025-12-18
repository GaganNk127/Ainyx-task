import { 
  Layout, 
  Network, 
  Settings, 
  BarChart3, 
  Database,
  Cloud,
  Shield,
  Zap
} from 'lucide-react';

const navigationItems = [
  { icon: Layout, label: 'Overview', active: true },
  { icon: Network, label: 'Graph', active: false },
  { icon: Database, label: 'Services', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Cloud, label: 'Infrastructure', active: false },
  { icon: Shield, label: 'Security', active: false },
  { icon: Zap, label: 'Performance', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export function LeftRail() {
  return (
    <aside className="w-16 border-r bg-background flex flex-col items-center py-4 gap-2">
      {navigationItems.map((item, index) => (
        <button
          key={index}
          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
            item.active 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
          title={item.label}
        >
          <item.icon className="w-5 h-5" />
        </button>
      ))}
    </aside>
  );
}
