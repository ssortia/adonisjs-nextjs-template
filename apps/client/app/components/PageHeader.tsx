import { ReactNode } from 'react';
import { Space, Typography } from 'antd';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
}

export default function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div style={{ 
      marginBottom: '24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start' 
    }}>
      <div>
        <Title level={2} style={{ margin: 0, marginBottom: subtitle ? '4px' : 0 }}>
          {title}
        </Title>
        {subtitle && (
          <Typography.Text type="secondary">
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {extra && (
        <Space>
          {extra}
        </Space>
      )}
    </div>
  );
}
