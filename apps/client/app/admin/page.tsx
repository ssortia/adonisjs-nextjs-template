'use client';

import { Avatar, Button, Card, Col, List, Row, Space, Tag, Timeline, Typography, Select, Input } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SafetyOutlined,
  SettingOutlined,
  TrophyOutlined,
  UserOutlined,
  BugOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  StopOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useAuth } from '@/app/hooks/useAuth';
import PageHeader from '@/app/components/PageHeader';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

export default function AdminDashboard() {
  const { hasPermission } = useAuth();

  const hasAccess = hasPermission('admin.access');

  if (!hasAccess) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ fontSize: '96px', margin: 0, color: '#ff4d4f' }}>
          403
        </Title>
        <Title level={3} style={{ marginTop: '16px', color: '#8c8c8c' }}>
          Доступ запрещен
        </Title>
        <Paragraph style={{ color: '#8c8c8c', marginTop: '8px' }}>
          У вас нет прав для доступа к панели администратора
        </Paragraph>
      </div>
    );
  }

  // Mock data for demonstration
  const recentActivities = [
    {
      user: 'Александр К.',
      action: 'создал нового пользователя',
      time: '2 минуты назад',
      type: 'success',
    },
    {
      user: 'Мария С.',
      action: 'обновила роль пользователя',
      time: '15 минут назад',
      type: 'info',
    },
    { user: 'Дмитрий П.', action: 'удалил разрешение', time: '1 час назад', type: 'warning' },
    { user: 'Елена В.', action: 'изменила настройки системы', time: '3 часа назад', type: 'info' },
  ];

  const systemStatus = [
    { title: 'База данных', status: 'online', uptime: '99.9%' },
    { title: 'API сервер', status: 'online', uptime: '99.8%' },
    { title: 'Кеш Redis', status: 'online', uptime: '100%' },
    { title: 'Файловое хранилище', status: 'warning', uptime: '95.2%' },
  ];

  // Mock logs data
  const systemLogs = [
    {
      id: 1,
      timestamp: '2024-01-17 15:42:33',
      level: 'info',
      service: 'API',
      message: 'Пользователь успешно авторизован',
      details: 'User ID: 12345, IP: 192.168.1.10'
    },
    {
      id: 2,
      timestamp: '2024-01-17 15:41:28',
      level: 'warning',
      service: 'Database',
      message: 'Медленный запрос к базе данных',
      details: 'Query execution time: 2.5s, Table: users'
    },
    {
      id: 3,
      timestamp: '2024-01-17 15:40:15',
      level: 'error',
      service: 'Storage',
      message: 'Ошибка загрузки файла',
      details: 'File: document.pdf, Size: 2.5MB, Error: Connection timeout'
    },
    {
      id: 4,
      timestamp: '2024-01-17 15:39:44',
      level: 'info',
      service: 'Cache',
      message: 'Кеш успешно обновлен',
      details: 'Cache key: user_sessions, TTL: 3600s'
    },
    {
      id: 5,
      timestamp: '2024-01-17 15:38:12',
      level: 'debug',
      service: 'Auth',
      message: 'Попытка входа пользователя',
      details: 'Email: user@example.com, IP: 192.168.1.15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'warning':
        return 'orange';
      case 'offline':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircleOutlined />;
      case 'warning':
        return <ExclamationCircleOutlined />;
      case 'offline':
        return <ClockCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  // Log level helpers
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'red';
      case 'warning':
        return 'orange';
      case 'info':
        return 'blue';
      case 'debug':
        return 'gray';
      default:
        return 'default';
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <StopOutlined />;
      case 'warning':
        return <WarningOutlined />;
      case 'info':
        return <InfoCircleOutlined />;
      case 'debug':
        return <BugOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

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

      {/* Quick Actions */}
      <Card title="Быстрые действия">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Link href="/users" style={{ textDecoration: 'none' }}>
              <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                <UserOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <div>
                  <Text strong>Пользователи</Text>
                  <br />
                  <Text type="secondary">Управление пользователями</Text>
                </div>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Link href="/dictionaries/roles" style={{ textDecoration: 'none' }}>
              <Card size="small" hoverable style={{ textAlign: 'center', cursor: 'pointer' }}>
                <SafetyOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <div>
                  <Text strong>Роли</Text>
                  <br />
                  <Text type="secondary">Настройка ролей</Text>
                </div>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" hoverable style={{ textAlign: 'center' }}>
              <TrophyOutlined style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }} />
              <div>
                <Text strong>Отчеты</Text>
                <br />
                <Text type="secondary">Аналитика и статистика</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" hoverable style={{ textAlign: 'center' }}>
              <SettingOutlined
                style={{ fontSize: '24px', color: '#fa8c16', marginBottom: '8px' }}
              />
              <div>
                <Text strong>Настройки</Text>
                <br />
                <Text type="secondary">Конфигурация системы</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card title="Последняя активность" extra={<Button type="link">Показать все</Button>}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{item.user}</Text>
                        <Text>{item.action}</Text>
                      </Space>
                    }
                    description={
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">{item.time}</Text>
                        <Tag
                          color={
                            item.type === 'success'
                              ? 'green'
                              : item.type === 'warning'
                                ? 'orange'
                                : 'blue'
                          }
                        >
                          {item.type === 'success'
                            ? 'Создание'
                            : item.type === 'warning'
                              ? 'Удаление'
                              : 'Обновление'}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* System Status */}
        <Col xs={24} lg={12}>
          <Card title="Состояние системы" extra={<Button type="link">Мониторинг</Button>}>
            <List
              dataSource={systemStatus}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getStatusIcon(item.status)}
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{item.title}</Text>
                        <Tag color={getStatusColor(item.status)}>
                          {item.status === 'online'
                            ? 'Онлайн'
                            : item.status === 'warning'
                              ? 'Предупреждение'
                              : 'Офлайн'}
                        </Tag>
                      </Space>
                    }
                    description={<Text type="secondary">Время работы: {item.uptime}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card title="История изменений" style={{ marginTop: '16px' }}>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <Space direction="vertical" size={0}>
                      <Text strong>Обновление системы безопасности</Text>
                      <Text type="secondary">Внедрены новые алгоритмы шифрования</Text>
                      <Text type="secondary">2024-01-15 14:30</Text>
                    </Space>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <Space direction="vertical" size={0}>
                      <Text strong>Добавлен модуль аналитики</Text>
                      <Text type="secondary">Реализована система отчетов</Text>
                      <Text type="secondary">2024-01-12 09:15</Text>
                    </Space>
                  ),
                },
                {
                  color: 'red',
                  children: (
                    <Space direction="vertical" size={0}>
                      <Text strong>Исправлена критическая ошибка</Text>
                      <Text type="secondary">Устранена проблема с авторизацией</Text>
                      <Text type="secondary">2024-01-10 16:45</Text>
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="Логи системы" 
            style={{ marginTop: '16px' }}
            extra={
              <Space>
                <Select
                  placeholder="Уровень"
                  style={{ width: 100 }}
                  allowClear
                  size="small"
                >
                  <Select.Option value="error">Error</Select.Option>
                  <Select.Option value="warning">Warning</Select.Option>
                  <Select.Option value="info">Info</Select.Option>
                  <Select.Option value="debug">Debug</Select.Option>
                </Select>
                <Input
                  placeholder="Поиск"
                  prefix={<SearchOutlined />}
                  style={{ width: 120 }}
                  size="small"
                />
                <Button 
                  type="link" 
                  icon={<FilterOutlined />}
                  size="small"
                >
                  Все логи
                </Button>
              </Space>
            }
          >
            <List
              dataSource={systemLogs}
              size="small"
              renderItem={(log) => (
                <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <Avatar 
                        size="small" 
                        icon={getLogLevelIcon(log.level)}
                        style={{ 
                          backgroundColor: getLogLevelColor(log.level) === 'default' ? '#d9d9d9' : undefined,
                          marginRight: '8px'
                        }}
                      />
                      <Space size="small" style={{ flex: 1 }}>
                        <Tag color={getLogLevelColor(log.level)} size="small">
                          {log.level.toUpperCase()}
                        </Tag>
                        <Tag color="default" size="small">
                          {log.service}
                        </Tag>
                        <Text 
                          type="secondary" 
                          style={{ fontSize: '11px', marginLeft: 'auto' }}
                        >
                          {log.timestamp}
                        </Text>
                      </Space>
                    </div>
                    <div style={{ marginLeft: '32px' }}>
                      <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '2px' }}>
                        {log.message}
                      </Text>
                      <Text 
                        type="secondary" 
                        style={{ 
                          fontSize: '11px', 
                          fontFamily: 'monospace',
                          color: '#8c8c8c',
                          wordBreak: 'break-all'
                        }}
                      >
                        {log.details}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div style={{ 
              textAlign: 'center', 
              marginTop: '12px', 
              padding: '8px',
              borderTop: '1px solid #f0f0f0'
            }}>
              <Button type="link" size="small">
                Загрузить еще логи
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
