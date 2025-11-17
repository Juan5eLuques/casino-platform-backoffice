import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api';
import type { UserBalanceResponse } from '@/types';

export function useBalance() {
   return useQuery<UserBalanceResponse>({
      queryKey: ['balance'],
      queryFn: () => authApi.getBalance(),
      staleTime: 30000, // 30 segundos
      refetchInterval: 60000, // Refetch cada 60 segundos
      refetchOnWindowFocus: true,
   });
}
