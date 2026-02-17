import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

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
    onError: (error: any) => {
      // Handle blocked user error gracefully
      if (error.message && error.message.includes('blocked')) {
        toast.error('Your account has been blocked. Please contact support for assistance.');
      } else {
        toast.error(error.message || 'Failed to unlock session. Please try again.');
      }
    },
  });
}
