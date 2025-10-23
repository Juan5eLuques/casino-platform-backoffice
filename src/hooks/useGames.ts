import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { gamesApi } from '../api/games';
import type { CatalogGamesResponse, GameFilters } from '../types';

interface UseGamesOptions extends GameFilters {
   enabled?: boolean; // Para controlar si la query se ejecuta o no
}

export function useGames(options: UseGamesOptions = {}) {
   const { enabled = true, ...filters } = options;

   return useQuery<CatalogGamesResponse, Error>({
      queryKey: ['games', filters],
      queryFn: () => gamesApi.getCatalogGames(filters),
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
   });
}

export function useGame(gameId: string | undefined): UseQueryResult<any, Error> {
   return useQuery({
      queryKey: ['game', gameId],
      queryFn: () => gameId ? gamesApi.getGame(gameId) : Promise.reject('No gameId'),
      enabled: !!gameId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
   });
}
