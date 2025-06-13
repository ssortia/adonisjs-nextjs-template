'use client';

import { ConfigProvider, theme } from 'antd';
import { ThemeContext, useThemeState } from '../hooks/useTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeState = useThemeState();

  // Не рендерим до монтирования, чтобы избежать мерцания
  if (!themeState.mounted) {
    return null;
  }

  const antdTheme = {
    algorithm: themeState.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
    },
  };

  return (
    <ThemeContext.Provider value={themeState}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}