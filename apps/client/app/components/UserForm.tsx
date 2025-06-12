import { Form, Input, Select, Space, Button } from 'antd';
import type { User, Role, UserFormData } from '../types';

interface UserFormProps {
  user?: User | null;
  roles: Role[];
  onSubmit: (values: UserFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function UserForm({ user, roles, onSubmit, onCancel, loading = false }: UserFormProps) {
  const [form] = Form.useForm();
  const isEditing = !!user;

  const handleSubmit = async (values: UserFormData) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={
        isEditing
          ? {
              fullName: user?.fullName,
              email: user?.email,
              roleId: user?.roleId,
            }
          : undefined
      }
    >
      <Form.Item
        name="fullName"
        label="Полное имя"
        rules={[
          { max: 255, message: 'Имя не должно превышать 255 символов' },
        ]}
      >
        <Input placeholder="Введите полное имя" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Введите email' },
          { type: 'email', message: 'Введите корректный email' },
          { max: 255, message: 'Email не должен превышать 255 символов' },
        ]}
      >
        <Input placeholder="Введите email" />
      </Form.Item>

      {!isEditing && (
        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, message: 'Пароль должен быть не менее 6 символов' },
            { max: 255, message: 'Пароль не должен превышать 255 символов' },
          ]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>
      )}

      <Form.Item
        name="roleId"
        label="Роль"
      >
        <Select placeholder="Выберите роль" allowClear>
          {roles.map((role) => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
              {role.description && ` - ${role.description}`}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel} disabled={loading}>
            Отмена
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? 'Обновить' : 'Создать'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
