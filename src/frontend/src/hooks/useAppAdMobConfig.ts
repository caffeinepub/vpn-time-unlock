import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AppAdMobConfig } from '../backend';

export function useGetAppAdMobConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppAdMobConfig | null>({
    queryKey: ['appAdMobConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppAdMobConfig();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetAppAdMobConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: AppAdMobConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setAppAdMobConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appAdMobConfig'] });
    },
  });
}
