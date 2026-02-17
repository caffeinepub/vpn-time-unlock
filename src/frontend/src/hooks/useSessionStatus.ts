import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SessionInfo } from '../backend';

export function useSessionStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<SessionInfo | null>({
    queryKey: ['sessionStatus'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const session = await actor.getSessions();
        return session;
      } catch (error: any) {
        // If session doesn't exist, return null instead of throwing
        if (error.message?.includes('Session does not exist')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: (query) => {
      // Refetch every 5 seconds if session is active
      const data = query.state.data;
      if (data && data.unlockExpiresAt) {
        const now = BigInt(Date.now()) * BigInt(1_000_000);
        const isActive = data.unlockExpiresAt > now;
        return isActive ? 5000 : false;
      }
      return false;
    },
    retry: false,
  });

  const sessionStatus = query.data;
  const now = BigInt(Date.now()) * BigInt(1_000_000);
  
  let remainingSeconds = 0;
  let isActive = false;
  let isExpired = false;

  if (sessionStatus && sessionStatus.unlockExpiresAt) {
    const remaining = sessionStatus.unlockExpiresAt - now;
    remainingSeconds = Math.max(0, Number(remaining / BigInt(1_000_000_000)));
    isActive = remaining > BigInt(0);
    isExpired = !isActive && sessionStatus.unlockExpiresAt <= now;
  }

  return {
    sessionStatus,
    remainingSeconds,
    isActive,
    isExpired,
    isLoading: actorFetching || query.isLoading,
  };
}
