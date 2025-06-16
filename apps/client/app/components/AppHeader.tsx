'use client';

import { Layout, Menu, Button, Space, Switch } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  SafetyOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined, 
  SettingOutlined,
  BookOutlined,
  KeyOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import type { MenuProps } from 'antd';
import { JSX } from 'react';

const { Header } = Layout;

interface MenuItem {
  key: string;
  icon: JSX.Element;
  name: string;
  link?: string;
  permission?: string;
  children?: MenuItem[];
}

export default function AppHeader() {
  const { user, userPermissions, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  const menuConfig: MenuItem[] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      name: "Профиль",
      link: "/",
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      name: "Пользователи",
      link: "/users",
      permission: "users.view",
    },
    {
      key: 'dictionaries',
      icon: <BookOutlined />,
      name: "Справочники",
      children: [
        {
          key: 'dictionaries.roles',
          icon: <SafetyOutlined />,
          name: "Роли",
          link: "/dictionaries/roles",
          permission: "roles.view",
        },
        {
          key: 'dictionaries.permissions',
          icon: <KeyOutlined />,
          name: "Права",
          link: "/dictionaries/permissions",
          permission: "permissions.view",
        },
      ],
    },
    {
      key: 'admin.access',
      icon: <SettingOutlined />,
      name: "Настройки",
      link: "/settings",
      permission: "admin.access",
    },
  ];

  const getMenuItems = (): MenuProps['items'] => {
    if (!user) return [];

    return menuConfig
      .filter(item => {
        // Если у элемента есть дочерние элементы, проверяем права для них
        if (item.children) {
          return item.children.some(child => !child.permission || hasPermission(child.permission));
        }
        // Для обычных элементов проверяем права или отсутствие требований к правам
        return !item.permission || hasPermission(item.permission);
      })
      .map(item => {
        // Если у элемента есть дочерние элементы
        if (item.children) {
          const visibleChildren = item.children
            .filter(child => !child.permission || hasPermission(child.permission))
            .map(child => ({
              key: child.key,
              icon: child.icon,
              label: <Link href={child.link}>{child.name}</Link>,
            }));

          return {
            key: item.key,
            icon: item.icon,
            label: item.name,
            children: visibleChildren,
          };
        }

        // Обычный элемент меню
        return {
          key: item.key,
          icon: item.icon,
          label: <Link href={item.link}>{item.name}</Link>,
        };
      });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Header style={{ 
      background: 'var(--background)', 
      padding: '0 50px', 
      boxShadow: theme === 'dark' ? '0 2px 8px rgba(255,255,255,0.06)' : '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: theme === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={25}
            priority
          />
        </Link>
        
        {user && !isLoading && (
          <Menu
            mode="horizontal"
            items={getMenuItems()}
            style={{ 
              border: 'none',
              background: 'transparent',
              minWidth: '300px'
            }}
          />
        )}
      </div>

      <Space>
        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        />
        
        {user && !isLoading ? (
          <>
            <span style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>
              Привет, {user.fullName || user.email}!
            </span>
            <Button 
              type="text" 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </>
        ) : (
          <Space>
            <Link href="/login">
              <Button type="text" icon={<LoginOutlined />}>
                Войти
              </Button>
            </Link>
            <Link href="/register">
              <Button type="primary" icon={<UserAddOutlined />}>
                Регистрация
              </Button>
            </Link>
          </Space>
        )}
      </Space>
    </Header>
  );
}