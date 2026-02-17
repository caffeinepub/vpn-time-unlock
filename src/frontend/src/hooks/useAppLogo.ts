import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type { AppLogo } from '../backend';

export function useGetLogo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppLogo | null>({
    queryKey: ['appLogo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLogo();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useUploadLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: AppLogo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadLogo(logo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appLogo'] });
    },
  });
}
