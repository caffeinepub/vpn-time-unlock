import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useIsCurrentPrincipalAdmin } from './useAdminPanel';
import type { AppAdMobConfig } from '../backend';

// Admin-only hook to fetch AdMob config
export function useGetAppAdMobConfig() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin } = useIsCurrentPrincipalAdmin();

  return useQuery<AppAdMobConfig | null>({
    queryKey: ['appAdMobConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppAdMobConfig();
    },
    enabled: !!actor && !actorFetching && !!isAdmin,
    retry: false,
  });
}

// Public hook for all users to fetch AdMob config
export function useGetAppAdMobConfigPublic() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppAdMobConfig | null>({
    queryKey: ['appAdMobConfigPublic'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppAdMobConfigPublic();
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
      queryClient.invalidateQueries({ queryKey: ['appAdMobConfigPublic'] });
    },
  });
}
