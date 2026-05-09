// src/components/KeepAliveWrapper/index.tsx
import React from 'react';
import KeepAlive from 'react-activation';
import { useLocation } from '@umijs/max';

export interface KeepAliveWrapperProps {
  children?: React.ReactNode;
}

const KeepAliveWrapper: React.FC<KeepAliveWrapperProps> = ({ children }) => {
  const location = useLocation();
  const cacheKey = `${location.pathname}${location.search || ''}`;

  console.log('KeepAliveWrapper render:', {
    pathname: location.pathname,
    cacheKey,
    hasChildren: !!children,
  });

  return (
    <KeepAlive cacheKey={cacheKey} name={cacheKey}>
      <div style={{ height: '100%' }}>
        {children}
      </div>
    </KeepAlive>
  );
};

// 创建一个 HOC 函数
export const withKeepAlive = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithKeepAliveComponent: React.FC<P> = (props) => {
    const location = useLocation();
    const cacheKey = `${location.pathname}${location.search || ''}`;

    return (
      <KeepAlive cacheKey={cacheKey} name={cacheKey}>
        <WrappedComponent {...props} />
      </KeepAlive>
    );
  };

  WithKeepAliveComponent.displayName = `withKeepAlive(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithKeepAliveComponent;
};

export default KeepAliveWrapper;
