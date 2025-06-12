import { useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../services/api';
import type { Role, ApiResponse } from '../types';

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Role[]>>('/roles');
      setRoles(response.data || []);
    } catch (error) {
      message.error('Ошибка при загрузке ролей');
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    fetchRoles,
  };
};
