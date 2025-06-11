import { Layout } from 'antd';
import RegisterForm from '../components/RegisterForm';

const { Content } = Layout;

export default function RegisterPage() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
        <RegisterForm />
      </Content>
    </Layout>
  );
}