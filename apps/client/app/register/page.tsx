'use client';

import RegisterForm from '../components/RegisterForm';
import { Layout } from 'antd';

const { Content } = Layout;

export default function RegisterPage() {
  return (
    <Layout className="page-container">
      <Content className="page-container">
        <RegisterForm />
      </Content>
    </Layout>
  );
}