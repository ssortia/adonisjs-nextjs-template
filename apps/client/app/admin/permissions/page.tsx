'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'antd';
import { authUtils } from '@/app/services/api';
import PermissionsList from '@/app/components/Permissions/PermissionsList';

export default function PermissionsPage() {
  const router = useRouter();

  // Check if user is authenticated and has admin role
  useEffect(() => {
    const user = authUtils.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Redirect if not an admin
    if (user.role?.name !== 'admin') {
      router.push('/');
    }
  }, [router]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Card>
        <PermissionsList />
      </Card>
    </div>
  );
}