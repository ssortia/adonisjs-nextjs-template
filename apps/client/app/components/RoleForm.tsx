import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, Space, Checkbox, Card, Row, Col, Divider } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { Role, RoleFormData, Permission } from '../types';

interface RoleFormProps {
  role?: Role | null;
  permissions: Permission[];
  onSubmit: (values: RoleFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function RoleForm({
  role,
  permissions,
  onSubmit,
  onCancel,
  loading = false,
}: RoleFormProps) {
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Группировка прав по префиксу (users, roles, permissions и т.д.)
  const groupedPermissions = useMemo(() => {
    const groups: { [key: string]: Permission[] } = {};
    
    permissions.forEach(permission => {
      const [prefix] = permission.name.split('.');
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(permission);
    });

    return groups;
  }, [permissions]);

  // Получение русских названий для групп
  const getGroupTitle = (groupKey: string) => {
    const titles: { [key: string]: string } = {
      users: 'Пользователи',
      roles: 'Роли',
      permissions: 'Права',
      dashboard: 'Панель управления',
      settings: 'Настройки',
    };
    return titles[groupKey] || groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
  };

  // Получение русских названий для операций
  const getActionTitle = (action: string) => {
    const titles: { [key: string]: string } = {
      view: 'Просмотр',
      create: 'Создание',
      edit: 'Редактирование',
      delete: 'Удаление',
      manage: 'Управление',
    };
    return titles[action] || action;
  };

  useEffect(() => {
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
      });
      
      if (role.permissions) {
        setSelectedPermissions(role.permissions.map(p => p.id));
      }
    } else {
      form.resetFields();
      setSelectedPermissions([]);
    }
  }, [role, form]);

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit({
        ...values,
        permissions: selectedPermissions,
      });
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions(prev => 
      checked 
        ? [...prev, permissionId]
        : prev.filter(id => id !== permissionId)
    );
  };

  const handleGroupChange = (groupPermissions: Permission[], checked: boolean) => {
    const groupIds = groupPermissions.map(p => p.id);
    setSelectedPermissions(prev => 
      checked 
        ? [...new Set([...prev, ...groupIds])]
        : prev.filter(id => !groupIds.includes(id))
    );
  };

  const isGroupChecked = (groupPermissions: Permission[]) => {
    const groupIds = groupPermissions.map(p => p.id);
    return groupIds.every(id => selectedPermissions.includes(id));
  };

  const isGroupIndeterminate = (groupPermissions: Permission[]) => {
    const groupIds = groupPermissions.map(p => p.id);
    const checkedCount = groupIds.filter(id => selectedPermissions.includes(id)).length;
    return checkedCount > 0 && checkedCount < groupIds.length;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={loading}
    >
      <Form.Item
        label="Название роли"
        name="name"
        rules={[
          { required: true, message: 'Введите название роли' },
          { min: 2, message: 'Название должно содержать минимум 2 символа' },
          { max: 50, message: 'Название не должно превышать 50 символов' },
        ]}
      >
        <Input placeholder="Введите название роли" />
      </Form.Item>

      <Form.Item
        label="Описание"
        name="description"
        rules={[
          { max: 255, message: 'Описание не должно превышать 255 символов' },
        ]}
      >
        <Input.TextArea 
          placeholder="Введите описание роли" 
          rows={3}
        />
      </Form.Item>

      <Divider>Права доступа</Divider>

      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto', 
        overflowX: 'hidden',
        padding: '8px 0' 
      }}>
        <Row gutter={[16, 16]}>
          {Object.entries(groupedPermissions).map(([groupKey, groupPermissions]) => (
            <Col span={24} key={groupKey}>
              <Card 
                size="small" 
                title={
                  <Checkbox
                    checked={isGroupChecked(groupPermissions)}
                    indeterminate={isGroupIndeterminate(groupPermissions)}
                    onChange={(e) => handleGroupChange(groupPermissions, e.target.checked)}
                  >
                    <strong>{getGroupTitle(groupKey)}</strong>
                  </Checkbox>
                }
                bodyStyle={{ padding: '12px 16px' }}
                style={{ width: '100%', minWidth: 0 }}
              >
                <Row gutter={[8, 8]} style={{ margin: 0 }}>
                  {groupPermissions.sort((a, b) => a.id - b.id).map(permission => {
                    const [, action] = permission.name.split('.');
                    return (
                      <Col 
                        xs={24} 
                        sm={12} 
                        md={12} 
                        lg={12}
                        xl={12}
                        key={permission.id}
                        style={{ minWidth: 0 }}
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                          style={{ width: '100%', whiteSpace: 'normal', wordBreak: 'break-word' }}
                        >
                          <span style={{ fontSize: '14px' }}>
                            {permission.description || getActionTitle(action)}
                          </span>
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button 
            onClick={onCancel}
            icon={<CloseOutlined />}
          >
            Отмена
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SaveOutlined />}
          >
            {role ? 'Обновить' : 'Создать'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}