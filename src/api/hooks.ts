import { useQuery } from '@tanstack/react-query';
import { fetchApps, fetchAppGraph } from './mockApi';
import { useSelectedAppId } from '../store/useAppStore';
import type { AppSummary, AppGraph } from '../types/graph';
export function useApps() {
  return useQuery<AppSummary[], Error>({
    queryKey: ['apps'],
    queryFn: fetchApps,
    staleTime: 1000 * 60,
    retry: 1,
  });
}

export function useAppGraph() {
  const selectedAppId = useSelectedAppId();
  return useQuery<AppGraph, Error>({
    queryKey: ['app', selectedAppId, 'graph'],
    queryFn: () => fetchAppGraph(selectedAppId as string),
    enabled: !!selectedAppId,
    staleTime: 1000 * 30,
    retry: 1,
  });
}
