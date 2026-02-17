import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export function useIsUserBlocked(userPrincipal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['userBlocked', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return false;
      return actor.isUserBlocked(userPrincipal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
    retry: false,
  });
}

export function useBlockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.blockUser(userPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOverview'] });
      queryClient.invalidateQueries({ queryKey: ['userBlocked'] });
    },
  });
}

export function useUnblockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unblockUser(userPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOverview'] });
      queryClient.invalidateQueries({ queryKey: ['userBlocked'] });
    },
  });
}

export function useIsCurrentUserBlocked() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['currentUserBlocked'],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try {
        const principal = identity.getPrincipal();
        return actor.isUserBlocked(principal);
      } catch (error) {
        // Non-admin users can't check block status, assume not blocked
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

// Import useInternetIdentity
import { useInternetIdentity } from './useInternetIdentity';
