// src/components/PageWrapper/index.tsx
import React from 'react';
import KeepAlive from 'react-activation';
import { useLocation } from '@umijs/max';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const location = useLocation();
  const cacheKey = `${location.pathname}${location.search || ''}`;

  console.log('PageWrapper render:', {
    pathname: location.pathname,
    cacheKey,
    timestamp: new Date().toLocaleTimeString(),
  });

  return (
    <KeepAlive cacheKey={cacheKey} name={cacheKey} when>
      <div style={{ height: '100%' }}>
        {children}
      </div>
    </KeepAlive>
  );
};

export default PageWrapper;
