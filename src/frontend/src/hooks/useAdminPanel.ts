import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useIsCurrentPrincipalAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCurrentPrincipalAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCurrentPrincipalAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Note: This hook is a placeholder until backend implements getAdminOverview()
// Currently returns empty array since the backend method doesn't exist yet
export function useGetAdminOverview() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin } = useIsCurrentPrincipalAdmin();

  return useQuery<any[]>({
    queryKey: ['adminOverview'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method getAdminOverview() not yet implemented
      // Returning empty array as placeholder
      return [];
    },
    enabled: !!actor && !actorFetching && isAdmin === true,
    retry: false,
  });
}
