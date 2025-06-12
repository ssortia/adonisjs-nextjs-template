import { useEffect, useState } from 'react';
import { message } from 'antd';
import api from '../services/api';
import type { Role, RoleFormData } from '../types';

interface RolesResponse {
  data: Role[];
  meta?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchRoles = async (page = 1, limit = 20, search = '') => {
    try {
      setLoading(true);
      setCurrentSearch(search);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await api.get<RolesResponse>(`/roles?${params.toString()}`);

      // Handle both paginated and non-paginated responses
      if (response.meta) {
        setRoles(response.data || []);
        setPagination({
          current: response.meta.currentPage,
          pageSize: response.meta.perPage,
          total: response.meta.total,
        });
      } else {
        // Fallback for non-paginated response
        const rolesData = Array.isArray(response) ? response : response.data || [];
        setRoles(rolesData);
        setPagination({
          current: 1,
          pageSize: rolesData.length,
          total: rolesData.length,
        });
      }
    } catch (error) {
      message.error('Ошибка при загрузке ролей');
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData: RoleFormData) => {
    try {
      await api.post('/roles', roleData);
      message.success('Роль создана');
      await fetchRoles(pagination.current, pagination.pageSize, currentSearch);
    } catch (error) {
      message.error('Ошибка при создании роли');
      throw error;
    }
  };

  const updateRole = async (id: number, roleData: RoleFormData) => {
    try {
      await api.put(`/roles/${id}`, roleData);
      message.success('Роль обновлена');
      await fetchRoles(pagination.current, pagination.pageSize, currentSearch);
    } catch (error) {
      message.error('Ошибка при обновлении роли');
      throw error;
    }
  };

  const deleteRole = async (id: number) => {
    try {
      await api.delete(`/roles/${id}`);
      message.success('Роль удалена');
      await fetchRoles(pagination.current, pagination.pageSize, currentSearch);
    } catch (error) {
      message.error('Ошибка при удалении роли');
      throw error;
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    fetchRoles(page, pageSize || pagination.pageSize);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    pagination,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    handlePageChange,
  };
};
