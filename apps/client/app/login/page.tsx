import { Layout } from 'antd';
import LoginForm from '../components/LoginForm';

const { Content } = Layout;

export default function LoginPage() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
        <LoginForm />
      </Content>
    </Layout>
  );
}