'use client';

import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  // Load CSS in client side
  useEffect(() => {
    // Dynamic import the CSS
    import('antd/dist/reset.css').catch(err => {
      console.error('Failed to load Ant Design styles:', err);
    });
  }, []);
  
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 4,
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}