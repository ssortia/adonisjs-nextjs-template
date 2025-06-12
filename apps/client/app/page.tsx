'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Layout, Typography, Space, Button, Card } from 'antd';
import { UserAddOutlined, LoginOutlined } from '@ant-design/icons';
import UserProfile from './components/UserProfile';
import AppHeader from './components/AppHeader';

const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;

export default function Home() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      
      <Content style={{ padding: '50px', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            
            <Card style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="large">
                <Title level={1}>AdonisJS + Next.js Template</Title>
                <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                  Готовое решение с системой аутентификации и управления ролями
                </Paragraph>
              </Space>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <UserProfile />
              </div>
              
              <Card title="Начать работу">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Link href="/register" style={{ textDecoration: 'none' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<UserAddOutlined />}
                      style={{ width: '100%' }}
                    >
                      Регистрация
                    </Button>
                  </Link>
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <Button 
                      size="large" 
                      icon={<LoginOutlined />}
                      style={{ width: '100%' }}
                    >
                      Войти в систему
                    </Button>
                  </Link>
                </Space>
              </Card>
            </div>
            
          </Space>
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        <Space size="large">
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#666' }}
          >
            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#666' }}
          >
            <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
            Examples
          </a>
          <a
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#666' }}
          >
            <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
            Go to nextjs.org →
          </a>
        </Space>
      </Footer>
    </Layout>
  );
}