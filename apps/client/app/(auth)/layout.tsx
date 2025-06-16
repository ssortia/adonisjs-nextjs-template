'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // Показываем детей только если пользователь не аутентифицирован
  if (loading) {
    return null; // или компонент загрузки
  }

  if (user) {
    return null; // пользователь будет перенаправлен
  }

  return <>{children}</>;
}