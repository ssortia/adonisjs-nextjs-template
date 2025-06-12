export interface User {
  id: number;
  fullName: string | null;
  email: string;
  roleId: number | null;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface Permission {
  id: number;
  name: string;
  description: string | null;
}

export interface UserFormData {
  fullName?: string;
  email: string;
  password?: string;
  roleId?: number;
}

export interface PermissionFormData {
  name: string;
  description?: string;
}
3
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}
