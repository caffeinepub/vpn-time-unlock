import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserOverview } from '../backend';

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

export function useGetAdminOverview() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin } = useIsCurrentPrincipalAdmin();

  return useQuery<UserOverview>({
    queryKey: ['adminOverview'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserOverview();
    },
    enabled: !!actor && !actorFetching && isAdmin === true,
    retry: false,
  });
}
