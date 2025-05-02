'use client';

import Image from 'next/image';
import Link from 'next/link';
import UserProfile from './components/UserProfile';
import { Layout, Typography, Button, Space, Card, Divider, Row, Col } from 'antd';
import { 
  UserOutlined, 
  LoginOutlined, 
  ReadOutlined, 
  CodeOutlined, 
  GlobalOutlined 
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function Home() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className="page-container">
        <Card 
          style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}
          styles={{body: {padding: '40px 24px'}}}
          variant={false}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ margin: '20px 0' }}>
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
                style={{ filter: 'var(--image-filter, none)' }}
              />
            </div>
            
            <Card variant={false} style={{ background: 'rgba(0,0,0,0.02)' }}>
              <Space direction="vertical" size="small">
                <Text strong>AdonisJS + Next.js Template</Text>
                <Text>С готовой системой аутентификации и ролями</Text>
              </Space>
            </Card>
            
            <Divider />
            
            <div style={{ width: '100%' }}>
              <UserProfile />
            </div>
            
            <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
              <Link href="/register" passHref>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<UserOutlined />}
                >
                  Регистрация
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button 
                  size="large"
                  icon={<LoginOutlined />}
                >
                  Войти в систему
                </Button>
              </Link>
            </Space>
          </Space>
        </Card>
      </Content>
      
      <Footer style={{ textAlign: 'center', padding: '24px' }}>
        <Row justify="center" gutter={[24, 16]}>
          <Col>
            <a
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Space>
                <ReadOutlined />
                <span>Learn</span>
              </Space>
            </a>
          </Col>
          <Col>
            <a
              href="https://vercel.com/templates?framework=next.js"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Space>
                <CodeOutlined />
                <span>Examples</span>
              </Space>
            </a>
          </Col>
          <Col>
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Space>
                <GlobalOutlined />
                <span>Go to nextjs.org →</span>
              </Space>
            </a>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}