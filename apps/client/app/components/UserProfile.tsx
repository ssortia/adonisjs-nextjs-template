'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function UserProfile() {
  const { user, userRole, userPermissions, logout, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(userRole === 'admin');
  }, [userRole]);

  if (isLoading) {
    return <div className="p-4 bg-white shadow-md rounded-lg">Загрузка...</div>;
  }

  if (!user) {
    return <div className="p-4 bg-white shadow-md rounded-lg">Пользователь не авторизован</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Профиль пользователя</h2>

      <div className="mb-4">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Имя:</strong> {user.fullName || 'Не указано'}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Роль:</strong> {userRole || 'Не назначена'}
        </p>
      </div>

      {userPermissions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Разрешения:</h3>
          <ul className="list-disc list-inside">
            {userPermissions.map((permission, index) => (
              <li key={index} className="text-sm text-gray-700">
                {permission}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isAdmin && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Административные функции:</h3>
          <div className="flex flex-col space-y-2">
            <a href="/admin/users" className="text-blue-500 hover:underline">
              Управление пользователями
            </a>
            <a href="/admin/roles" className="text-blue-500 hover:underline">
              Управление ролями
            </a>
          </div>
        </div>
      )}

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Выйти
      </button>
    </div>
  );
}
