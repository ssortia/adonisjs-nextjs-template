'use client';

import { useEffect, useState } from 'react';
import { Button, Table, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { adminApi } from '@/app/services/api';
import PermissionModal from './PermissionModal';

interface Permission {
  id: number;
  name: string;
  description: string | null;
}

export default function PermissionsList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  // Fetch permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  // Fetch all permissions
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPermissions();
      setPermissions(response.permissions);
    } catch (error) {
      message.error('Не удалось загрузить разрешения');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle permission deletion
  const handleDelete = async (id: number) => {
    try {
      await adminApi.deletePermission(id);
      message.success('Разрешение успешно удалено');
      fetchPermissions(); // Refresh the list
    } catch (error) {
      message.error('Не удалось удалить разрешение');
      console.error(error);
    }
  };

  // Handle opening edit modal
  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setModalVisible(true);
  };

  // Handle opening create modal
  const handleCreate = () => {
    setEditingPermission(null);
    setModalVisible(true);
  };

  // Handle modal submit (create or update)
  const handleModalSubmit = async (values: { name: string; description?: string | null }) => {
    try {
      if (editingPermission) {
        // Update existing permission
        await adminApi.updatePermission(editingPermission.id, values);
        message.success('Разрешение успешно обновлено');
      } else {
        // Create new permission
        await adminApi.createPermission(values);
        message.success('Разрешение успешно создано');
      }
      setModalVisible(false);
      fetchPermissions(); // Refresh the list
    } catch (error) {
      message.error('Не удалось сохранить разрешение');
      console.error(error);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      render: (text: string | null) => text || '-',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Permission) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          >
            Изменить
          </Button>
          <Popconfirm
            title="Удалить разрешение?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Управление разрешениями</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
        >
          Добавить разрешение
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={permissions} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal for creating/editing permissions */}
      <PermissionModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        permission={editingPermission}
      />
    </div>
  );
}