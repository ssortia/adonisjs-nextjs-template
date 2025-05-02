'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { Form, Input, Button, Alert, Card, Typography, Divider, Space } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  CheckCircleOutlined,
  UserAddOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface FormData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function RegisterForm() {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    setGeneralError(null);
    setEmailError(null);

    try {
      // Отправляем данные на сервер через хук
      await register(values);
      // Перенаправление на главную страницу после успешной регистрации
      // происходит внутри хука useAuth
    } catch (error: any) {
      // Обработка ошибок API
      if (error.status === 409) {
        setEmailError('Пользователь с таким email уже существует');
        form.setFields([
          {
            name: 'email',
            errors: ['Пользователь с таким email уже существует'],
          },
        ]);
      } else {
        setGeneralError(error.message || 'Произошла ошибка при регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="auth-form-container">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>Регистрация</Title>
      </div>

      {generalError && (
        <Alert
          message="Ошибка регистрации"
          description={generalError}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="fullName"
          label="Полное имя"
          rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
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
          validateStatus={emailError ? 'error' : ''}
          help={emailError}
          rules={[
            { required: true, message: 'Пожалуйста, введите ваш email' },
            { type: 'email', message: 'Пожалуйста, введите корректный email' }
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
            { required: true, message: 'Пожалуйста, введите ваш пароль' },
            { min: 6, message: 'Пароль должен содержать минимум 6 символов' }
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
            { required: true, message: 'Пожалуйста, подтвердите ваш пароль' },
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
            prefix={<CheckCircleOutlined />} 
            placeholder="Подтвердите пароль" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<UserAddOutlined />}
            loading={isLoading}
            className="login-form-button"
            size="large"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">
          Уже есть аккаунт?{' '}
          <Link href="/login">
            Войти
          </Link>
        </Text>
      </div>
    </Card>
  );
}
