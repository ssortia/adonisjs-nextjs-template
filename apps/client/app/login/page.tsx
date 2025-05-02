'use client';

import LoginForm from '../components/LoginForm';
import { Layout } from 'antd';

const { Content } = Layout;

export default function LoginPage() {
  return (
    <Layout className="page-container">
      <Content className="page-container">
        <LoginForm />
      </Content>
    </Layout>
  );
}