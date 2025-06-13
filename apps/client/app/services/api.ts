'use client';

const API_URL = 'http://localhost:3333';

interface Role {
  id: number;
  name: string;
  description: string | null;
}

interface Permission {
  id: number;
  name: string;
  description: string | null;
}

interface User {
  id: number;
  email: string;
  fullName: string | null;
  role?: Role | null;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class ApiError extends Error {
  status: number;

  data: any;

  constructor(message: string, status: number, data: any = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Выполнить запрос к API с проверкой на ошибки
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Установка заголовков по умолчанию
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Добавление токена авторизации, если он есть в localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    // @ts-ignore
    headers.Authorization = `Bearer ${token}`;
  }

  // Выполнение запроса
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Если ответ не в формате JSON, вернуть null
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  // Если ответ не успешный, выбросить ошибку
  if (!response.ok) {
    // Специальная обработка для блокировки пользователя только для существующих токенов
    if (response.status === 403 && data?.message?.includes('заблокирован') && endpoint !== '/api/auth/login') {
      // Очищаем данные авторизации при блокировке только если это не попытка входа
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Перенаправляем на страницу входа
        window.location.href = '/login?blocked=true';
      }
    }
    
    throw new ApiError(
      data?.message || 'Произошла ошибка при выполнении запроса',
      response.status,
      data,
    );
  }

  return data as T;
}

interface UserPermissions {
  role: string;
  permissions: string[];
}

// API методы для авторизации
export const authApi = {
  // Регистрация нового пользователя
  register: (data: RegisterData): Promise<AuthResponse> =>
    fetchApi<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Вход пользователя
  login: (data: LoginData): Promise<AuthResponse> =>
    fetchApi<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Выход пользователя
  logout: (): Promise<void> =>
    fetchApi<void>('/api/auth/logout', {
      method: 'POST',
    }),

  // Получение информации о текущем пользователе
  getCurrentUser: (): Promise<{ user: User }> => fetchApi<{ user: User }>('/api/auth/me'),

  // Получение разрешений пользователя
  getUserPermissions: (): Promise<UserPermissions> =>
    fetchApi<UserPermissions>('/api/auth/permissions'),
};

// Утилиты для работы с авторизацией
export const authUtils = {
  // Сохранение данных авторизации
  setAuth: (data: AuthResponse): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  },

  // Удаление данных авторизации
  clearAuth: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Проверка, авторизован ли пользователь
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  },

  // Получение текущего пользователя из localStorage
  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  },
};

// Основные API методы для CRUD операций
const api = {
  get: <T>(endpoint: string): Promise<T> => fetchApi<T>(endpoint),
  post: <T>(endpoint: string, data?: any): Promise<T> => 
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: any): Promise<T> => 
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string): Promise<T> => 
    fetchApi<T>(endpoint, { method: 'DELETE' }),
};

export default api;
