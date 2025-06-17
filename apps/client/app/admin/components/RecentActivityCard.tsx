import { Card, List, Avatar, Space, Tag, Typography, Button } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

const RecentActivityCard: React.FC = () => {
  const recentActivities: ActivityItem[] = [
    {
      user: 'Александр К.',
      action: 'создал нового пользователя',
      time: '2 минуты назад',
      type: 'success',
    },
    {
      user: 'Мария С.',
      action: 'обновила роль пользователя',
      time: '15 минут назад',
      type: 'info',
    },
    { user: 'Дмитрий П.', action: 'удалил разрешение', time: '1 час назад', type: 'warning' },
    { user: 'Елена В.', action: 'изменила настройки системы', time: '3 часа назад', type: 'info' },
  ];

  return (
    <Card title="Последняя активность" extra={<Button type="link">Показать все</Button>}>
      <List
        dataSource={recentActivities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Space>
                  <Text strong>{item.user}</Text>
                  <Text>{item.action}</Text>
                </Space>
              }
              description={
                <Space>
                  <ClockCircleOutlined />
                  <Text type="secondary">{item.time}</Text>
                  <Tag
                    color={
                      item.type === 'success'
                        ? 'green'
                        : item.type === 'warning'
                          ? 'orange'
                          : 'blue'
                    }
                  >
                    {item.type === 'success'
                      ? 'Создание'
                      : item.type === 'warning'
                        ? 'Удаление'
                        : 'Обновление'}
                  </Tag>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivityCard;