import type { AppSummary, AppGraph } from '../types/graph';

function withLatency<T>(fn: () => T, latency = 500) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      // 12% random failure for demo
      if (Math.random() < 0.12) {
        reject(new Error('Network error'));
        return;
      }
      resolve(fn());
    }, latency);
  });
}

const APPS: AppSummary[] = [
  { id: 'app-1', name: 'Customer API', description: 'Customer-facing API and services' },
  { id: 'app-2', name: 'Payments', description: 'Payments and billing services' },
];

const GRAPHS: Record<string, AppGraph> = {
  'app-1': {
    nodes: [
      { id: 'n1', position: { x: 0, y: 0 }, type: 'service', data: { name: 'Auth', description: 'Auth service', status: 'healthy', configValue: 70, runtimeValue: 65 } },
      { id: 'n2', position: { x: 240, y: 0 }, type: 'service', data: { name: 'API', description: 'Main API', status: 'degraded', configValue: 50, runtimeValue: 55 } },
      { id: 'n3', position: { x: 120, y: 180 }, type: 'service', data: { name: 'DB', description: 'Primary DB', status: 'healthy', configValue: 90, runtimeValue: 92 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  'app-2': {
    nodes: [
      { id: 'm1', position: { x: 0, y: 0 }, type: 'service', data: { name: 'Payments API', description: '', status: 'healthy', configValue: 40, runtimeValue: 35 } },
      { id: 'm2', position: { x: 200, y: 80 }, type: 'service', data: { name: 'Billing', description: '', status: 'down', configValue: 10, runtimeValue: 5 } },
      { id: 'm3', position: { x: 400, y: 0 }, type: 'service', data: { name: 'Ledger', description: '', status: 'degraded', configValue: 60, runtimeValue: 58 } },
    ],
    edges: [
      { id: 'f1', source: 'm1', target: 'm2' },
      { id: 'f2', source: 'm2', target: 'm3' },
    ],
  }
};

export function fetchApps() {
  return withLatency(() => APPS.slice(), 600);
}

export function fetchAppGraph(appId: string) {
  return withLatency(() => {
    const g = GRAPHS[appId];
    if (!g) throw new Error('App graph not found');
    // deep clone
    return JSON.parse(JSON.stringify(g)) as AppGraph;
  }, 700);
}
import type { App, Graph } from '../types/graph';
import type { ApiResponse } from '../types/api';

// Mock data
const mockApps: App[] = [
  { id: 'app-1', name: 'E-commerce Platform', description: 'Main shopping application' },
  { id: 'app-2', name: 'Payment Service', description: 'Payment processing microservice' },
  { id: 'app-3', name: 'Analytics Engine', description: 'Data analytics and reporting' },
];

const mockGraphs: Record<string, Graph> = {
  'app-1': {
    nodes: [
      {
        id: 'service-1',
        type: 'service',
        position: { x: 100, y: 100 },
        data: {
          name: 'API Gateway',
          description: 'Main API entry point',
          status: 'healthy',
          configValue: 75,
          runtimeValue: 80,
        },
      },
      {
        id: 'service-2',
        type: 'service',
        position: { x: 300, y: 100 },
        data: {
          name: 'User Service',
          description: 'User management and authentication',
          status: 'healthy',
          configValue: 60,
          runtimeValue: 65,
        },
      },
      {
        id: 'service-3',
        type: 'service',
        position: { x: 500, y: 200 },
        data: {
          name: 'Order Service',
          description: 'Order processing and management',
          status: 'degraded',
          configValue: 85,
          runtimeValue: 45,
        },
      },
    ],
    edges: [
      { id: 'edge-1', source: 'service-1', target: 'service-2' },
      { id: 'edge-2', source: 'service-1', target: 'service-3' },
    ],
  },
  'app-2': {
    nodes: [
      {
        id: 'payment-1',
        type: 'service',
        position: { x: 150, y: 150 },
        data: {
          name: 'Payment Processor',
          description: 'Core payment processing',
          status: 'healthy',
          configValue: 90,
          runtimeValue: 95,
        },
      },
      {
        id: 'payment-2',
        type: 'service',
        position: { x: 400, y: 150 },
        data: {
          name: 'Fraud Detection',
          description: 'Fraud detection and prevention',
          status: 'healthy',
          configValue: 70,
          runtimeValue: 72,
        },
      },
    ],
    edges: [
      { id: 'payment-edge-1', source: 'payment-1', target: 'payment-2' },
    ],
  },
  'app-3': {
    nodes: [
      {
        id: 'analytics-1',
        type: 'service',
        position: { x: 200, y: 100 },
        data: {
          name: 'Data Collector',
          description: 'Event and data collection service',
          status: 'down',
          configValue: 50,
          runtimeValue: 0,
        },
      },
      {
        id: 'analytics-2',
        type: 'service',
        position: { x: 450, y: 100 },
        data: {
          name: 'Report Generator',
          description: 'Generate analytics reports',
          status: 'degraded',
          configValue: 80,
          runtimeValue: 55,
        },
      },
    ],
    edges: [
      { id: 'analytics-edge-1', source: 'analytics-1', target: 'analytics-2' },
    ],
  },
};

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (10% chance)
const shouldFail = () => Math.random() < 0.1;

export const api = {
  async getApps(): Promise<ApiResponse<App[]>> {
    await delay(800); // Simulate network delay
    
    if (shouldFail()) {
      return {
        data: [] as App[],
        success: false,
        error: 'Failed to fetch applications',
      };
    }

    return {
      data: mockApps,
      success: true,
    };
  },

  async getAppGraph(appId: string): Promise<ApiResponse<Graph>> {
    await delay(1200); // Simulate network delay
    
    if (shouldFail()) {
      return {
        data: { nodes: [], edges: [] },
        success: false,
        error: `Failed to fetch graph for app ${appId}`,
      };
    }

    const graph = mockGraphs[appId];
    if (!graph) {
      return {
        data: { nodes: [], edges: [] },
        success: false,
        error: 'Application not found',
      };
    }

    return {
      data: graph,
      success: true,
    };
  },
};
