'use client';

import React from 'react';

// Simple wrapper component that doesn't require any special styling
export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}