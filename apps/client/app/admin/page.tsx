'use client';

import { Button, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/hooks/useAuth';
import PageHeader from '@/app/components/PageHeader';
import AccessDenied from './components/AccessDenied';
import QuickActionsCard from './components/QuickActionsCard';
import SystemInfoCard from './components/SystemInfoCard';
import RecentActivityCard from './components/RecentActivityCard';
import SystemStatusCard from './components/SystemStatusCard';
import ChangeHistoryCard from './components/ChangeHistoryCard';
import SystemLogsCard from './components/SystemLogsCard';

export default function AdminDashboard() {
  const { hasPermission } = useAuth();

  const hasAccess = hasPermission('admin.access');

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader
        title="Панель администратора"
        subtitle="Обзор системы и управление"
        extra={
          <Button icon={<ReloadOutlined />} type="primary">
            Обновить данные
          </Button>
        }
      />

      <QuickActionsCard />
      
      <div style={{ marginTop: '16px' }}>
        <SystemInfoCard />
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <RecentActivityCard />
        </Col>
        <Col xs={24} lg={12}>
          <SystemStatusCard />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <ChangeHistoryCard />
        </Col>
        <Col xs={24} lg={12}>
          <SystemLogsCard />
        </Col>
      </Row>
    </div>
  );
}
