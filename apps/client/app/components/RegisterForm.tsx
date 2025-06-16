'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/hooks/useAuth';

const { Title } = Typography;

interface FormData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function RegisterForm() {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      await register(values);
      // Успешная регистрация - редирект на login происходит автоматически
    } catch (error: any) {
      if (error.status === 409) {
        setError('Пользователь с таким email уже существует');
      } else {
        setError(error.message || 'Произошла ошибка при регистрации');
      }
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
            Регистрация
          </Title>

          {error && <Alert message={error} type="error" showIcon />}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="fullName"
              label="Полное имя"
              rules={[
                { required: true, message: 'Имя обязательно для заполнения' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Введите полное имя"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email обязателен для заполнения' },
                { type: 'email', message: 'Некорректный формат email' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Введите email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: 'Пароль обязателен для заполнения' },
                { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Введите пароль"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="passwordConfirmation"
              label="Подтверждение пароля"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Подтвердите пароль' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Подтвердите пароль"
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
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Уже есть аккаунт?{' '}
              <Link href="/login" style={{ color: '#1890ff' }}>
                Войти
              </Link>
            </Typography.Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}
