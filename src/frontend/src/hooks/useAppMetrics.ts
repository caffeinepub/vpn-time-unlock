import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useIsCurrentPrincipalAdmin } from './useAdminPanel';
import type { AppMetrics } from '../backend';

export function useGetAppMetrics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin } = useIsCurrentPrincipalAdmin();

  return useQuery<AppMetrics>({
    queryKey: ['appMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppMetrics();
    },
    enabled: !!actor && !actorFetching && !!isAdmin,
    retry: false,
  });
}

export function useIncrementInstalls() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementInstalls();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appMetrics'] });
    },
  });
}
