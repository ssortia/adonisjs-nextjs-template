'use client';

import { Layout } from 'antd';
import RegisterForm from '../components/RegisterForm';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;

export default function RegisterPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px', background: '#f5f5f5' }}>
        <RegisterForm />
      </Content>
    </Layout>
  );
}