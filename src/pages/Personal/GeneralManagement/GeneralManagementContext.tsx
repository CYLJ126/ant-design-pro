import React, { createContext, useContext, useEffect, useState } from 'react';

const GeneralManagementContext = createContext({});

export function GeneralManagementProvider({ children }) {
  const [sideBarSpan, setSideBarSpan] = useState(6);

  useEffect(() => {}, []);

  // 提供访问方法给子组件
  const value = {
    sideBarSpan,
    setSideBarSpan,
  };

  return (
    <GeneralManagementContext.Provider value={value}>{children}</GeneralManagementContext.Provider>
  );
}

// 自定义 hook 方便使用
export function useGeneralManagementData() {
  const context = useContext(GeneralManagementContext);
  if (!context) {
    throw new Error('useGeneralManagementData must be used within a DataProvider');
  }
  return context;
}
