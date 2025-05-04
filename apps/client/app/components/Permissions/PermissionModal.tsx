'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface Permission {
  id: number;
  name: string;
  description: string | null;
}

interface PermissionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { name: string; description?: string | null }) => void;
  permission: Permission | null;
}

export default function PermissionModal({ 
  visible, 
  onCancel, 
  onSubmit, 
  permission 
}: PermissionModalProps) {
  const [form] = Form.useForm();

  // Reset form when modal opens/closes or permission changes
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: permission?.name || '',
        description: permission?.description || '',
      });
    } else {
      form.resetFields();
    }
  }, [visible, permission, form]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={permission ? 'Редактировать разрешение' : 'Создать разрешение'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {permission ? 'Сохранить' : 'Создать'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: permission?.name || '',
          description: permission?.description || '',
        }}
      >
        <Form.Item
          name="name"
          label="Название"
          rules={[
            { required: true, message: 'Пожалуйста, введите название разрешения' },
            { min: 3, message: 'Название должно содержать минимум 3 символа' },
          ]}
        >
          <Input placeholder="Введите название разрешения" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Описание"
        >
          <Input.TextArea 
            placeholder="Введите описание разрешения (необязательно)" 
            rows={4} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}