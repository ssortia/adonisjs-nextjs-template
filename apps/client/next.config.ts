import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://127.0.0.1:3030', 'http://localhost:3030'],
  transpilePackages: ['antd', '@ant-design/icons'],
};

export default nextConfig;
