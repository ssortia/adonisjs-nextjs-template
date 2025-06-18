import { useState, useEffect, useCallback } from 'react';
import api from '@/app/services/api';

export interface AuditLog {
  id: number;
  userId: number | null;
  user: {
    id: number;
    email: string;
    fullName: string;
  } | null;
  action: string;
  type: 'info' | 'warning' | 'error';
  ip: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  formattedDate: string;
}

export interface AuditLogFilters {
  type?: 'info' | 'warning' | 'error';
  action?: string;
  userId?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditLogSort {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogPagination {
  page?: number;
  limit?: number;
}

export interface AuditLogStats {
  totals: {
    total: number;
    info: number;
    warning: number;
    error: number;
    period: number;
  };
  topActions: Array<{ action: string; count: number }>;
  topUsers: Array<{ userId: number; user: any; count: number }>;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<AuditLogsResponse['meta'] | null>(null);

  const fetchAuditLogs = useCallback(async (
    filters: AuditLogFilters = {},
    sort: AuditLogSort = {},
    pagination: AuditLogPagination = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      // Добавляем фильтры
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      
      // Добавляем сортировку
      Object.entries(sort).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      
      // Добавляем пагинацию
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/api/admin/audit-logs?${params.toString()}`) as AuditLogsResponse;
      
      setAuditLogs(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuditLogById = useCallback(async (id: number): Promise<AuditLog | null> => {
    try {
      const response = await api.get(`/api/admin/audit-logs/${id}`) as AuditLog;
      return response;
    } catch (err: any) {
      console.error('Failed to fetch audit log:', err);
      return null;
    }
  }, []);

  const fetchStats = useCallback(async (period: 'day' | 'week' | 'month' = 'day'): Promise<AuditLogStats | null> => {
    try {
      const response = await api.get(`/api/admin/audit-logs/stats?period=${period}`) as AuditLogStats;
      return response;
    } catch (err: any) {
      console.error('Failed to fetch audit logs stats:', err);
      return null;
    }
  }, []);

  const fetchAvailableActions = useCallback(async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/admin/audit-logs/actions') as { actions: string[] };
      return response.actions;
    } catch (err: any) {
      console.error('Failed to fetch available actions:', err);
      return [];
    }
  }, []);

  return {
    auditLogs,
    loading,
    error,
    meta,
    fetchAuditLogs,
    fetchAuditLogById,
    fetchStats,
    fetchAvailableActions
  };
};

export default useAuditLogs;