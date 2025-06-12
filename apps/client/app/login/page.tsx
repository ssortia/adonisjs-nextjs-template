'use client';

import { Layout } from 'antd';
import LoginForm from '../components/LoginForm';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;

export default function LoginPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px', background: '#f5f5f5' }}>
        <LoginForm />
      </Content>
    </Layout>
  );
}