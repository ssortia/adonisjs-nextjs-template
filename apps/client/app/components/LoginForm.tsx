'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { Form, Input, Button, Alert, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    setGeneralError(null);

    try {
      // Отправляем данные на сервер
      await login(values.email, values.password);
      // Перенаправление на главную страницу происходит в хуке useAuth
    } catch (error: any) {
      // Обработка ошибок API
      if (error.status === 401) {
        setGeneralError('Неверный email или пароль');
      } else {
        setGeneralError(error.message || 'Произошла ошибка при входе');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="auth-form-container">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>Вход</Title>
      </div>

      {generalError && (
        <Alert
          message="Ошибка аутентификации"
          description={generalError}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Пожалуйста, введите ваш email' },
            { type: 'email', message: 'Пожалуйста, введите корректный email' }
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
          rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль' }]}
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
            icon={<LoginOutlined />}
            loading={isLoading}
            className="login-form-button"
            size="large"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">
          Нет аккаунта?{' '}
          <Link href="/register">
            Зарегистрироваться
          </Link>
        </Text>
      </div>
    </Card>
  );
}
