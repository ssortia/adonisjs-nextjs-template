'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, authUtils } from '../services/api';

interface User {
  id: number;
  email: string;
  fullName: string | null;
  role?: {
    id: number;
    name: string;
    description: string | null;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userPermissions: string[];
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Проверка наличия токена и получение данных пользователя при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      if (authUtils.isAuthenticated()) {
        try {
          // Получаем данные пользователя
          const { user } = await authApi.getCurrentUser();
          setUser(user);

          // Получаем разрешения пользователя
          const { permissions, role } = await authApi.getUserPermissions();
          setUserPermissions(permissions);
          setUserRole(role);
        } catch (error) {
          // При ошибке очищаем данные авторизации
          authUtils.clearAuth();
          setUser(null);
          setUserPermissions([]);
          setUserRole(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Вход пользователя
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      authUtils.setAuth(response);
      setUser(response.user);

      // Получаем разрешения пользователя
      const { permissions, role } = await authApi.getUserPermissions();
      setUserPermissions(permissions);
      setUserRole(role);

      router.push('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация пользователя
  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      authUtils.setAuth(response);
      setUser(response.user);

      // Получаем разрешения пользователя (по умолчанию роль "user")
      const { permissions, role } = await authApi.getUserPermissions();
      setUserPermissions(permissions);
      setUserRole(role);

      router.push('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход пользователя
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      // Игнорируем ошибки при выходе
      console.error('Ошибка при выходе:', error);
    } finally {
      authUtils.clearAuth();
      setUser(null);
      setUserPermissions([]);
      setUserRole(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  // Проверка наличия разрешения
  const hasPermission = (permission: string) => userPermissions.includes(permission);

  // Проверка наличия роли
  const hasRole = (role: string) => userRole === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userPermissions,
        userRole,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Компонент для защиты роутов, требующих аутентификации
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}

// Компонент для защиты роутов, требующих определенной роли
export function RequireRole({ children, roles }: { children: ReactNode; roles: string[] }) {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (userRole && !roles.includes(userRole)) {
        router.push('/'); // Редирект на главную при отсутствии нужной роли
      }
    }
  }, [isAuthenticated, isLoading, userRole, roles, router]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return isAuthenticated && userRole && roles.includes(userRole) ? <>{children}</> : null;
}

// Компонент для защиты роутов, требующих определенного разрешения
export function RequirePermission({
  children,
  permissions,
  mode = 'all',
}: {
  children: ReactNode;
  permissions: string[];
  mode?: 'all' | 'any';
}) {
  const { isAuthenticated, isLoading, userPermissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        const hasPermission =
          mode === 'all'
            ? permissions.every((p) => userPermissions.includes(p))
            : permissions.some((p) => userPermissions.includes(p));

        if (!hasPermission) {
          router.push('/'); // Редирект на главную при отсутствии нужного разрешения
        }
      }
    }
  }, [isAuthenticated, isLoading, userPermissions, permissions, mode, router]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  const hasPermission =
    mode === 'all'
      ? permissions.every((p) => userPermissions.includes(p))
      : permissions.some((p) => userPermissions.includes(p));

  return isAuthenticated && hasPermission ? <>{children}</> : null;
}
