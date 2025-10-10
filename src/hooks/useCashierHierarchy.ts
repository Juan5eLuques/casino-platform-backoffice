import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';

export interface CashierNode {
   id: string;
   username: string;
   role: 'CASHIER' | 'OPERATOR_ADMIN' | 'SUPER_ADMIN';
   status: 'ACTIVE' | 'INACTIVE';
   parentCashierId: string | null;
   commissionRate: number;
   createdAt: string;
   subordinates: CashierNode[];
}

export interface SubordinateUser {
   id: string;
   username: string;
   role: string;
   status: 'ACTIVE' | 'INACTIVE';
   operatorId: string;
   operatorName: string;
   parentCashierId: string;
   parentCashierUsername: string;
   commissionRate: number;
   subordinatesCount: number;
   createdAt: string;
   lastLoginAt: string | null;
}

export interface SubordinatesResponse {
   users: SubordinateUser[];
   totalCount: number;
   page: number;
   pageSize: number;
   totalPages: number;
}

export const useCashierHierarchy = (userId: string) => {
   const [hierarchy, setHierarchy] = useState<CashierNode | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!userId) {
         setLoading(false);
         return;
      }

      const fetchHierarchy = async () => {
         try {
            setLoading(true);
            const response = await apiClient.get(`/admin/users/${userId}/hierarchy`);
            setHierarchy(response.data);
            setError(null);
         } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Error al cargar jerarquía');
            setHierarchy(null);
         } finally {
            setLoading(false);
         }
      };

      fetchHierarchy();
   }, [userId]);

   const refetch = () => {
      if (userId) {
         const fetchHierarchy = async () => {
            try {
               setLoading(true);
               const response = await apiClient.get(`/admin/users/${userId}/hierarchy`);
               setHierarchy(response.data);
               setError(null);
            } catch (err: any) {
               setError(err.response?.data?.detail || err.message || 'Error al cargar jerarquía');
            } finally {
               setLoading(false);
            }
         };
         fetchHierarchy();
      }
   };

   return { hierarchy, loading, error, refetch };
};

export const useSubordinates = (parentCashierId: string, page: number = 1, pageSize: number = 20) => {
   const [subordinates, setSubordinates] = useState<SubordinatesResponse | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!parentCashierId) {
         setLoading(false);
         return;
      }

      const fetchSubordinates = async () => {
         try {
            setLoading(true);
            const response = await apiClient.get('/admin/users', {
               params: {
                  parentCashierId,
                  role: 'CASHIER',
                  page,
                  pageSize
               }
            });
            setSubordinates(response.data);
            setError(null);
         } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Error al cargar subordinados');
            setSubordinates(null);
         } finally {
            setLoading(false);
         }
      };

      fetchSubordinates();
   }, [parentCashierId, page, pageSize]);

   const refetch = () => {
      if (parentCashierId) {
         const fetchSubordinates = async () => {
            try {
               setLoading(true);
               const response = await apiClient.get('/admin/users', {
                  params: {
                     parentCashierId,
                     role: 'CASHIER',
                     page,
                     pageSize
                  }
               });
               setSubordinates(response.data);
               setError(null);
            } catch (err: any) {
               setError(err.response?.data?.detail || err.message || 'Error al cargar subordinados');
            } finally {
               setLoading(false);
            }
         };
         fetchSubordinates();
      }
   };

   return { subordinates, loading, error, refetch };
};