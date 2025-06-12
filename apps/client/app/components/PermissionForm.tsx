import { Form, Input, Space, Button } from 'antd';
import type { Permission, PermissionFormData } from '../types';

const { TextArea } = Input;

interface PermissionFormProps {
  permission?: Permission | null;
  onSubmit: (values: PermissionFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function PermissionForm({ 
  permission, 
  onSubmit, 
  onCancel, 
  loading = false 
}: PermissionFormProps) {
  const [form] = Form.useForm();
  const isEditing = !!permission;

  const handleSubmit = async (values: PermissionFormData) => {
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
              name: permission?.name,
              description: permission?.description,
            }
          : undefined
      }
    >
      <Form.Item
        name="name"
        label="Название разрешения"
        rules={[
          { required: true, message: 'Введите название разрешения' },
          { max: 255, message: 'Название не должно превышать 255 символов' },
          { 
            pattern: /^[a-zA-Z0-9._-]+$/, 
            message: 'Название может содержать только буквы, цифры, точки, подчеркивания и дефисы' 
          },
        ]}
      >
        <Input 
          placeholder="Например: users.view, admin.access" 
          disabled={isEditing} // Не позволяем изменять название при редактировании
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Описание"
        rules={[
          { max: 500, message: 'Описание не должно превышать 500 символов' },
        ]}
      >
        <TextArea 
          placeholder="Описание разрешения (необязательно)"
          rows={3}
          maxLength={500}
          showCount
        />
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
