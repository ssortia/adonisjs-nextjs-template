import { Card, List, Avatar, Space, Tag, Typography, Select, Input, Button } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  StopOutlined, 
  WarningOutlined, 
  InfoCircleOutlined, 
  BugOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  service: string;
  message: string;
  details: string;
}

const SystemLogsCard: React.FC = () => {
  const systemLogs: LogEntry[] = [
    {
      id: 1,
      timestamp: '2024-01-17 15:42:33',
      level: 'info',
      service: 'API',
      message: 'Пользователь успешно авторизован',
      details: 'User ID: 12345, IP: 192.168.1.10'
    },
    {
      id: 2,
      timestamp: '2024-01-17 15:41:28',
      level: 'warning',
      service: 'Database',
      message: 'Медленный запрос к базе данных',
      details: 'Query execution time: 2.5s, Table: users'
    },
    {
      id: 3,
      timestamp: '2024-01-17 15:40:15',
      level: 'error',
      service: 'Storage',
      message: 'Ошибка загрузки файла',
      details: 'File: document.pdf, Size: 2.5MB, Error: Connection timeout'
    },
    {
      id: 4,
      timestamp: '2024-01-17 15:39:44',
      level: 'info',
      service: 'Cache',
      message: 'Кеш успешно обновлен',
      details: 'Cache key: user_sessions, TTL: 3600s'
    },
    {
      id: 5,
      timestamp: '2024-01-17 15:38:12',
      level: 'debug',
      service: 'Auth',
      message: 'Попытка входа пользователя',
      details: 'Email: user@example.com, IP: 192.168.1.15'
    }
  ];

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'red';
      case 'warning':
        return 'orange';
      case 'info':
        return 'blue';
      case 'debug':
        return 'gray';
      default:
        return 'default';
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <StopOutlined />;
      case 'warning':
        return <WarningOutlined />;
      case 'info':
        return <InfoCircleOutlined />;
      case 'debug':
        return <BugOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  return (
    <Card 
      title="Логи системы" 
      extra={
        <Space>
          <Select
            placeholder="Уровень"
            style={{ width: 100 }}
            allowClear
            size="small"
          >
            <Select.Option value="error">Error</Select.Option>
            <Select.Option value="warning">Warning</Select.Option>
            <Select.Option value="info">Info</Select.Option>
            <Select.Option value="debug">Debug</Select.Option>
          </Select>
          <Input
            placeholder="Поиск"
            prefix={<SearchOutlined />}
            style={{ width: 120 }}
            size="small"
          />
          <Button 
            type="link" 
            icon={<FilterOutlined />}
            size="small"
          >
            Все логи
          </Button>
        </Space>
      }
    >
      <List
        dataSource={systemLogs}
        size="small"
        renderItem={(log) => (
          <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <Avatar 
                  size="small" 
                  icon={getLogLevelIcon(log.level)}
                  style={{ 
                    backgroundColor: getLogLevelColor(log.level) === 'default' ? '#d9d9d9' : undefined,
                    marginRight: '8px'
                  }}
                />
                <Space size="small" style={{ flex: 1 }}>
                  <Tag color={getLogLevelColor(log.level)}>
                    {log.level.toUpperCase()}
                  </Tag>
                  <Tag color="default">
                    {log.service}
                  </Tag>
                  <Text 
                    type="secondary" 
                    style={{ fontSize: '11px', marginLeft: 'auto' }}
                  >
                    {log.timestamp}
                  </Text>
                </Space>
              </div>
              <div style={{ marginLeft: '32px' }}>
                <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '2px' }}>
                  {log.message}
                </Text>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: '11px', 
                    fontFamily: 'monospace',
                    color: '#8c8c8c',
                    wordBreak: 'break-all'
                  }}
                >
                  {log.details}
                </Text>
              </div>
            </div>
          </List.Item>
        )}
      />
      <div style={{ 
        textAlign: 'center', 
        marginTop: '12px', 
        padding: '8px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <Button type="link" size="small">
          Загрузить еще логи
        </Button>
      </div>
    </Card>
  );
};

export default SystemLogsCard;