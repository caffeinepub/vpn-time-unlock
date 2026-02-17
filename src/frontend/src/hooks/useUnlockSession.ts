import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useUnlockSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.unlockSessions();
    },
    onSuccess: () => {
      // Invalidate and refetch session status
      queryClient.invalidateQueries({ queryKey: ['sessionStatus'] });
    },
  });
}
