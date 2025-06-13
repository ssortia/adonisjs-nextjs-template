'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Title } = Typography;

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      await login(values.email, values.password);
    } catch (error: any) {
      console.log(error);
      if (error.status === 401) {
        setError('Неверный email или пароль');
      } else if (error.status === 403) {
        setError('Ваш аккаунт заблокирован. Обратитесь к администратору');
      } else {
        setError(error.message || 'Произошла ошибка при входе');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
            Вход
          </Title>

          {error && <Alert message={error} type="error" showIcon />}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email обязателен для заполнения' },
                { type: 'email', message: 'Некорректный формат email' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Введите email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ required: true, message: 'Пароль обязателен для заполнения' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Введите пароль"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
                style={{ width: '100%' }}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Нет аккаунта?{' '}
              <Link href="/register" style={{ color: '#1890ff' }}>
                Зарегистрироваться
              </Link>
            </Typography.Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}
