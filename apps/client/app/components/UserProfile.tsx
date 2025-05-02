'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, Typography, Descriptions, List, Button, Space, Tag, Spin, Divider } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  IdcardOutlined, 
  TeamOutlined,
  KeyOutlined,
  SettingOutlined,
  UserSwitchOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function UserProfile() {
  const { user, userRole, userPermissions, logout, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(userRole === 'admin');
  }, [userRole]);

  if (isLoading) {
    return <Card><Spin /></Card>;
  }

  if (!user) {
    return (
      <Card>
        <Text type="secondary">Пользователь не авторизован</Text>
      </Card>
    );
  }

  return (
    <Card title={<Title level={4}>Профиль пользователя</Title>}>
      <Descriptions column={1}>
        <Descriptions.Item label={<Space><IdcardOutlined /> ID</Space>}>
          {user.id}
        </Descriptions.Item>
        <Descriptions.Item label={<Space><UserOutlined /> Имя</Space>}>
          {user.fullName || 'Не указано'}
        </Descriptions.Item>
        <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
          {user.email}
        </Descriptions.Item>
        <Descriptions.Item label={<Space><TeamOutlined /> Роль</Space>}>
          <Tag color={isAdmin ? "gold" : "blue"}>{userRole || 'Не назначена'}</Tag>
        </Descriptions.Item>
      </Descriptions>

      {userPermissions.length > 0 && (
        <>
          <Divider orientation="left">
            <Space><KeyOutlined /> Разрешения</Space>
          </Divider>
          <List
            size="small"
            dataSource={userPermissions}
            renderItem={(permission) => (
              <List.Item>
                <Tag color="processing">{permission}</Tag>
              </List.Item>
            )}
          />
        </>
      )}

      {isAdmin && (
        <>
          <Divider orientation="left">
            <Space><SettingOutlined /> Административные функции</Space>
          </Divider>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="link" href="/admin/users" icon={<UserOutlined />}>
              Управление пользователями
            </Button>
            <Button type="link" href="/admin/roles" icon={<UserSwitchOutlined />}>
              Управление ролями
            </Button>
          </Space>
        </>
      )}

      <Divider />

      <Button
        danger
        icon={<LogoutOutlined />}
        onClick={logout}
      >
        Выйти
      </Button>
    </Card>
  );
}
